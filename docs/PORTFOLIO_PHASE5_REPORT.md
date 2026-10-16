# Phase 5 Report — Business Automation Showcase

## Status (checked 2026-10-16 against Git and the public site)

| Stage | State | Evidence |
|---|---|---|
| Phase 5 merged into `main` | **Yes**, commit `176c632`; `main` equals `origin/main`; the feature branch has no diff against it | `git log`, `git diff main feature/phase5-automation-showcase` is empty |
| Phase 5 deployed | **Yes** | `tsinjona.netlify.app/lab/automation` serves the `AutomationPage` chunk and the deployed sitemap lists the route |
| Phase 5 verified in production | **Yes, behaviour only** | Browser matrix on the live site: 7 combinations, all pass (see below). The exact deployed commit cannot be read from Netlify; it is inferred from the chunk and from the old dates it still contains |
| Phase 5.1 fixes | **Local only**, uncommitted, branch `feature/phase5-1-quality-fixes` | Not merged, not deployed, not verified in production |

Production therefore still shows the pre-5.1 behaviour: corporate dates `2027-03-15` that disagree with the 2-day lead time, and the group/premium priority overlap described below.

Audit: `docs/PORTFOLIO_PHASE5_AUDIT.md`. Design: `docs/BUSINESS_AUTOMATION_SHOWCASE_ARCHITECTURE.md`.

## Phase 5.1 — final quality fixes (local, pending approval)

| # | Finding | Cause | Fix |
|---|---|---|---|
| 1 | Presets displayed dates that disagreed with their lead time (Business implied a 10 March request, Corporate a 13 March one) | `departureDate` and `daysToDeparture` were two independent inputs | One explicit simulation clock, `requestDate` (`SCENARIO_REFERENCE_DATE` = 2027-03-10). The lead time is **derived** (`daysToDeparture()`), so it cannot disagree. Presets come from `createPresetScenarios(referenceDate)`, injectable for tests. Corporate is now 2027-03-12 → 2027-03-19; Business is unchanged (03-17 → 03-25). `SCENARIO_VERSION` is `2026.10-demo.2` |
| 2 | **Priority divergence from the reference**: a group of 10+ in Business scored GROUP +20 **and** MULTI_PAX_PREMIUM +10 | In `lib/priority.js` the two rules are `if … else if` (exclusive); the simulator applied both | Made exclusive. No preset is affected (55 HIGH and 45 NORMAL unchanged) |
| 3 | Routing rule `CRITICAL_TO_PREMIUM` was not mirrored | Omission | Added for fidelity. Unreachable from the simulator's inputs (an economy request caps at 65), so no visible change |
| 4 | Radio group did not follow the ARIA pattern | Three tab stops, arrow keys did nothing | Roving tabindex; arrows and Home/End select and move focus; one tab stop |
| 5 | Form fields had a transparent focus outline | `outline-none` left only a 1 px border change | Visible 2 px focus outline, consistent with the rest of the site |
| 6 | The mirror could drift from the reference repository without notice | Copied data, no check | `npm run check:offshore` (below) |

Not changed, by design: the metadata of `/lab/automation` is correct after rendering (title, description, canonical, `og:url`, no `noindex`, one `h1`, `lang`), and robots and sitemap allow it. **Residual risk:** the HTML delivered before JavaScript carries the home page's canonical and `og:url`, like every non-home route (`/lab`, `/lab/playground`, `/lab/operations`, `/work/*`). Crawlers that do not run JavaScript, such as most link-preview bots, see the home page metadata. Fixing it needs pre-rendering or per-route HTML, already on the roadmap, and was out of scope because it changes the build or the Netlify configuration.

### Reference check (`npm run check:offshore`)

Compares the simulator's mirrored data with the public reference repository (read-only HTTP GET; never at build or runtime): the status list, the full transition table, priority weights, level thresholds, the group threshold, and canary lines for logic that cannot be parsed as data (exclusive travel-time rules, exclusive cabin rules, exclusive group/premium rule, score cap, routing rule order, premium cabin list). It is skipped in normal test runs, so CI never needs the network. Optional `OFFSHORE_REF=<branch|sha>`.

Verified: it passes against `main` of the reference (reviewed commit `e75a234`, 2026-10-14) and **fails** when a weight or a transition is deliberately altered (mutation check, then restored).

When it fails: read the upstream change, update the mirrored data, add a test, bump `OFFSHORE_REVIEWED_COMMIT` in `reference.ts`. It cannot detect changes to logic outside the canary list; review `lib/priority.js` and `lib/routing.js` by eye when the reference changes materially.

### Final verification (Phase 5.1 code)

| Check | Result |
|---|---|
| `tsc --noEmit -p tsconfig.app.json` | pass |
| `eslint .` | 0 errors; the same 6 pre-existing warnings, none in changed files |
| `vitest run` | 14 files passed + 1 skipped; **100 tests passed**, 4 skipped (reference check, enabled on demand) |
| `vite build` | pass; main chunk 249,949 B (unchanged), `AutomationPage` 81,881 B (24.0 kB gzip, +797 B) |
| Browser matrix, local build | 7 combinations, all pass |
| Browser matrix, **production** (pre-5.1 build) | 7 combinations, all pass |

Matrix (Edge headless; real autoplay once, "skip to approval" otherwise): desktop 1440 dark/EN, desktop 1440 light/FR, tablet 820 dark/EN, mobile 390 dark/FR, mobile 390 light/EN, desktop light/EN, desktop dark/FR. Flows: Business → approve (55 HIGH), Corporate → reject (45 NORMAL), Custom → two revisions (the second disables the button) → approve. Per combination it asserts: priority text, status at the gate, outcome text in the page language, final status (`BOOKING_REQUESTED`; never `TICKETING`/`TICKETED`; `SEARCHING` after a reject), no forward action after a reject, no horizontal overflow, no console or page error, `lang` and theme applied, and **zero network requests between clicking Run and the end of the simulation**.

Limits of this verification: each flow, theme, language and width was covered at least twice but not every cross-combination; production was tested on the pre-5.1 build; reduced motion was not exercised in a browser; the assistant bubble overlapping content on narrow screens is pre-existing.

---

The original Phase 5 report (written before the merge) follows. Where it differs from the sections above, the sections above are current.

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
- The status/transition table and priority rules are copies. Since Phase 5.1, `npm run check:offshore` compares them with the reference repository on demand; it is not part of CI and does not cover logic outside its canary list.
- The assistant knowledge JSON does not mention this page; refreshing it needs an ingestion run and was deliberately not done.
- Visual review of tablet and mobile-light was partial (section 11).
- Pre-existing: the assistant launcher bubble overlaps content on narrow screens.

## 15. Recommendations before deployment

1. Review the branch diff and the pages yourself on a real phone.
2. Decide whether to publish the Offshore Fares repository facts quoted in the Insights (node counts, retry/timeout counts) as written.
3. Commit on the feature branch, open a deploy preview on Netlify, retest `/lab/automation` (including deep-link refresh) and the Lab and case-study links.
4. Optionally refresh the assistant knowledge in a separate, deliberate step.
5. Merge only after approval. No backend redeploy is needed.
