# Portfolio V2 Phase 3.2 - Final Hardening Report

Date: 2026-10-16  
Branch: `main`  
Starting commit: `5bec0c6`  
Deployment or paid-provider activation: not performed

## Summary

Phase 3.2 hardens the existing Playground without redesigning the portfolio or changing public routes. The confirmed HTTP exception, incomplete-index, and spoofable-forwarding problems were corrected. The public assistant, Lab, case studies, bilingual UI, lazy loading, and production-disabled feature flag are preserved.

## Confirmed Problems And Corrections

1. A concurrency `HTTPException(429)` was caught by a general exception handler and converted to 503. Expected HTTP exceptions and `Retry-After` now propagate unchanged.
2. Provider/retrieval outages, timeouts, cancellations, and unexpected defects were not separated. Known outages/timeouts return safe 503, cancellation propagates and releases the slot, and unexpected defects return safe 500.
3. Input beyond the configured 400-character Playground boundary now returns 413 rather than a generic validation result.
4. Qdrant readiness sampled one payload. A generated manifest now verifies exact count, IDs, document hashes, corpus version, content fingerprint, and project/Lab counts.
5. Playground retrieval now requires cached full readiness and filters every candidate by the packaged corpus version.
6. Ingestion publishes the manifest after document upserts and stale-point deletion, so readiness cannot accept a missing manifest as complete.
7. The limiter trusted the leftmost `X-Forwarded-For` value. Render mode now uses validated `CF-Connecting-IP` only with Render/Cloudflare request markers; unknown/local proxy modes use the direct socket address.
8. Disabled and temporarily unavailable frontend states now have separate bilingual messages.
9. The offline evaluation was too small and lacked false-positive and citation/source metrics. It now covers 21 categorized cases.

## Security Analysis

- Render proxy trust is explicit and production configuration rejects generic proxy trust.
- Full IP addresses and visitor questions remain absent from application logs; rate keys are HMAC-derived.
- JWTs remain anonymous scoped traffic controls, not strong identity authentication.
- Session, IP, global, concurrency, input, output, timeout, source allowlist, corpus permission, and feature-flag controls remain active.
- Process-local quotas still require one instance. Redis or another atomic shared store is required before horizontal scaling or restart-persistent quotas.
- Official Render guidance consulted: `https://render.com/articles/how-render-handles-ddos-attacks`, `https://render.com/articles/host-pocketbase-on-render`, and `https://render.com/docs/logging`.

## Corpus Integrity

Generated artifacts:

- `public_portfolio.json`: public chunks with per-document SHA-256 and corpus version.
- `public_portfolio.manifest.json`: schema version, derived document count, ID hash, full fingerprint, and per-corpus counts.

Readiness rejects absent, empty, partial, version-mismatched, missing, extra, tampered, or unmanifested indexes. A bounded cache avoids exhaustive scans for every visitor request. The current generated count remains 73 because it is derived from source data, not hardcoded as a readiness condition.

## RAG Evaluation Before And After

| Metric | Phase 3.1 baseline | Phase 3.2 expanded set |
| --- | ---: | ---: |
| Cases | 14 | 21 |
| Answerable cases | 12 | 13 |
| Recall@4 | 1.00 | 1.00 |
| MRR | 1.00 | 1.00 |
| Appropriate refusal | 0.50 | 0.75 |
| False-positive rate | not reported | 0.25 |
| Citation/source match | not reported | 1.00 |

The expanded set includes simple, multi-passage, ambiguous, no-answer, wrong-corpus, false-premise, out-of-scope, and prompt-injection cases in English and French. Wrong-corpus and false-premise cases remain failures in the deterministic lexical evaluator. No similarity threshold was changed to optimize this small set. Live dense retrieval and claim-level faithfulness remain pending; citations are not presented as proof of correctness.

## Files Modified

- API: `app/main.py`, `app/config.py`, `app/errors.py`, `app/client_ip.py`, `app/chat.py`, `app/rag.py`, and `app/schemas.py`.
- Corpus: build script, generated documents, generated manifest, ingestion script, and offline evaluator.
- Tests: HTTP/error/concurrency, proxy resolution, corpus readiness/recovery, ingestion/evaluation, and Playground UI states.
- Frontend: `PlaygroundPage.tsx` and its integration tests.
- Deployment: `render.yaml` and isolated acceptance environment example.
- Documentation: architecture, roadmap, this report, and staging validation runbook.

## Cost Controls

The application provides an emergency feature flag, single-instance guard, session/IP/global/concurrency quotas, 400-character input, 300-token output, 70-second endpoint timeout, and one SDK retry. The proposed USD 1.00 staging authorization is administrative only: it is neither an automatic stop nor a price estimate. Provider-side limits and observed usage must be recorded separately during approved staging validation.

## Performance

Full corpus verification is cached for 60 seconds in production and runs before Playground retrieval only when stale. Qdrant query results are version-filtered. No new frontend dependency or eager route import was added. Final bundle figures are recorded after validation below.

## Local Validation

All results below were executed locally on 2026-10-16 without OpenAI/Qdrant network calls:

| Check | Result |
| --- | --- |
| Frontend tests | 34 passed across 11 files |
| Backend tests | 68 passed; 22 non-failing dependency/mock-environment warnings |
| TypeScript | Passed (`tsc --noEmit`) |
| ESLint | 0 errors; 6 existing Fast Refresh warnings in shared UI modules |
| Production build | Passed; 2,187 modules transformed |
| Main JavaScript chunk | 248.88 kB / 80.33 kB gzip |
| Playground lazy chunk | 24.06 kB / 7.76 kB gzip |
| Corpus generation | Deterministic documents and manifest SHA-256 across rebuild |
| Ingestion | Dry-run passed; 73 derived documents, no provider call |
| Critical routes | 6/6 returned HTTP 200 |
| Responsive inspection | 1440 x 1000 desktop and 500 x 900 mobile inspected |
| Git whitespace | `git diff --check` passed |
| Secret scan | No real OpenAI or Qdrant credential pattern found |

Validated routes: `/`, `/lab`, `/lab/playground`, `/work/sihia`, `/work/ai-business-os`, and `/work/arcwell-agentic-crm`.

The main bundle is unchanged from the Phase 3.1 baseline. The Playground route increased by 0.31 kB (0.08 kB gzip) for distinct disabled/unavailable states and remains lazy-loaded. Backend warnings come from the Starlette TestClient compatibility notice and intentionally mocked Qdrant endpoints; they are not failed tests or real-provider validation.

## Staging Checklist

See `docs/PLAYGROUND_STAGING_VALIDATION.md` for variables, commands, isolated indexing, smoke tests, cost boundaries, activation criteria, and rollback.

## Residual Risks And Pending Real Validation

- No OpenAI or real Qdrant acceptance call was authorized or executed.
- Render edge-header behavior is based on official documentation and local mocks; staging observation is pending.
- Manifest publication/recovery is mock-tested locally; isolated Qdrant validation is pending.
- A 60-second readiness cache can delay detection of external index mutation by at most its TTL; staging uses zero TTL.
- In-memory quotas reset on restart and cannot support multiple instances.
- Two expanded offline cases expose unresolved false-positive behavior; dense-retrieval results are not inferred from lexical evaluation.
- Claim-level entailment, contradiction resolution, and provider-side automatic spend shutdown are not implemented.

## Rollback And Phase 4 Decision

Immediate rollback is `PLAYGROUND_ENABLED=false`, followed by staging-key revocation and isolated-collection shutdown if needed. The assistant and portfolio routes remain independent.

Phase 4 is not started. The repository is ready for a controlled staging validation after the complete local matrix passes; Phase 4 should remain blocked until real OpenAI/Qdrant acceptance evidence is recorded or the owner explicitly accepts the residual risks.
