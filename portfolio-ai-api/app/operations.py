from __future__ import annotations

import math
import threading
from collections import Counter, deque
from collections.abc import Callable
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Literal

OperationSource = Literal["assistant", "playground", "test", "demo"]
OperationError = Literal[
    "cancelled",
    "generation",
    "internal",
    "rate_limit",
    "retrieval",
    "timeout",
    "unavailable",
    "validation",
]

SOURCES: tuple[OperationSource, ...] = (
    "assistant",
    "playground",
    "test",
    "demo",
)
ERROR_CATEGORIES: tuple[OperationError, ...] = (
    "cancelled",
    "generation",
    "internal",
    "rate_limit",
    "retrieval",
    "timeout",
    "unavailable",
    "validation",
)


@dataclass(frozen=True, slots=True)
class OperationEvent:
    source: OperationSource
    success: bool
    total_latency_ms: float
    retrieval_latency_ms: float | None = None
    generation_latency_ms: float | None = None
    refused: bool = False
    error_category: OperationError | None = None
    input_tokens: int | None = None
    output_tokens: int | None = None
    recorded_at: datetime | None = None


def percentile(values: list[float], quantile: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    rank = max(0, math.ceil(quantile * len(ordered)) - 1)
    return round(ordered[rank], 2)


class OperationsCollector:
    """Bounded, process-local operational metadata with no visitor content."""

    def __init__(
        self,
        *,
        enabled: bool,
        retention_hours: int,
        max_events: int,
        stale_after_minutes: int,
        cache_seconds: int,
        clock: Callable[[], datetime] | None = None,
    ) -> None:
        self.enabled = enabled
        self.retention = timedelta(hours=retention_hours)
        self.max_events = max_events
        self.stale_after = timedelta(minutes=stale_after_minutes)
        self.cache_seconds = cache_seconds
        self._clock = clock or (lambda: datetime.now(UTC))
        self._events: deque[OperationEvent] = deque(maxlen=max_events)
        self._lock = threading.Lock()
        self._cache: tuple[datetime, dict] | None = None

    def _prune(self, now: datetime) -> None:
        cutoff = now - self.retention
        while self._events and (self._events[0].recorded_at or now) < cutoff:
            self._events.popleft()

    def record(self, event: OperationEvent) -> bool:
        if not self.enabled:
            return False
        try:
            now = self._clock()
            recorded_at = event.recorded_at or now
            if recorded_at.tzinfo is None:
                recorded_at = recorded_at.replace(tzinfo=UTC)
            safe_event = OperationEvent(
                source=event.source if event.source in SOURCES else "demo",
                success=bool(event.success),
                total_latency_ms=max(0.0, float(event.total_latency_ms)),
                retrieval_latency_ms=(
                    max(0.0, float(event.retrieval_latency_ms))
                    if event.retrieval_latency_ms is not None
                    else None
                ),
                generation_latency_ms=(
                    max(0.0, float(event.generation_latency_ms))
                    if event.generation_latency_ms is not None
                    else None
                ),
                refused=bool(event.refused),
                error_category=(
                    event.error_category
                    if event.error_category in ERROR_CATEGORIES
                    else ("internal" if not event.success else None)
                ),
                input_tokens=(
                    max(0, int(event.input_tokens))
                    if event.input_tokens is not None
                    else None
                ),
                output_tokens=(
                    max(0, int(event.output_tokens))
                    if event.output_tokens is not None
                    else None
                ),
                recorded_at=recorded_at,
            )
            with self._lock:
                self._prune(now)
                self._events.append(safe_event)
                self._cache = None
            return True
        except (TypeError, ValueError, OverflowError):
            return False

    def summary(self) -> dict:
        now = self._clock()
        if not self.enabled:
            return self._empty("disabled", now)
        with self._lock:
            self._prune(now)
            if (
                self._cache
                and (now - self._cache[0]).total_seconds() <= self.cache_seconds
            ):
                return self._cache[1]
            events = list(self._events)
        if not events:
            summary = self._empty("no_data", now)
        else:
            latest = max(event.recorded_at or now for event in events)
            status = "stale" if now - latest > self.stale_after else "available"
            summary = self._aggregate(events, status, latest, now)
        with self._lock:
            self._cache = (now, summary)
        return summary

    def _empty(self, status: str, now: datetime) -> dict:
        return {
            "status": status,
            "period": "24h",
            "period_start": (now - self.retention).isoformat(),
            "period_end": now.isoformat(),
            "metrics": {
                "requests": None,
                "successful_requests": None,
                "errors": None,
                "success_rate": None,
                "error_rate": None,
                "refusals": None,
                "p50_latency_ms": None,
                "p95_latency_ms": None,
                "retrieval_p95_ms": None,
                "generation_p95_ms": None,
                "input_tokens": None,
                "output_tokens": None,
            },
            "request_distribution": {source: 0 for source in SOURCES},
            "error_distribution": {},
            "last_event_at": None,
            "last_updated": now.isoformat(),
            "measurement_note": "Process-local accepted AI operations; not uptime or billing data.",
        }

    def _aggregate(
        self,
        events: list[OperationEvent],
        status: str,
        latest: datetime,
        now: datetime,
    ) -> dict:
        requests = len(events)
        successes = sum(event.success for event in events)
        errors = requests - successes
        input_tokens = [
            event.input_tokens for event in events if event.input_tokens is not None
        ]
        output_tokens = [
            event.output_tokens for event in events if event.output_tokens is not None
        ]
        request_distribution = Counter(event.source for event in events)
        error_distribution = Counter(
            event.error_category for event in events if event.error_category
        )
        return {
            "status": status,
            "period": "24h",
            "period_start": (now - self.retention).isoformat(),
            "period_end": now.isoformat(),
            "metrics": {
                "requests": requests,
                "successful_requests": successes,
                "errors": errors,
                "success_rate": round(successes / requests * 100, 2),
                "error_rate": round(errors / requests * 100, 2),
                "refusals": sum(event.refused for event in events),
                "p50_latency_ms": percentile(
                    [event.total_latency_ms for event in events], 0.50
                ),
                "p95_latency_ms": percentile(
                    [event.total_latency_ms for event in events], 0.95
                ),
                "retrieval_p95_ms": percentile(
                    [
                        event.retrieval_latency_ms
                        for event in events
                        if event.retrieval_latency_ms is not None
                    ],
                    0.95,
                ),
                "generation_p95_ms": percentile(
                    [
                        event.generation_latency_ms
                        for event in events
                        if event.generation_latency_ms is not None
                    ],
                    0.95,
                ),
                "input_tokens": sum(input_tokens) if input_tokens else None,
                "output_tokens": sum(output_tokens) if output_tokens else None,
            },
            "request_distribution": {
                source: request_distribution.get(source, 0) for source in SOURCES
            },
            "error_distribution": dict(sorted(error_distribution.items())),
            "last_event_at": latest.isoformat(),
            "last_updated": now.isoformat(),
            "measurement_note": "Process-local accepted AI operations; not uptime or billing data.",
        }
