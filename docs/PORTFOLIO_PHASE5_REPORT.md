# Phase 5 Report — Business Automation Showcase

Status: implemented and validated locally on 2026-10-16 on branch `feature/phase5-automation-showcase`. **Not committed, not pushed, not deployed.** Audit: `docs/PORTFOLIO_PHASE5_AUDIT.md`. Design: `docs/BUSINESS_AUTOMATION_SHOWCASE_ARCHITECTURE.md`.

## 1. Architecture

Frontend-only deterministic simulation: a pure TypeScript engine (`engine.ts`, `rules.ts`, `transitions.ts`) driven by a small React hook and presentational components. No backend, model, n8n, database or paid call. An `AutomationRunner` interface leaves a seam for a later backend adapter.

## 2. Changes

New page `/lab/automation` ("Business Automation Showcase / From Customer Request to Controlled AI Workflow", French equivalents included). Scenario picker with two presets and a validated custom form; run controls (auto-play, step, skip to approval, restart); Business and Engineering views; progressively filled request file; human approval gate; result summary; execution trace; Engineering Insights section; links from the Lab and the Offshore Fares case study; sitemap entry.

## 3. Files

Created: `src/features/automation/{types,transitions,rules,scenarios,engine,runner,dates,copy,useAutomationRun}.ts`, `src/features/automation/components/{AutomationDemo,ScenarioPicker,WorkflowVisualizer,RequestFileCard,ApprovalPanel,QuotePanel,ResultPanel,TracePanel,EngineeringInsights}.tsx`, `src/pages/AutomationPage.tsx`, `src/features/automation/engine.test.ts`, `src/pages/AutomationPage.test.tsx`, three docs.
Modified: `src/App.tsx` (lazy route), `src/pages/LabPage.tsx` (CTA), `src/pages/CaseStudyPage.tsx` (CTA from `labDemoLink`), `src/types/portfolio.ts` and `src/data/projects.ts` (`labDemoLink` on Offshore Fares), `src/index.css` (`--warn`, `--danger` theme variables), `public/sitemap.xml`, `docs/PORTFOLIO_ROADMAP.md`.
Untouched: `portfolio-ai-api/**`, assistant code and knowledge JSON, Render/Netlify configuration, Playground and Operations code.

## 4. Scenarios

Business Travel (Mumbai → London, 3 Business, VIP, urgent → 55 HIGH), Corporate Travel (Delhi → New York, 2 Business, short notice → 45 NORMAL), Custom Request (validated, fictional only). All carriers, fares and times are fictional.

## 5. Workflow transitions

Twelve pipeline steps drive real Offshore Fares statuses: `NEW → READY_FOR_SEARCH → ASSIGNED → SEARCHING → FARES_FOUND → PENDING_APPROVAL`, then after approval `APPROVED → QUOTED → AWAITING_CLIENT → BOOKING_REQUESTED`. The 14-step narrative in the brief was reconciled with the repository: classification, extraction and priority are events, not statuses (see the architecture doc).

## 6. Simulation rules

Priority weights, levels and routing come from `lib/priority.js` and `docs/business-process.md` of the reference repository. Fares are generated from a seeded hash. A simulated client always replies to OPT-002. Every figure is re-verified by code.

## 7. Human validation

The run stops at `PENDING_APPROVAL` and cannot continue until the visitor chooses. Approve continues to a simulated booking request; Reject returns the RFQ to `SEARCHING` and ends the run; Request Revision produces quote v2 (then v3), with a limit of two. Decisions change the real engine state and trace.

## 8. Reused components

`Header`, `Footer`, `site-container`/`eyebrow`/`neon` styling, the Lab card and CTA styles, the page-level `{ en, fr }` copy pattern, `ThemeProvider`, `I18nProvider`, lucide icons, the existing test harness.

## 9. Tests executed (final code)

| Check | Result |
|---|---|
| `tsc --noEmit -p tsconfig.app.json` | pass |
| `eslint .` | 0 errors; 6 pre-existing warnings in shadcn UI files, none in changed files |
| `vitest run` | **14 files / 89 tests pass** (baseline 12 / 38; +42 engine, +9 page) |
| `vite build` | pass |

Engine tests cover: presets, documented 55 HIGH example, 14 invalid-input cases, determinism, priority/routing, transition table integrity, ordered execution, cannot skip approval, approve / reject / revise, revision cap, nothing after rejection, no double decision, legal transitions on every path, immutability, restart, no `fetch` call.
Page tests cover: disclaimers, Lab and case-study links, full approve and reject paths through the UI, revision limit, custom-form validation, keyboard operation and focus at the gate, Engineering view, French copy.
Not run: backend `pytest` (no backend file changed). Regression of the Assistant, Playground, Operations and case-study pages relies on their existing tests, all still passing.

## 10. Performance

| Chunk | Before (bytes) | After (bytes) |
|---|---|---|
| `index` (main) | 249,561 | 249,949 (+388, the route entry) |
| `LabPage` | 16,669 | 16,841 (+172) |
| `CaseStudyPage` | 21,836 | 22,166 (+330) |
| `AutomationPage` (new, lazy) | — | 81,084 (23.6 kB gzip) |

No dependency was added. Roughly half of the new chunk is bilingual copy. If needed, splitting EN and FR copy into separate dynamic imports would roughly halve it.

## 11. Desktop and mobile checks

Real Microsoft Edge (headless, production build via `vite preview`), full flow Run → approval → Approve → result: desktop 1440 px dark and light, tablet 820 px dark, mobile 390 px dark and light. Results: flow completes in every case, no horizontal overflow, no console or page errors, and the only external requests are the Google Fonts already used by the whole site (no API, model or n8n request). A light-theme contrast problem on amber text was found and fixed with theme variables; re-checked afterwards. Reduced-motion is implemented (`motion-reduce` classes, zero step delay) and unit-wired through `matchMedia`, but not exercised in the browser run. Screenshots were reviewed visually for desktop-dark, desktop-light, and the mobile approval page; tablet and mobile-light were checked only by overflow and error metrics.

## 12. Limits of simulated mode

Nothing runs n8n or a model. "AI" steps are rules and are labelled **Simulated AI**. Fares, carriers and times are fictional. Durations are interface delays (650 ms) and no timestamp is shown. The client reply is fixed. SLAs, follow-ups, channels, after-sales and error recovery are described, not simulated. Not connected to the Operations Monitor.

## 13. n8n V2 integration plan (documented only)

Portfolio React → secured demo backend → dedicated webhook → isolated test workflow → synthetic response → same `AutomationRun` shape. Preconditions before any build: separate n8n instance and workflows, no customer data, authenticated webhooks, rate limiting and payload validation, timeouts with controlled retry, a spending cap, logs without personal data, and no real email, WhatsApp, booking, payment or ticketing provider. Do not expose the current Offshore Fares webhooks. Requires explicit approval.

## 14. Remaining risks

- Visitors may still read the page as a live system. Mitigation: banner, per-step "Simulated" labels, comparison table. Consider a reviewer read-through.
- The status/transition table is a copy; it can drift from the reference repository (the test checks internal consistency only, not sync with GitHub).
- The assistant knowledge JSON does not mention this page; refreshing it needs an ingestion run and was deliberately not done.
- Visual review of tablet and mobile-light was partial (section 11).
- Pre-existing: the assistant launcher bubble overlaps content on narrow screens.

## 15. Recommendations before deployment

1. Review the branch diff and the pages yourself on a real phone.
2. Decide whether to publish the Offshore Fares repository facts quoted in the Insights (node counts, retry/timeout counts) as written.
3. Commit on the feature branch, open a deploy preview on Netlify, retest `/lab/automation` (including deep-link refresh) and the Lab and case-study links.
4. Optionally refresh the assistant knowledge in a separate, deliberate step.
5. Merge only after approval. No backend redeploy is needed.
