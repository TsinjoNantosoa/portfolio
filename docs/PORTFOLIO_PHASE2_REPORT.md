# Portfolio V2 Phase 2 Report

Date: 2026-10-16  
Branch: `main`  
Starting commit: `02c54fe`

## Scope Delivered

Phase 2 extends the existing portfolio without replacing its React, routing, design-token, i18n, project-data, contact-form, or public-assistant architecture.

- Added a bilingual `/lab` route for RAG Engineering, Agentic AI, AI Automation, Production Engineering, and AI-Assisted Development.
- Connected every Lab capability to existing public case studies instead of creating unsupported claims.
- Added compact technical workflows, implementation details, maturity labels, and an evidence publication standard.
- Added `Evaluation & Testing` and `Current Limitations` to SIHIA, AI BOS, and Arcwell.
- Added a compact on-page navigation to long case studies.
- Preserved all existing slugs, project ordering, galleries, links, filters, maturity badges, and FR/EN behavior.
- Extended the assistant's generated public corpus with Lab capabilities, evaluation evidence, and limitations.

## Evidence Audit

### SIHIA

Source reviewed: local `sihia-platform/README.md` and RAG architecture documentation.

- Documented validation dated 2026-08-11: 118 backend tests passed, 1 skipped, 65 frontend tests passed, and 17 Playwright scenarios passed.
- Documented deterministic RAG benchmark: 30 French/English questions.
- Published limitations now include missing OCR, synchronous ingestion, English-oriented default reranking, paid/provider-dependent RAGAS evaluation, and mandatory human validation of medical content.

### AI BOS

Source reviewed: local `AI BOS/ai-business-os/README.md`.

- Documented audit dated 2026-09-07: 214 backend tests passed, 1 skipped, 16 frontend tests passed, typecheck and production build passed.
- Playwright is explicitly reported as 3 passed and 4 failed; the portfolio no longer leaves this gap implicit.
- Published limitations now include the RLS pytest harness issue, in-process workflow execution, Python/JSON vector scoring, incomplete specialist modules, and the distinction between deployment configuration and a proven production backend.

### Arcwell

Source reviewed: local `arcwell-agentic-crm/README.md` and architecture documentation.

- Documented audit: 99 backend tests passed, 71% measured backend line coverage, 13 frontend tests passed.
- Published limitations now include 83 current mypy errors, one LangGraph workflow, external integration requirements, application-level tenant predicates, and the container-startup validation gap.

These source-project test suites were not rerun as part of the portfolio build. Their counts are presented as dated, documented repository audits rather than as fresh Phase 2 executions.

## Bundle Measurement

Both measurements use `npm run build` with Vite 5.4.21 on the same workstation.

| Asset | Before Phase 2 | After route splitting | Change |
| --- | ---: | ---: | ---: |
| Main JavaScript chunk | 559.78 kB | 248.52 kB | -311.26 kB / -55.6% |
| Main JavaScript gzip | 174.64 kB | 80.18 kB | -94.46 kB / -54.1% |
| Case-study route | Included in main | 21.69 kB | Lazy-loaded |
| Lab route | Not present | 15.70 kB | Lazy-loaded |
| Home route | Included in main | 39.18 kB | Lazy-loaded |
| Assistant | 137.18 kB | 137.29 kB | Remains independently lazy-loaded |

The previous Vite warning for a JavaScript chunk above 500 kB is gone. The implementation uses `React.lazy` and `Suspense` at the route boundary; it does not alter route URLs, assistant behavior, authentication assumptions, or RAG API contracts.

Project and gallery images retain native lazy loading and now request asynchronous decoding. Existing SIHIA and AI BOS galleries already use compact WebP assets. Converting every remaining PNG is deferred because image quality and content framing need per-asset review rather than a blind format rewrite.

## Files And Responsibilities

- `src/pages/LabPage.tsx`: bilingual Lab interface, workflows, evidence links, and route metadata.
- `src/data/lab.ts`: typed, evidence-backed capability catalog.
- `src/types/lab.ts`: localized Lab data contracts.
- `src/pages/CaseStudyPage.tsx`: case-study navigation, maturity, testing, limitations, and proof dates.
- `src/data/projects.ts`: verified evaluation and limitation content for SIHIA, AI BOS, and Arcwell.
- `src/types/portfolio.ts`: optional evaluation and limitation fields.
- `src/i18n/I18nProvider.tsx`: Lab and Case Studies V2 interface translations.
- `src/i18n/portfolioContent.ts`: French translations for project-specific evidence and limitations.
- `src/App.tsx`: route-level code splitting and `/lab` registration.
- `src/data/navigation.ts`, `src/components/Layout/*`: desktop and mobile Lab access.
- `src/components/ui-kit/ProjectMedia.tsx`: asynchronous image decoding.
- `portfolio-ai-api/scripts/build_portfolio_knowledge.mjs`: generated knowledge for the new public content.
- `portfolio-ai-api/app/knowledge/public_portfolio.json`: regenerated 73-document public corpus.
- `portfolio-ai-api/tests/test_rag.py`: updated route and intentional corpus-size guards for the Lab content.
- `public/sitemap.xml`: `/lab` discovery.
- `src/pages/LabPage.test.tsx`: Lab translation, references, and priority-case evidence tests.
- `src/pages/CaseStudyPage.test.tsx`: SIHIA evidence, limitations, navigation, and French-copy regression coverage.
- `src/test/setup.ts`: shared browser media-query test support.
- `docs/PORTFOLIO_ROADMAP.md`: Phase 2 delivery status and the Phase 3 RAG Playground specification.

## Final Validation

All commands below were rerun on the final working tree on 2026-10-16.

| Check | Result |
| --- | --- |
| Frontend tests (`npm run test:run`) | 26 passed |
| Assistant API tests (`python -m pytest -q`) | 35 passed, 2 dependency/runtime warnings |
| TypeScript (`npx tsc --noEmit`) | Passed |
| ESLint (`npm run lint`) | 0 errors, 6 pre-existing Fast Refresh warnings |
| Production build (`npm run build`) | Passed, 2,182 modules transformed |
| Git whitespace check (`git diff --check`) | Passed; only Git's Windows line-ending notices were emitted |

Responsive checks covered the Lab and priority case-study layouts at desktop and mobile breakpoints. The local routes `/`, `/lab`, `/work/sihia`, `/work/ai-business-os`, and `/work/arcwell-agentic-crm` returned successfully during validation.

## Points Not Independently Verified

- The dated SIHIA, AI BOS, and Arcwell source-project test totals were verified in repository documentation but their complete suites were not rerun during this portfolio change.
- SIHIA's optional generated-answer RAGAS evaluation was not run because it requires credentials, network access, and paid provider calls.
- AI BOS still documents four failing Playwright scenarios and a PostgreSQL test-harness issue.
- Arcwell still documents unresolved mypy errors and an incomplete full-container validation.
- AI-assisted development tool usage is described as an engineering practice supplied by the portfolio owner; no productivity or quality metric is claimed.
- No Lighthouse score is claimed in this phase. Bundle output, responsive screenshots, routes, tests, and build are the measured acceptance evidence.

## Release Boundary

No commit, push, production deployment, paid service connection, new backend, or secret was added during Phase 2.
