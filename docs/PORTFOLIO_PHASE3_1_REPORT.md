# Portfolio V2 Phase 3.1 — Hardening And Live Acceptance

Date: 2026-10-16  
Branch: `main`  
Starting commit: `f4d62c7`  
Production activation: not performed

## Problems Corrected

1. **Unsafe default activation:** `playground_enabled` now defaults to `False`; Render also keeps it explicitly disabled.
2. **Session-renewal quota bypass:** a separate hashed-IP hourly quota applies across newly issued anonymous JWTs.
3. **Unbounded paid traffic:** session, IP, global hourly, and concurrent execution limits now apply before the Playground service runs.
4. **Multi-instance counter drift:** production configuration refuses an enabled Playground with more than one instance until an atomic shared limiter exists.
5. **Overstated answer quality:** the `grounded` boolean was removed. The response separately reports documents used, citations available, and `support_status=not_evaluated`.
6. **Weak evidence paths:** low-score passages and unsafe citation URLs become no-evidence results. Empty model output becomes a safe service error.
7. **Sensitive requests:** private/confidential record requests are guarded before retrieval, without changing the existing assistant's no-evidence behavior.
8. **Expired Playground sessions:** the frontend renews a 401 session once and retries the same request without duplicating history.
9. **Cancellation and duplicate submission:** cancellation, timeout, and disabled states are distinct; an immediate in-flight lock prevents accidental parallel submissions.
10. **Stale index ambiguity:** every generated document carries corpus version `9676131376337c49`, and readiness compares it with Qdrant.

Anonymous JWTs and CORS remain traffic and browser-origin controls. They are not described or treated as strong identity authentication.

## Request Limits

| Boundary | Default | Acceptance profile |
| --- | ---: | ---: |
| Session requests/hour | 12 | 6 |
| IP requests/hour | 24 | 8 |
| Global requests/hour | 120 | 12 |
| Concurrent requests | 2 | 1 |
| Input characters | 400 | 400 |
| Output tokens | 300 | 300 |
| Instances while using memory limits | 1 | 1 |

The global counter conservatively counts every accepted Playground attempt, including a request that may later be guarded. This over-counting is intentional for cost protection.

## Corpus And Offline Retrieval Evaluation

`npm run knowledge:build` regenerated 73 documents from `src/data/projects.ts`, `src/data/experience.ts`, and `src/data/lab.ts`. Before adding version metadata, rebuilding produced the same SHA-256 hash, demonstrating source consistency. The versioned corpus now has one shared deterministic version: `9676131376337c49`.

The offline evaluator uses deterministic token/IDF ranking, corpus permissions, title weighting, and the same two-results-per-slug diversity rule. It performs no OpenAI or Qdrant call and is not presented as a dense-retrieval benchmark.

| Metric | Result |
| --- | ---: |
| Evaluation questions | 14 |
| Answerable questions | 12 |
| Recall@4 | 1.00 |
| Mean reciprocal rank | 1.00 |
| No-answer accuracy | 0.50 |

Failed no-answer question: `What private customer contracts are stored here?` Lexical overlap retrieves project documents. The production Playground now stops this request with its sensitive-data guard before retrieval, but the offline retriever metric remains reported as failed. This demonstrates why retrieval relevance and policy refusal must be evaluated separately.

Command: `python portfolio-ai-api/scripts/evaluate_playground_offline.py`

## Tests Added Or Extended

- Session renewal cannot reset the per-IP Playground quota.
- Global quota applies across distinct resolved proxy IPs.
- Concurrent slot rejection and recovery.
- Production rejects enabled multi-instance memory limiting.
- Corpus-filter propagation to Qdrant.
- Indexed corpus version match and mismatch.
- Unsafe URLs, low relevance, empty generation, conflicting evidence, sensitive requests, injection, and no-evidence behavior.
- Expired JWT renewal, cancellation, preserved question, disabled state, evidence semantics, and citation display in React.
- Offline evaluation reproducibility and exact Lab/project corpus boundaries.

## Files Modified

- `portfolio-ai-api/app/config.py`: safe defaults and rate/concurrency/instance limits.
- `portfolio-ai-api/app/rate_limit.py`: concurrency limiter.
- `portfolio-ai-api/app/main.py`: IP/global limits, concurrency slot, versioned readiness response.
- `portfolio-ai-api/app/chat.py`: quality semantics, sensitive guard, relevance/source/empty-output checks.
- `portfolio-ai-api/app/rag.py`: corpus-version readiness and corpus-filter retrieval.
- `portfolio-ai-api/app/schemas.py`: explicit answer-quality and corpus-version contracts.
- `portfolio-ai-api/scripts/build_portfolio_knowledge.mjs`: deterministic corpus version.
- `portfolio-ai-api/scripts/evaluate_playground_offline.py`: no-network retrieval evaluation.
- `portfolio-ai-api/scripts/smoke_deployment.py`: opt-in one-call Playground smoke test.
- `portfolio-ai-api/.env.playground.acceptance.example`: isolated, bounded acceptance configuration without real secrets.
- `portfolio-ai-api/tests/*`: hardening, pipeline, API, readiness, concurrency, and offline-evaluation coverage.
- `src/pages/PlaygroundPage.tsx`: session refresh, in-flight lock, cancellation/timeout/disabled copy, quality status.
- `src/features/playground/*`, `src/data/playground.ts`: updated response contract and non-overstated labels.
- `render.yaml`: explicit safe limits and disabled production state.
- Phase 3 architecture, roadmap, and reports.

## Isolated Live Acceptance Plan

No step below has been executed.

1. Create an isolated OpenAI project/key with no access to unrelated workloads.
2. Create or select a dedicated Qdrant collection named `portfolio_knowledge_acceptance`.
3. Use the values in `.env.playground.acceptance.example`; inject real secrets only in the isolated service environment.
4. Use one backend instance and an exact deploy-preview Netlify origin in both `PUBLIC_SITE_URL` and `ALLOWED_ORIGINS`.
5. Ingest the 73 versioned public documents once and verify readiness reports `9676131376337c49`.
6. Run the Qdrant retrieval evaluation on the approved questions without generation.
7. Run guarded sensitive/injection cases and confirm they make no retrieval or generation call.
8. Run at most five live Playground generations: SIHIA EN, SIHIA FR, Arcwell governance, AI BOS limitations, and Lab agent controls.
9. Run `python scripts/smoke_deployment.py --base-url <preview-api> --playground` once as the final paid smoke call.
10. Verify exact citations, corpus isolation, 401 refresh, 429 behavior, timeout, logs, and the preview frontend on desktop/mobile.

Expected live acceptance: correct corpus, at least one approved citation for answerable cases, no unsafe URLs, `support_status=not_evaluated`, no prompt/secret leakage, and safe refusal or no-evidence behavior for unsupported cases.

## Proposed Test Budget

- Administrative hard cap: **USD 1.00 total** for the isolated acceptance run.
- Maximum: one 73-document embedding batch, the bounded query-embedding evaluation set, five manual generations, and one final smoke generation.
- Output ceiling: 300 tokens per generation.
- No automatic retries beyond the SDK's configured single retry.
- Stop immediately on corpus-version mismatch, unexpected source, leaked internal detail, quota anomaly, or cumulative spend reaching the cap.

This is a hard operational cap, not a pricing estimate. Current provider pricing must be checked in the isolated account immediately before approval.

## Activation Checklist

- [ ] User explicitly approves the paid acceptance run and USD 1.00 cap.
- [ ] Isolated OpenAI project/key and Qdrant collection exist.
- [ ] Exact preview origin is configured; wildcard CORS remains forbidden.
- [ ] Corpus version and count match readiness.
- [ ] Retrieval evaluation results are recorded.
- [ ] Five bounded live cases and one smoke request pass.
- [ ] Session, IP, global, and concurrency limits are observed.
- [ ] Logs contain request IDs and coarse metadata, not full visitor questions or secrets.
- [ ] Desktop/mobile and FR/EN results are inspected.
- [ ] Production remains one instance or receives an implemented shared atomic limiter.
- [ ] `PLAYGROUND_ENABLED=true` is applied only after all previous items pass.

## Rollback

1. Set `PLAYGROUND_ENABLED=false`; this is sufficient to stop new Playground executions while preserving the portfolio and assistant.
2. Redeploy only the previous approved API artifact if a code rollback is required.
3. Remove the preview origin from `ALLOWED_ORIGINS`.
4. Revoke the isolated OpenAI key and disable/delete the acceptance Qdrant collection if no longer needed.
5. Keep the frontend route in its explicit disabled state, or roll back the frontend artifact independently.
6. Do not delete or recreate the assistant's production collection as part of Playground rollback.

## Remaining Limits

- No real OpenAI/Qdrant acceptance call has been authorized or executed.
- Pattern guards reduce common abuse but are not a complete semantic safety classifier.
- Claim-level entailment and contradiction resolution are not implemented; support remains `not_evaluated`.
- Memory quotas are valid for one process only. Redis or another atomic shared store is required before horizontal scaling.
- The offline lexical evaluation does not predict multilingual dense-vector behavior.
- Provider-side budget enforcement is not integrated into the API.

## Final Local Validation

Validation completed on 2026-10-16 without a paid provider call:

| Check | Result |
| --- | --- |
| Frontend tests | 31 passed across 11 files |
| Backend tests | 51 passed; 4 non-failing dependency/test-environment warnings |
| ESLint | 0 errors; 6 existing Fast Refresh warnings in shared UI modules |
| TypeScript | Passed (`tsc --noEmit`) |
| Production build | Passed; 2,187 modules transformed |
| Main JavaScript chunk | 248.88 kB / 80.32 kB gzip |
| Playground route chunk | 23.75 kB / 7.68 kB gzip |
| Critical route checks | 6/6 returned HTTP 200 |
| Git whitespace check | Passed |
| Secret-pattern review | No real provider secret found; only the literal test credential `test` |

The main chunk is effectively unchanged from the Phase 3 measurement (248.88 kB / 80.33 kB gzip). The Playground chunk increased from 21.75 kB / 7.13 kB gzip to 23.75 kB / 7.68 kB gzip because of session renewal, cancellation, timeout, quality-state handling, and responsive containment; it remains route-lazy-loaded and does not increase the initial main chunk.

Validated routes: `/`, `/lab`, `/lab/playground`, `/work/sihia`, `/work/ai-business-os`, and `/work/arcwell-agentic-crm`.

## Phase 4 Recommendations

1. Implement an atomic Redis-backed limiter before scaling the API horizontally.
2. Add a claim-to-citation evaluation set before considering an `evaluated_supported` status.
3. Record privacy-preserving aggregate request counts, guard outcomes, latency, and provider failures without full questions.
4. Add versioned dense-retrieval regression results after the approved live evaluation.
5. Keep any automation monitor aggregate-only and isolated from visitor content, as defined in the roadmap.
