# AI Operations Monitor Architecture

Date: 2026-10-16  
Status: implemented locally, disabled by default

## Objective

The monitor demonstrates privacy-preserving AI operations engineering for the existing portfolio assistant and RAG Playground. It exposes bounded aggregate measurements, not visitor analytics, conversation history, infrastructure internals, external uptime, or provider billing.

## Architecture

```text
Assistant / RAG Playground
  -> accepted AI operation
  -> best-effort technical event
  -> bounded in-process collector
  -> fixed 24-hour aggregation and short cache
  -> rate-limited public summary API
  -> lazy-loaded bilingual React dashboard
```

No new database, analytics vendor, queue, Redis instance, or chart dependency is introduced. The current single-instance Render architecture makes a process-local collector the lowest-cost reversible first implementation. PostgreSQL is not currently part of the portfolio API and was therefore not added solely for monitoring.

## Collection Boundary

An event contains only:

- source: `assistant`, `playground`, `test`, or `demo`;
- success boolean and controlled-refusal boolean;
- total, retrieval, and generation durations when those phases ran;
- one bounded error category;
- token counts only when reliable provider usage becomes available;
- UTC event time.

The event model has no fields for questions, answers, IP addresses, session identifiers, JWTs, prompts, citations, source text, user agents, names, emails, locations, request IDs, exception messages, or stack traces. Public clients cannot select the source classification or submit monitoring events.

The production request logger remains separate. The public summary never reads or returns logs.

## Reliability Boundary

Instrumentation surrounds accepted assistant and Playground execution without replacing their existing code paths. Event recording is synchronous, bounded, constant-size, and protected from propagation. A collector failure is logged only by error type and cannot change an AI response.

The collector uses a maximum-size deque and a short lock. Summary calculation copies the bounded sample before aggregation. The public result is cached for a configurable interval. No monitoring write performs network or provider I/O.

## Retention And Cardinality

- Default window: 24 hours.
- Default maximum retained events: 5,000.
- Default freshness threshold: 15 minutes.
- Default public-summary cache: 30 seconds.
- Restart behavior: all measurements are cleared.
- Error categories and source values are fixed allowlists.
- Events outside the retention window are purged during reads and writes.

These controls prevent unbounded memory use and high-cardinality public dimensions. The process-local scope means values are not durable and are not valid across multiple instances.

## Metric Semantics

- `requests`: accepted AI operations that reached the monitored execution path.
- `successful_requests`: operations that reached a controlled terminal response, including controlled refusals.
- `success_rate`: processing success divided by recorded requests. It is not uptime or answer correctness.
- `errors`: monitored execution failures. Pre-handler validation and most HTTP rejections are not represented.
- `refusals`: controlled guard or insufficient-evidence outcomes.
- `p50_latency_ms` and `p95_latency_ms`: nearest-rank percentiles of total monitored processing time.
- `retrieval_p95_ms`: retrieval phase only, when executed.
- `generation_p95_ms`: generation/stream-consumption phase only, when executed.
- token totals: `null` until trustworthy provider usage is captured. They are not billed cost.

The dashboard does not draw time-series charts because the API does not publish a durable time series. External uptime is not configured, so no uptime percentage is shown.

## Public API

`GET /api/public/operations/summary`

The endpoint accepts no period, dimension, query, user, or infrastructure filter. It returns one fixed public 24-hour summary and is protected by the existing hashed client identity and sliding-window rate limiter.

States:

- `disabled`: feature flag off; metrics are null.
- `no_data`: enabled but no retained operation exists.
- `available`: at least one recent retained event exists.
- `stale`: data exists but the latest event exceeds the freshness threshold.
- HTTP 503: summary collection itself failed; response contains no internal exception detail.
- HTTP 429: public read quota exceeded with `Retry-After`.

The API provides a measurement note and timestamps but no infrastructure hostname, model secret, collection endpoint, process identifier, or provider account detail.

## Configuration

```text
OPERATIONS_MONITOR_ENABLED=false
OPERATIONS_RETENTION_HOURS=24
OPERATIONS_MAX_EVENTS=5000
OPERATIONS_STALE_AFTER_MINUTES=15
OPERATIONS_CACHE_SECONDS=30
OPERATIONS_RATE_LIMIT_PER_MINUTE=30
```

The monitor flag is independent from `PLAYGROUND_ENABLED` and the assistant configuration. It remains `false` in `render.yaml`.

## Staging Acceptance

1. Deploy an isolated backend revision with `OPERATIONS_MONITOR_ENABLED=false`.
2. Confirm `/health`, `/ready`, guarded chatbot behavior, and existing Playground states.
3. Confirm the summary returns `disabled` with null metric values.
4. Enable only the monitor flag in staging; do not change production variables.
5. Confirm the first summary returns `no_data`.
6. Exercise deterministic guarded assistant and Playground fixtures that do not call a paid model.
7. Confirm source separation, refusal count, phase latency semantics, freshness, and rate limiting.
8. Inspect the public JSON for forbidden content and high-cardinality values.
9. Simulate collector failure and confirm the AI response remains successful.
10. Validate desktop/mobile, English/French, keyboard refresh, disabled, no-data, stale, and error states.

No OpenAI call is required for the default acceptance sequence.

## Activation And Rollback

Activation requires passing the complete local matrix and isolated staging checklist, reviewing public JSON, and explicitly approving the production variable change. No deployment or variable change is part of this implementation.

Immediate rollback:

1. Set `OPERATIONS_MONITOR_ENABLED=false`.
2. Verify summary state `disabled`.
3. Leave the assistant and Playground flags unchanged.
4. If needed, roll back the application revision; there is no monitoring database or migration to reverse.

## Future Persistence Decision

Move to PostgreSQL only when durable multi-instance trends are an approved requirement. Use an asynchronous bounded queue, batch inserts, daily aggregates, retention jobs, low-cardinality dimensions, and fail-open instrumentation. A public endpoint should continue to read only pre-aggregated allowlisted fields. Redis or a metrics platform should be considered only when traffic, multi-instance coordination, or alerting provides evidence that the process-local design is insufficient.

