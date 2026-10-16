# Playground Staging Validation

Date: 2026-10-16

This runbook prepares a controlled Netlify Deploy Preview and isolated Render backend. It does not authorize creation of paid resources, production configuration changes, ingestion, or OpenAI calls.

## Isolation Boundary

- Netlify Deploy Preview with its exact origin, never a wildcard.
- Separate Render staging service with one instance.
- Dedicated Qdrant collection, for example `portfolio_knowledge_acceptance`.
- Restricted server-side OpenAI key from an isolated provider project.
- `PLAYGROUND_ENABLED=false` until readiness, retrieval, security, and budget checks pass.
- No production Qdrant collection, API key, session secret, or environment variable is reused.

## Required Variables

Start from `portfolio-ai-api/.env.playground.acceptance.example`. Replace placeholders only in the staging service secret manager. Required controls include:

- `ENVIRONMENT=production`
- exact `PUBLIC_SITE_URL` and `ALLOWED_ORIGINS`
- `TRUST_PROXY_HEADERS=true` and `TRUSTED_PROXY_PROVIDER=render`
- isolated `OPENAI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`, and `QDRANT_COLLECTION`
- random `SESSION_SECRET` of at least 32 characters
- `PLAYGROUND_ENABLED=false` for initial deployment
- one instance, bounded session/IP/global/concurrency limits, 400 input characters, 300 output tokens, and a 70-second request timeout
- `CORPUS_READINESS_TTL_SECONDS=0` during acceptance so each readiness check performs a full audit

## Build And Static Validation

```powershell
npm ci
npm run knowledge:build
npm run test:run
npm run lint
npx tsc --noEmit
npm run build
cd portfolio-ai-api
python -m pip install -r requirements-dev.lock
python -m pytest -q
python scripts/ingest_portfolio.py --dry-run
```

Confirm that a second `npm run knowledge:build` leaves both generated knowledge files unchanged.

## Isolated Index Publication

This step requires explicit approval because it calls the embedding provider.

1. Confirm the target collection name is the isolated staging collection.
2. Keep the Playground disabled.
3. Run `python scripts/ingest_portfolio.py --recreate` once.
4. The ingestion upserts document points, removes stale points, and publishes the corpus manifest last.
5. Call `/ready`; require the packaged corpus version, derived document count, and HTTP 200.
6. Test a missing document, extra stale point, wrong version, and temporary Qdrant outage in the isolated collection or an equivalent disposable test collection. Each must make `/ready` return 503.
7. Restore/reingest and require readiness recovery before continuing.

## Security And HTTP Acceptance

- Invalid body 422; oversized Playground message 413.
- Expired JWT 401; wrong conversation 403.
- Session, IP, global, and concurrency limits 429 with `Retry-After` where applicable.
- Forged `X-Forwarded-For` does not rotate the limiter identity.
- Disabled Playground 503 with `PLAYGROUND_DISABLED`.
- Provider/Qdrant outage or timeout 503 without internal details.
- Injected unexpected exception 500 without internal details.
- Cancellation releases the concurrency slot; the next request succeeds.
- CORS accepts only the exact Deploy Preview origin.
- Logs contain request IDs, status, latency, corpus, and lengths only; no complete IP, question, key, prompt, or evidence content.

## Retrieval And Generation Acceptance

First run the offline evaluator. Then, with explicit paid-call approval, execute retrieval against Qdrant before generation. Record Recall@4, MRR, appropriate-refusal rate, false-positive rate, corpus isolation, and citation/source matching.

The bounded generation sample is at most five manual cases plus one smoke request:

1. SIHIA retrieval in English.
2. SIHIA retrieval in French.
3. Arcwell governance.
4. AI BOS limitations.
5. Lab agent controls.
6. `python scripts/smoke_deployment.py --base-url <staging-api> --playground`.

Also verify no-evidence, wrong-corpus, false-premise, injection, timeout, cancellation, and rate-limit behavior without describing citations as factual entailment. Claim support remains `not_evaluated`.

## Cost Controls

- Proposed acceptance budget: USD 1.00 maximum administrative authorization.
- This value is not an automatic spending stop and is not a cost estimate.
- Configure a provider-side project budget/alert or hard usage restriction when the provider supports it.
- Application controls are the feature flag, global/hourly cap, concurrency cap, input/output bounds, timeout, single retry, and emergency disable switch.
- Record observed token/request consumption separately from forecast cost and provider-side limits.
- Stop immediately on an unexpected source, readiness mismatch, quota anomaly, leaked detail, or reached provider limit.

## Activation And Rollback

Activation requires all checks above, recorded evidence, explicit owner approval, and then only `PLAYGROUND_ENABLED=true` in staging. Production remains disabled.

Rollback order:

1. Set `PLAYGROUND_ENABLED=false`.
2. Revoke the isolated OpenAI key.
3. Remove the Deploy Preview origin from staging CORS.
4. Roll back the staging API artifact if required.
5. Delete or disable only the isolated Qdrant collection.
6. Never recreate or delete the existing assistant production collection during Playground rollback.

## Pending Real Validation

- Render/Cloudflare header behavior must be observed on the staging service.
- Qdrant manifest publication and recovery must be exercised on the isolated collection.
- OpenAI embeddings and generation quality/cost must be measured with explicit approval.
- Netlify Deploy Preview CORS, responsive behavior, and production-like cancellation must be inspected manually.
