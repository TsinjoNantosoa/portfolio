# Portfolio V2 Phase 3 Report

> Phase 3.1 hardening supersedes the original activation and answer-quality boundaries in this report. See `docs/PORTFOLIO_PHASE3_1_REPORT.md`.

Date: 2026-10-16  
Branch: `main`  
Starting commit: `f4d62c7`

## Delivered

- Lazy-loaded bilingual `/lab/playground` route linked from the AI Engineering Lab.
- Explicit `projects` and `engineering_lab` public corpus selection.
- Preset and custom questions with a 400-character ceiling and no automatic submission.
- Real API trace for query handling, retrieval, selected context, evidence-linked generation, answer, and citations.
- Verifiable source cards containing bounded excerpts, public routes, ranks, and real retrieval scores.
- Optional engineering panel with actual response time, strategy, selected-passage count, request ID, and limitations.
- Guarded, no-evidence, loading, cancellation, unavailable, rate-limit, and safe-error states.
- In-memory page history only; no new browser persistence or server-side conversation storage.
- Dedicated API response contract reusing the existing portfolio RAG backend and leaving the assistant stream unchanged.

## Security Review

- Existing JWT, CORS, client-IP resolution, session ownership, and safe error behavior are reused.
- Playground-specific rate limit: 12 requests per session per hour, plus the existing IP limit.
- Input and output are bounded server-side.
- Corpus is a schema allowlist and a Qdrant payload filter, not a client-provided collection name.
- Citations are filtered to approved internal public routes.
- English and French injection patterns stop retrieval and generation for recognized attacks.
- The service cannot invoke tools, workflows, webhooks, browsing, or external business actions.
- No API key or provider configuration was added to the frontend.
- Render keeps the feature disabled through `PLAYGROUND_ENABLED=false` until explicit cost approval.

Residual risks are documented in `docs/RAG_PLAYGROUND_ARCHITECTURE.md`: the rate limiter is process-local, pattern guards are not a complete semantic classifier, and a live-provider acceptance run is still required before production enablement.

## Performance

Both measurements use the same Vite 5.4.21 production build environment.

| Asset | Phase 2 | Phase 3 | Change |
| --- | ---: | ---: | ---: |
| Main JavaScript chunk | 248.52 kB | 248.88 kB | +0.36 kB / +0.14% |
| Main JavaScript gzip | 80.18 kB | 80.33 kB | +0.15 kB / +0.19% |
| Playground route | Not present | 21.75 kB / 7.13 kB gzip | Lazy-loaded |
| Lab route | 15.70 kB | 16.11 kB | +0.41 kB |

No JavaScript chunk exceeds Vite's 500 kB warning threshold.

## Validation Boundary

The deterministic API and UI suites exercise successful evidence, source matching, corpus restrictions, guarded requests, empty evidence, API errors, rate limits, kill switch behavior, translations, and non-submitting corpus selection without network or paid-provider use.

The real OpenAI/Qdrant Playground path was not called during this local implementation because that would consume a paid provider and the user explicitly required cost approval first. Therefore the implementation is not claimed as production-enabled. It is production-gated and ready for an approved deploy-preview acceptance run.

## Final Validation

| Check | Result |
| --- | --- |
| Frontend tests (`npm run test:run`) | 29 passed across 11 files |
| Assistant and Playground API tests (`python -m pytest -q`) | 42 passed; non-failing httpx/Qdrant environment warnings documented |
| TypeScript (`npx tsc --noEmit`) | Passed |
| ESLint (`npm run lint`) | 0 errors, 6 pre-existing Fast Refresh warnings |
| Production build (`npm run build`) | Passed, 2,187 modules transformed |
| Responsive review | Desktop 1440 x 1000 and mobile 500 x 900 inspected |

The existing assistant tests, project-filter test, Phase 2 Lab tests, SIHIA case-study test, preferences test, and production build remain green.

## Files And Responsibilities

- `src/pages/PlaygroundPage.tsx`: bilingual page, corpus selection, presets, custom question, temporary history, request states, answers, evidence, and security summary.
- `src/features/playground/api.ts`: authenticated Playground request client.
- `src/features/playground/types.ts`: response, evidence, trace, corpus, and history contracts.
- `src/features/playground/PipelineVisualizer.tsx`: actual server-trace rendering.
- `src/features/playground/EngineeringInsights.tsx`: optional strategy, timing, request ID, passage, and limitation panel.
- `src/data/playground.ts`: bilingual corpus descriptions, verified sample questions, and pipeline labels.
- `src/pages/PlaygroundPage.test.tsx`: success, citation, score, corpus, no-auto-submit, French, and unavailable-state coverage.
- `src/App.tsx`: lazy `/lab/playground` route.
- `src/pages/LabPage.tsx` and its test: discoverable Playground entry point.
- `src/components/Layout/Header.tsx`: Lab navigation state for nested Lab routes.
- `portfolio-ai-api/app/schemas.py`: strict request and observable response schemas.
- `portfolio-ai-api/app/config.py`: input, output, rate, and kill-switch settings.
- `portfolio-ai-api/app/rag.py`: corpus-filtered Qdrant retrieval while preserving the assistant default.
- `portfolio-ai-api/app/chat.py`: guarded Playground execution, measured trace, bounded evidence, and public-source filtering.
- `portfolio-ai-api/app/main.py`: authenticated, rate-limited `/api/public/playground/query` endpoint.
- `portfolio-ai-api/tests/test_playground_api.py`: API validation, ownership, rate, kill-switch, and safe-error tests.
- `portfolio-ai-api/tests/test_playground_pipeline.py`: retrieval, evidence, trace, URL allowlist, guard, and no-evidence tests.
- `render.yaml`: production-disabled defaults and bounded Playground configuration.
- `public/sitemap.xml`: Playground route discovery.
- `docs/RAG_PLAYGROUND_ARCHITECTURE.md`: architecture, controls, failure modes, limits, and activation checklist.
- `docs/PORTFOLIO_ROADMAP.md`: Phase 3 status and remaining production acceptance work.

## Release Boundary

No commit, push, deployment, paid-service activation, secret, private corpus, or second backend was created during this phase.
