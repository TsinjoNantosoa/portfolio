import json
from datetime import UTC, datetime, timedelta

import jwt
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app
from app.schemas import KnowledgeChunk
from app.security import ALGORITHM


class FakeChat:
    async def stream(self, message: str):
        async def tokens():
            yield "Grounded "
            yield "answer."

        return [
            KnowledgeChunk(
                id="1",
                type="project",
                slug="arcwell",
                title="Arcwell",
                section="Case study",
                url="https://example.test/work/arcwell",
                content="Evidence",
                score=0.9,
            )
        ], tokens()

    async def readiness(self):
        return {"ready": True, "documents": 51}


class FailingChat:
    async def stream(self, _message: str):
        raise RuntimeError("provider-secret-details")

    async def readiness(self):
        raise RuntimeError("qdrant-private-details")


def settings(**overrides):
    values = {
        "environment": "test",
        "session_secret": "test-secret-that-is-long-enough-123",
        "allowed_origins": ["https://portfolio.test"],
        "openai_api_key": "test",
        "max_input_chars": 100,
        "ip_rate_limit_per_minute": 10,
        "session_rate_limit_per_hour": 10,
    }
    values.update(overrides)
    return Settings(_env_file=None, **values)


def auth(client: TestClient):
    return {
        "Authorization": f"Bearer {client.post('/api/public/session').json()['token']}"
    }


def test_low_cost_openai_defaults_are_canonical():
    config = Settings(environment="test", _env_file=None)
    assert config.openai_model == "gpt-4o-mini"
    assert config.openai_embedding_model == "text-embedding-3-small"
    assert config.openai_max_output_tokens == 450
    assert config.openai_timeout_seconds == 60
    assert config.rag_top_k == 4


def test_health_and_session_claims():
    with TestClient(create_app(settings(), FakeChat())) as client:
        health = client.get("/health")
        assert health.status_code == 200
        assert health.json() == {"status": "ok", "service": "tsinjo-portfolio-ai"}
        assert health.headers["x-request-id"]
        assert client.get("/ready").json() == {
            "status": "ready",
            "collection": "portfolio_knowledge",
            "documents": 51,
        }
        session = client.post("/api/public/session")
        payload = jwt.decode(
            session.json()["token"], settings().session_secret, algorithms=[ALGORITHM]
        )
        assert payload["scope"] == "portfolio_chat"
        assert payload["tenant"] == "portfolio"
        assert payload["sub"] == "anonymous"


def test_expired_and_wrong_scope_tokens_are_rejected():
    config = settings()
    now = datetime.now(UTC)
    expired = jwt.encode(
        {
            "sub": "anonymous",
            "sid": "x",
            "scope": "portfolio_chat",
            "tenant": "portfolio",
            "iat": now - timedelta(hours=2),
            "exp": now - timedelta(hours=1),
        },
        config.session_secret,
        algorithm=ALGORITHM,
    )
    wrong = jwt.encode(
        {
            "sub": "anonymous",
            "sid": "x",
            "scope": "admin",
            "tenant": "portfolio",
            "iat": now,
            "exp": now + timedelta(minutes=5),
        },
        config.session_secret,
        algorithm=ALGORITHM,
    )
    wrong_tenants = [
        jwt.encode(
            {
                "sub": "anonymous",
                "sid": "x",
                "scope": "portfolio_chat",
                "tenant": tenant,
                "iat": now,
                "exp": now + timedelta(minutes=5),
            },
            config.session_secret,
            algorithm=ALGORITHM,
        )
        for tenant in ("h4h", "aaa", "victrix", "arbitrary")
    ]
    with TestClient(create_app(config, FakeChat())) as client:
        expired_response = client.post(
            "/api/public/chat/stream",
            json={"message": "Arcwell"},
            headers={"Authorization": f"Bearer {expired}"},
        )
        assert expired_response.status_code == 401
        assert expired_response.json()["error"]["code"] == "SESSION_INVALID"
        assert (
            client.post(
                "/api/public/chat/stream",
                json={"message": "Arcwell"},
                headers={"Authorization": f"Bearer {wrong}"},
            ).status_code
            == 403
        )
        for wrong_tenant in wrong_tenants:
            assert (
                client.post(
                    "/api/public/chat/stream",
                    json={"message": "Arcwell"},
                    headers={"Authorization": f"Bearer {wrong_tenant}"},
                ).status_code
                == 403
            )
        malformed = client.post(
            "/api/public/chat/stream",
            json={"message": "Arcwell"},
            headers={"Authorization": "Bearer definitely-not-a-jwt"},
        )
        assert malformed.status_code == 401
        assert "definitely-not-a-jwt" not in malformed.text


def test_validation_streaming_and_grounded_sources():
    with TestClient(create_app(settings(), FakeChat())) as client:
        headers = auth(client)
        assert (
            client.post(
                "/api/public/chat/stream", json={"message": "x" * 101}, headers=headers
            ).status_code
            == 422
        )
        assert (
            client.post(
                "/api/public/chat/stream",
                json={"message": "Arcwell", "conversation_id": "another-session"},
                headers=headers,
            ).status_code
            == 403
        )
        response = client.post(
            "/api/public/chat/stream",
            json={"message": "Tell me about Arcwell"},
            headers=headers,
        )
        assert response.status_code == 200
        assert response.headers["content-type"].startswith("text/event-stream")
        assert '"type": "delta"' in response.text
        events = [
            json.loads(line[6:])
            for line in response.text.splitlines()
            if line.startswith("data: ")
        ]
        assert "".join(event.get("text", "") for event in events) == "Grounded answer."
        assert "https://example.test/work/arcwell" in response.text
        assert events[-1]["suggested_links"][0]["label"] == "View Arcwell"


def test_rate_limit_and_cors_allowlist():
    config = settings(ip_rate_limit_per_minute=1)
    with TestClient(create_app(config, FakeChat())) as client:
        assert client.post("/api/public/session").status_code == 200
        limited = client.post("/api/public/session")
        assert limited.status_code == 429
        assert "Retry-After" in limited.headers
        allowed = client.options(
            "/api/public/session",
            headers={
                "Origin": "https://portfolio.test",
                "Access-Control-Request-Method": "POST",
            },
        )
        assert (
            allowed.headers.get("access-control-allow-origin")
            == "https://portfolio.test"
        )
        denied = client.options(
            "/api/public/session",
            headers={
                "Origin": "https://evil.test",
                "Access-Control-Request-Method": "POST",
            },
        )
        assert "access-control-allow-origin" not in denied.headers


def test_production_cors_allows_only_canonical_netlify_origin():
    config = Settings(
        environment="production",
        session_secret="production-session-secret-longer-than-32-characters",
        allowed_origins=["https://tsinjona.netlify.app"],
        public_site_url="https://tsinjona.netlify.app",
        _env_file=None,
    )
    with TestClient(create_app(config, FakeChat())) as client:
        allowed = client.options(
            "/api/public/session",
            headers={
                "Origin": "https://tsinjona.netlify.app",
                "Access-Control-Request-Method": "POST",
            },
        )
        denied = client.options(
            "/api/public/session",
            headers={
                "Origin": "https://evil.example",
                "Access-Control-Request-Method": "POST",
            },
        )
        assert (
            allowed.headers.get("access-control-allow-origin")
            == "https://tsinjona.netlify.app"
        )
        assert "access-control-allow-origin" not in denied.headers


def test_rate_limit_uses_resolved_render_client_ip():
    config = settings(ip_rate_limit_per_minute=1, trust_proxy_headers=True)
    with TestClient(create_app(config, FakeChat())) as client:
        assert (
            client.post(
                "/api/public/session",
                headers={"X-Forwarded-For": "203.0.113.10, 10.0.0.2"},
            ).status_code
            == 200
        )
        assert (
            client.post(
                "/api/public/session",
                headers={"X-Forwarded-For": "203.0.113.10, 10.0.0.99"},
            ).status_code
            == 429
        )
        assert (
            client.post(
                "/api/public/session",
                headers={"X-Forwarded-For": "203.0.113.11, 10.0.0.2"},
            ).status_code
            == 200
        )


def test_production_rejects_weak_secret_and_wildcard_cors():
    for values in (
        {"environment": "production", "session_secret": "short"},
        {
            "environment": "production",
            "session_secret": "development-only-change-this-secret",
        },
        {"allowed_origins": ["*"]},
        {
            "environment": "production",
            "session_secret": "production-secret-that-is-long-enough",
            "public_site_url": "https://different.test",
        },
    ):
        try:
            settings(**values)
            assert False, "Settings should reject insecure configuration"
        except ValueError:
            pass


def test_unconfigured_readiness_is_safe():
    config = settings(openai_api_key="", qdrant_url="")
    with TestClient(create_app(config)) as client:
        assert client.get("/health").status_code == 200
        response = client.get("/ready")
        assert response.status_code == 503
        assert response.json()["error"]["code"] == "ASSISTANT_UNAVAILABLE"
        assert "openai" not in response.text.lower()


def test_provider_failures_return_safe_errors_without_internal_details():
    with TestClient(create_app(settings(), FailingChat())) as client:
        readiness = client.get("/ready")
        assert readiness.status_code == 503
        assert readiness.json()["error"]["code"] == "ASSISTANT_UNAVAILABLE"
        response = client.post(
            "/api/public/chat/stream",
            json={"message": "Tell me about Arcwell"},
            headers=auth(client),
        )
        assert response.status_code == 200
        assert '"type": "error"' in response.text
        assert '"code": "STREAM_FAILED"' in response.text
        assert "provider-secret-details" not in response.text
        assert "qdrant-private-details" not in readiness.text
