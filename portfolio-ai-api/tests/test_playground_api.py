import asyncio
from contextlib import suppress

import httpx
import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.errors import PlaygroundUnavailableError
from app.main import create_app


class FakePlaygroundChat:
    async def readiness(self):
        return {"ready": True, "documents": 73}

    async def stream(self, _message: str):
        raise AssertionError("The assistant stream must not be used by the Playground")

    async def playground(self, message: str, corpus: str):
        return {
            "answer": f"Grounded answer for {message}",
            "corpus": corpus,
            "execution_mode": "live",
            "generated_from_retrieved_documents": True,
            "citations_available": True,
            "support_status": "not_evaluated",
            "refusal_reason": None,
            "evidence": [
                {
                    "id": "project:sihia:architecture",
                    "rank": 1,
                    "title": "SIHIA",
                    "section": "Architecture",
                    "url": "/work/sihia",
                    "excerpt": "Hybrid retrieval combines dense search and BM25.",
                    "score": 0.91,
                }
            ],
            "trace": [
                {
                    "id": "query",
                    "status": "completed",
                    "detail": "Question accepted.",
                    "duration_ms": 0.1,
                }
            ],
            "retrieval_strategy": "Dense retrieval + lexical reranking",
            "selected_passages": 1,
            "response_time_ms": 14.2,
            "limitations": ["Public corpus only."],
        }


class FailingPlaygroundChat(FakePlaygroundChat):
    async def playground(self, _message: str, _corpus: str):
        raise RuntimeError("provider-secret-details")


class UnavailablePlaygroundChat(FakePlaygroundChat):
    async def playground(self, _message: str, _corpus: str):
        raise PlaygroundUnavailableError("provider-secret-details")


def settings(**overrides):
    values = {
        "environment": "test",
        "session_secret": "test-secret-that-is-long-enough-123",
        "allowed_origins": ["https://portfolio.test"],
        "openai_api_key": "test",
        "playground_enabled": True,
        "ip_rate_limit_per_minute": 20,
        "playground_session_rate_limit_per_hour": 3,
    }
    values.update(overrides)
    return Settings(_env_file=None, **values)


def session(client: TestClient):
    payload = client.post("/api/public/session").json()
    return payload, {"Authorization": f"Bearer {payload['token']}"}


def test_playground_returns_observable_evidence_without_claiming_verification():
    with TestClient(create_app(settings(), FakePlaygroundChat())) as client:
        active, headers = session(client)
        response = client.post(
            "/api/public/playground/query",
            headers=headers,
            json={
                "message": "How does SIHIA retrieve evidence?",
                "corpus": "projects",
                "conversation_id": active["session_id"],
            },
        )

        assert response.status_code == 200
        body = response.json()
        assert body["execution_mode"] == "live"
        assert body["generated_from_retrieved_documents"] is True
        assert body["citations_available"] is True
        assert body["support_status"] == "not_evaluated"
        assert body["evidence"][0]["url"] == "/work/sihia"
        assert body["evidence"][0]["excerpt"]
        assert body["trace"][0]["id"] == "query"
        assert body["request_id"] == response.headers["x-request-id"]


def test_playground_rejects_unknown_corpus_long_input_and_wrong_session():
    with TestClient(create_app(settings(), FakePlaygroundChat())) as client:
        active, headers = session(client)
        invalid_corpus = client.post(
            "/api/public/playground/query",
            headers=headers,
            json={"message": "SIHIA", "corpus": "private"},
        )
        assert invalid_corpus.status_code == 422
        assert "private" not in invalid_corpus.text

        too_long = client.post(
            "/api/public/playground/query",
            headers=headers,
            json={"message": "x" * 401, "corpus": "projects"},
        )
        assert too_long.status_code == 413
        assert too_long.json()["error"]["code"] == "PAYLOAD_TOO_LARGE"

        wrong_session = client.post(
            "/api/public/playground/query",
            headers=headers,
            json={
                "message": "SIHIA",
                "corpus": "projects",
                "conversation_id": active["session_id"] + "-other",
            },
        )
        assert wrong_session.status_code == 403


def test_playground_has_a_separate_rate_limit_and_kill_switch():
    config = settings(playground_session_rate_limit_per_hour=1)
    with TestClient(create_app(config, FakePlaygroundChat())) as client:
        _active, headers = session(client)
        payload = {"message": "SIHIA", "corpus": "projects"}
        assert client.post(
            "/api/public/playground/query", headers=headers, json=payload
        ).status_code == 200
        limited = client.post(
            "/api/public/playground/query", headers=headers, json=payload
        )
        assert limited.status_code == 429
        assert limited.headers["retry-after"]

    with TestClient(
        create_app(settings(playground_enabled=False), FakePlaygroundChat())
    ) as client:
        _active, headers = session(client)
        disabled = client.post(
            "/api/public/playground/query",
            headers=headers,
            json={"message": "SIHIA", "corpus": "projects"},
        )
        assert disabled.status_code == 503
        assert disabled.json()["error"]["code"] == "PLAYGROUND_DISABLED"


def test_playground_ip_quota_survives_anonymous_session_renewal():
    config = settings(
        playground_session_rate_limit_per_hour=10,
        playground_ip_rate_limit_per_hour=1,
        playground_global_rate_limit_per_hour=10,
    )
    with TestClient(create_app(config, FakePlaygroundChat())) as client:
        _first, first_headers = session(client)
        payload = {"message": "SIHIA", "corpus": "projects"}
        assert client.post(
            "/api/public/playground/query", headers=first_headers, json=payload
        ).status_code == 200

        _renewed, renewed_headers = session(client)
        limited = client.post(
            "/api/public/playground/query", headers=renewed_headers, json=payload
        )
        assert limited.status_code == 429


def test_playground_global_quota_applies_across_client_ips():
    config = settings(
        trust_proxy_headers=True,
        playground_ip_rate_limit_per_hour=10,
        playground_global_rate_limit_per_hour=1,
    )
    with TestClient(create_app(config, FakePlaygroundChat())) as client:
        first_session = client.post(
            "/api/public/session", headers={"X-Forwarded-For": "203.0.113.10"}
        ).json()
        second_session = client.post(
            "/api/public/session", headers={"X-Forwarded-For": "203.0.113.11"}
        ).json()
        payload = {"message": "SIHIA", "corpus": "projects"}
        first = client.post(
            "/api/public/playground/query",
            headers={
                "Authorization": f"Bearer {first_session['token']}",
                "X-Forwarded-For": "203.0.113.10",
            },
            json=payload,
        )
        second = client.post(
            "/api/public/playground/query",
            headers={
                "Authorization": f"Bearer {second_session['token']}",
                "X-Forwarded-For": "203.0.113.11",
            },
            json=payload,
        )
        assert first.status_code == 200
        assert second.status_code == 429


def test_playground_provider_error_does_not_expose_internal_details():
    with TestClient(create_app(settings(), UnavailablePlaygroundChat())) as client:
        _active, headers = session(client)
        response = client.post(
            "/api/public/playground/query",
            headers=headers,
            json={"message": "SIHIA", "corpus": "projects"},
        )
        assert response.status_code == 503
        assert "provider-secret-details" not in response.text


def test_playground_unexpected_error_is_safe_http_500():
    with TestClient(create_app(settings(), FailingPlaygroundChat())) as client:
        _active, headers = session(client)
        response = client.post(
            "/api/public/playground/query",
            headers=headers,
            json={"message": "SIHIA", "corpus": "projects"},
        )
        assert response.status_code == 500
        assert "provider-secret-details" not in response.text


def test_playground_ip_quota_returns_429_with_retry_after():
    config = settings(
        playground_session_rate_limit_per_hour=10,
        playground_ip_rate_limit_per_hour=1,
        playground_global_rate_limit_per_hour=10,
    )
    with TestClient(create_app(config, FakePlaygroundChat())) as client:
        _active, headers = session(client)
        payload = {"message": "SIHIA", "corpus": "projects"}
        assert client.post("/api/public/playground/query", headers=headers, json=payload).status_code == 200
        limited = client.post("/api/public/playground/query", headers=headers, json=payload)
        assert limited.status_code == 429
        assert int(limited.headers["retry-after"]) >= 1


@pytest.mark.asyncio
async def test_public_endpoint_releases_concurrency_after_cancellation():
    class BlockingChat(FakePlaygroundChat):
        def __init__(self):
            self.started = asyncio.Event()
            self.block = True

        async def playground(self, message: str, corpus: str):
            self.started.set()
            if self.block:
                await asyncio.Event().wait()
            return await super().playground(message, corpus)

    service = BlockingChat()
    app = create_app(
        settings(playground_max_concurrent_requests=1),
        service,
    )
    async with app.router.lifespan_context(app):
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            active = (await client.post("/api/public/session")).json()
            headers = {"Authorization": f"Bearer {active['token']}"}
            payload = {"message": "SIHIA", "corpus": "projects"}
            first = asyncio.create_task(
                client.post("/api/public/playground/query", headers=headers, json=payload)
            )
            await service.started.wait()
            concurrent = await client.post(
                "/api/public/playground/query", headers=headers, json=payload
            )
            assert concurrent.status_code == 429
            assert concurrent.headers["retry-after"] == "2"

            first.cancel()
            with suppress(asyncio.CancelledError):
                await first
            service.block = False
            recovered = await client.post(
                "/api/public/playground/query", headers=headers, json=payload
            )
            assert recovered.status_code == 200


def test_playground_timeout_is_safe_http_503_and_releases_slot():
    class SlowThenHealthyChat(FakePlaygroundChat):
        slow = True

        async def playground(self, message: str, corpus: str):
            if self.slow:
                self.slow = False
                await asyncio.sleep(1)
            return await super().playground(message, corpus)

    with TestClient(
        create_app(
            settings(
                playground_request_timeout_seconds=0.02,
                playground_max_concurrent_requests=1,
            ),
            SlowThenHealthyChat(),
        )
    ) as client:
        _active, headers = session(client)
        payload = {"message": "SIHIA", "corpus": "projects"}
        assert client.post("/api/public/playground/query", headers=headers, json=payload).status_code == 503
        assert client.post("/api/public/playground/query", headers=headers, json=payload).status_code == 200
