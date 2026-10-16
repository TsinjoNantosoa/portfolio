# Public RAG Playground Architecture

Date: 2026-10-16

## Purpose

The Playground exposes an observable, read-only RAG request over approved public portfolio content. It is a technical demonstration, not an administrative search console, general-purpose chatbot, or action-capable agent.

## Request Flow

```text
Browser /lab/playground
  -> POST /api/public/session
  -> POST /api/public/playground/query
     -> JWT scope and conversation ownership
     -> IP and session rate limits
     -> input length and corpus allowlist
     -> prompt-injection and out-of-scope guards
     -> OpenAI query embedding
     -> Qdrant corpus-filtered cosine retrieval
     -> deterministic lexical relevance bonus and diversity limit
     -> public source URL allowlist
     -> bounded evidence context
     -> OpenAI generation constrained to retrieved documents
     -> evidence, scores, trace, timings, limits, and request ID
```

The existing assistant continues using `/api/public/chat/stream`. The Playground adds a separate response contract but reuses the same FastAPI application, session model, retriever, model client, curated knowledge collection, security middleware, and generation policy.

## Corpus Isolation

Only two values are accepted by the request schema:

- `projects`: Qdrant payloads whose type is `project`.
- `engineering_lab`: the five explicit `lab-*` public capability slugs.

Unknown corpus names fail schema validation. Retrieved citations must use an internal `/work/*` or `/lab*` route, cannot be protocol-relative, and cannot contain parent traversal. Contact submissions, conversations, environment data, client records, and private repository documents are never part of the generated corpus.

## Observable Trace

The API returns seven stage records: query, processing, retrieval, context, generation, answer, and citations. Retrieval and generation durations are measured around the actual awaited operations. Skipped stages are returned as skipped after a guard or empty-evidence result. The UI never advances a decorative timer or presents a preset animation as execution evidence.

A generated answer reports three separate facts: whether retrieved documents were supplied to generation, whether citations are available, and whether claim support was evaluated. The current implementation deliberately returns `support_status=not_evaluated`; it does not claim that every generated statement is entailed by the passages.

Scores are raw Qdrant similarity scores rounded for display. They rank retrieved passages and are explicitly not presented as answer-confidence values. Excerpts are capped at 420 characters. No prompt, provider key, Qdrant connection value, model context, or server exception is returned.

## Security And Cost Controls

- Existing explicit CORS allowlist and production secret validation.
- Signed, expiring anonymous JWT with portfolio-only scope. This and CORS are abuse boundaries, not strong user authentication.
- Conversation ID ownership check.
- Maximum Playground input: 400 characters.
- Default Playground output ceiling: 300 tokens.
- Default Playground session limit: 12 requests per hour.
- Default Playground IP limit: 24 requests per hour, surviving anonymous session renewal.
- Default conservative global limit: 120 requests per hour.
- Default concurrent execution limit: 2.
- Existing per-IP minute limit, with trusted proxy handling enabled only by configuration.
- English and French prompt-injection and obvious out-of-scope guards.
- Read-only generation: no tools, browsing, callbacks, webhooks, or external actions.
- Full questions are not written to application logs; logs contain length, corpus, request ID, and coarse operational data.
- `PLAYGROUND_ENABLED=false` is both the application default and the explicit `render.yaml` value.
- Production activation is rejected when `PLAYGROUND_INSTANCE_COUNT` is greater than one because current counters are process-local.

The in-memory rate limiter is process-local. Before horizontal scaling, the same keys and windows must move to an atomic shared store such as Redis. Provider budget enforcement is currently an operator-controlled kill switch and conservative global quota rather than a billing API integration.

Every generated knowledge payload carries a deterministic corpus version. Readiness succeeds only when the version sampled from Qdrant matches the version expected by the API package, preventing a same-size but stale index from being accepted.

## Failure Modes

- Invalid input or corpus: HTTP 422 with a generic validation message.
- Invalid/expired session: HTTP 401 or 403.
- Rate limit: HTTP 429 with `Retry-After`.
- Disabled or unconfigured service: HTTP 503.
- Provider or retrieval failure: safe HTTP 503 without internal details.
- No accepted evidence: successful controlled `no_evidence` result; generation is skipped.
- Prompt injection or obvious unrelated request: successful controlled `guarded` result; retrieval and generation are skipped.

The frontend keeps the question for retry and stores up to five displayed requests in React memory only. Reloading or leaving the page clears that history.

## Production Activation Checklist

1. Approve a monthly provider budget and expected public traffic.
2. Rebuild and ingest the current public corpus into Qdrant.
3. Run the live retrieval evaluation against the target collection.
4. Set `PLAYGROUND_ENABLED=true` in the approved backend environment.
5. Confirm the Netlify origin remains in `ALLOWED_ORIGINS`.
6. Exercise guarded, no-evidence, live, rate-limit, timeout, and provider-failure paths in a deploy preview.
7. Add shared rate-limit storage before running more than one API process.
8. Monitor aggregate counts and latency without logging full visitor questions.
