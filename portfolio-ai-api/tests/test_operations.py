import json
from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app
from app.operations import OperationEvent, OperationsCollector, percentile
from app.schemas import KnowledgeChunk


class FakeOperationsChat:
    async def readiness(self):
        return {"ready": True, "documents": 73, "corpus_version": "test"}

    async def stream(self, _message: str):
        async def tokens():
            yield "Grounded response."

        return [
            KnowledgeChunk(
                id="public-1",
                type="project",
                slug="sihia",
                title="SIHIA",
                section="Architecture",
                url="/work/sihia",
                content="Public evidence",
                score=0.9,
            )
        ], tokens()

    async def playground(self, _message: str, corpus: str):
        return {
            "answer": "Evidence-backed response.",
            "corpus": corpus,
            "execution_mode": "live",
            "generated_from_retrieved_documents": True,
            "citations_available": True,
            "support_status": "not_evaluated",
            "refusal_reason": None,
            "evidence": [],
            "trace": [
                {
                    "id": "retrieval",
                    "status": "completed",
                    "detail": "Retrieved.",
                    "duration_ms": 12.5,
                },
                {
                    "id": "generation",
                    "status": "completed",
                    "detail": "Generated.",
                    "duration_ms": 24.5,
                },
            ],
            "retrieval_strategy": "Public test fixture",
            "selected_passages": 1,
            "response_time_ms": 40.0,
            "limitations": ["Test fixture."],
        }


def settings(**overrides):
    values = {
        "environment": "test",
        "session_secret": "test-secret-that-is-long-enough-123",
        "allowed_origins": ["https://portfolio.test"],
        "openai_api_key": "test",
        "operations_monitor_enabled": True,
        "operations_rate_limit_per_minute": 10,
        "playground_enabled": True,
        "ip_rate_limit_per_minute": 20,
    }
    values.update(overrides)
    return Settings(_env_file=None, **values)


def collector(*, enabled=True, clock=None, stale_after_minutes=15):
    return OperationsCollector(
        enabled=enabled,
        retention_hours=24,
        max_events=100,
        stale_after_minutes=stale_after_minutes,
        cache_seconds=0,
        clock=clock,
    )


def session(client: TestClient):
    active = client.post("/api/public/session").json()
    return active, {"Authorization": f"Bearer {active['token']}"}


def test_percentiles_use_nearest_rank_without_inventing_samples():
    assert percentile([], 0.95) is None
    assert percentile([10, 20, 30, 40], 0.50) == 20
    assert percentile([10, 20, 30, 40], 0.95) == 40


def test_aggregation_is_bounded_separated_and_contains_no_visitor_data():
    now = datetime(2026, 10, 16, 8, 0, tzinfo=UTC)
    monitor = collector(clock=lambda: now)
    for event in (
        OperationEvent(
            source="assistant",
            success=True,
            total_latency_ms=100,
            retrieval_latency_ms=30,
            generation_latency_ms=60,
            input_tokens=12,
            output_tokens=20,
        ),
        OperationEvent(
            source="playground",
            success=True,
            total_latency_ms=200,
            retrieval_latency_ms=50,
            generation_latency_ms=120,
            refused=True,
        ),
        OperationEvent(
            source="test",
            success=False,
            total_latency_ms=300,
            error_category="timeout",
        ),
    ):
        assert monitor.record(event)

    summary = monitor.summary()

    assert summary["status"] == "available"
    assert summary["metrics"] == {
        "requests": 3,
        "successful_requests": 2,
        "errors": 1,
        "success_rate": 66.67,
        "error_rate": 33.33,
        "refusals": 1,
        "p50_latency_ms": 200.0,
        "p95_latency_ms": 300.0,
        "retrieval_p95_ms": 50.0,
        "generation_p95_ms": 120.0,
        "input_tokens": 12,
        "output_tokens": 20,
    }
    assert summary["request_distribution"] == {
        "assistant": 1,
        "playground": 1,
        "test": 1,
        "demo": 0,
    }
    assert summary["error_distribution"] == {"timeout": 1}
    serialized = json.dumps(summary).lower()
    for forbidden in ("question", "answer", "session", "jwt", "ip_address"):
        assert forbidden not in serialized


def test_all_public_source_dimensions_remain_separate():
    monitor = collector(clock=lambda: datetime(2026, 10, 16, 8, 0, tzinfo=UTC))
    for source in ("assistant", "playground", "test", "demo"):
        assert monitor.record(
            OperationEvent(source=source, success=True, total_latency_ms=10)
        )

    assert monitor.summary()["request_distribution"] == {
        "assistant": 1,
        "playground": 1,
        "test": 1,
        "demo": 1,
    }


def test_disabled_no_data_stale_and_retention_states_are_explicit():
    now = datetime(2026, 10, 16, 8, 0, tzinfo=UTC)
    disabled = collector(enabled=False, clock=lambda: now)
    assert not disabled.record(
        OperationEvent(source="assistant", success=True, total_latency_ms=1)
    )
    assert disabled.summary()["status"] == "disabled"

    current = {"now": now}
    monitor = collector(clock=lambda: current["now"], stale_after_minutes=10)
    assert monitor.summary()["status"] == "no_data"
    monitor.record(OperationEvent(source="assistant", success=True, total_latency_ms=1))
    current["now"] = now + timedelta(minutes=11)
    assert monitor.summary()["status"] == "stale"
    current["now"] = now + timedelta(hours=25)
    assert monitor.summary()["status"] == "no_data"


def test_public_summary_endpoint_and_instrumentation_are_safe():
    monitor = collector()
    app = create_app(settings(), FakeOperationsChat(), monitor)
    with TestClient(app) as client:
        empty = client.get("/api/public/operations/summary")
        assert empty.status_code == 200
        assert empty.json()["status"] == "no_data"

        active, headers = session(client)
        chat = client.post(
            "/api/public/chat/stream",
            headers=headers,
            json={
                "message": "How does SIHIA work?",
                "conversation_id": active["session_id"],
            },
        )
        assert chat.status_code == 200
        assert '"type": "done"' in chat.text

        playground = client.post(
            "/api/public/playground/query",
            headers=headers,
            json={
                "message": "How does SIHIA retrieve evidence?",
                "corpus": "projects",
                "conversation_id": active["session_id"],
            },
        )
        assert playground.status_code == 200

        summary = client.get("/api/public/operations/summary").json()
        assert summary["request_distribution"]["assistant"] == 1
        assert summary["request_distribution"]["playground"] == 1
        assert summary["metrics"]["requests"] == 2
        assert summary["metrics"]["retrieval_p95_ms"] is not None
        assert summary["metrics"]["generation_p95_ms"] is not None


def test_public_summary_is_disabled_independently_and_rate_limited():
    app = create_app(
        settings(
            operations_monitor_enabled=False,
            operations_rate_limit_per_minute=1,
        ),
        FakeOperationsChat(),
    )
    with TestClient(app) as client:
        first = client.get("/api/public/operations/summary")
        second = client.get("/api/public/operations/summary")

    assert first.status_code == 200
    assert first.json()["status"] == "disabled"
    assert first.json()["metrics"]["requests"] is None
    assert second.status_code == 429
    assert second.headers["retry-after"]


def test_collector_failure_never_breaks_chat():
    class BrokenCollector:
        def record(self, _event):
            raise RuntimeError("private-monitor-error")

        def summary(self):
            raise RuntimeError("private-monitor-error")

    with TestClient(
        create_app(settings(), FakeOperationsChat(), BrokenCollector())
    ) as client:
        active, headers = session(client)
        chat = client.post(
            "/api/public/chat/stream",
            headers=headers,
            json={
                "message": "How does SIHIA work?",
                "conversation_id": active["session_id"],
            },
        )
        summary = client.get("/api/public/operations/summary")

    assert chat.status_code == 200
    assert '"type": "done"' in chat.text
    assert summary.status_code == 503
    assert "private-monitor-error" not in summary.text
