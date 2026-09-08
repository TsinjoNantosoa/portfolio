import json
from datetime import datetime, timedelta, timezone

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
        return [KnowledgeChunk(id="1", type="project", slug="arcwell", title="Arcwell", section="Case study", url="https://example.test/work/arcwell", content="Evidence", score=.9)], tokens()


def settings(**overrides):
    values = dict(environment="test", session_secret="test-secret-that-is-long-enough-123", cors_origins=["https://portfolio.test"], openai_api_key="test", max_input_chars=100, ip_rate_limit_per_minute=10, session_rate_limit_per_hour=10)
    values.update(overrides)
    return Settings(**values)


def auth(client: TestClient):
    return {"Authorization": f"Bearer {client.post('/api/public/session').json()['token']}"}


def test_health_and_session_claims():
    with TestClient(create_app(settings(), FakeChat())) as client:
        health = client.get("/health")
        assert health.status_code == 200
        assert health.json() == {"status": "ok", "service": "tsinjo-portfolio-ai", "ready": True}
        session = client.post("/api/public/session")
        payload = jwt.decode(session.json()["token"], settings().session_secret, algorithms=[ALGORITHM])
        assert payload["scope"] == "portfolio_chat"
        assert payload["tenant"] == "portfolio"
        assert payload["sub"] == "anonymous"


def test_expired_and_wrong_scope_tokens_are_rejected():
    config = settings()
    now = datetime.now(timezone.utc)
    expired = jwt.encode({"sub": "anonymous", "sid": "x", "scope": "portfolio_chat", "tenant": "portfolio", "iat": now - timedelta(hours=2), "exp": now - timedelta(hours=1)}, config.session_secret, algorithm=ALGORITHM)
    wrong = jwt.encode({"sub": "anonymous", "sid": "x", "scope": "admin", "tenant": "portfolio", "iat": now, "exp": now + timedelta(minutes=5)}, config.session_secret, algorithm=ALGORITHM)
    with TestClient(create_app(config, FakeChat())) as client:
        assert client.post("/api/public/chat/stream", json={"message": "Arcwell"}, headers={"Authorization": f"Bearer {expired}"}).status_code == 401
        assert client.post("/api/public/chat/stream", json={"message": "Arcwell"}, headers={"Authorization": f"Bearer {wrong}"}).status_code == 403


def test_validation_streaming_and_grounded_sources():
    with TestClient(create_app(settings(), FakeChat())) as client:
        headers = auth(client)
        assert client.post("/api/public/chat/stream", json={"message": "x" * 101}, headers=headers).status_code == 422
        assert client.post("/api/public/chat/stream", json={"message": "Arcwell", "conversation_id": "another-session"}, headers=headers).status_code == 403
        response = client.post("/api/public/chat/stream", json={"message": "Tell me about Arcwell"}, headers=headers)
        assert response.status_code == 200
        assert response.headers["content-type"].startswith("text/event-stream")
        assert '"type": "delta"' in response.text
        events = [json.loads(line[6:]) for line in response.text.splitlines() if line.startswith("data: ")]
        assert "".join(event.get("text", "") for event in events) == "Grounded answer."
        assert "https://example.test/work/arcwell" in response.text
        assert events[-1]["suggested_links"][0]["label"] == "Open Arcwell"


def test_rate_limit_and_cors_allowlist():
    config = settings(ip_rate_limit_per_minute=1)
    with TestClient(create_app(config, FakeChat())) as client:
        assert client.post("/api/public/session").status_code == 200
        limited = client.post("/api/public/session")
        assert limited.status_code == 429
        assert "Retry-After" in limited.headers
        allowed = client.options("/api/public/session", headers={"Origin": "https://portfolio.test", "Access-Control-Request-Method": "POST"})
        assert allowed.headers.get("access-control-allow-origin") == "https://portfolio.test"
        denied = client.options("/api/public/session", headers={"Origin": "https://evil.test", "Access-Control-Request-Method": "POST"})
        assert "access-control-allow-origin" not in denied.headers


def test_production_rejects_weak_secret_and_wildcard_cors():
    for values in ({"environment": "production", "session_secret": "short"}, {"environment": "production", "session_secret": "development-only-change-this-secret"}, {"cors_origins": ["*"]}):
        try:
            settings(**values)
            assert False, "Settings should reject insecure configuration"
        except ValueError:
            pass
