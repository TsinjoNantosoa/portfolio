from fastapi.testclient import TestClient

from app.config import Settings
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
            "grounded": True,
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


def test_playground_returns_observable_grounded_evidence():
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
        assert body["grounded"] is True
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
        assert too_long.status_code == 422

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


def test_playground_provider_error_does_not_expose_internal_details():
    with TestClient(create_app(settings(), FailingPlaygroundChat())) as client:
        _active, headers = session(client)
        response = client.post(
            "/api/public/playground/query",
            headers=headers,
            json={"message": "SIHIA", "corpus": "projects"},
        )
        assert response.status_code == 503
        assert "provider-secret-details" not in response.text
