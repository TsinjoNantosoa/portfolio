# Phase 5 Audit — Business Automation Showcase

Date: 2026-10-16. Branch: `feature/phase5-automation-showcase` (created from `main` at `74282e0`, working tree clean).

## 1. What already exists

| Area | Finding |
|---|---|
| Stack | React 18, TypeScript, Vite, Tailwind, `react-router-dom`, `framer-motion`, Vitest + Testing Library. No diagram library is installed. |
| Routes (`src/App.tsx`) | `/`, `/lab`, `/lab/playground`, `/lab/operations`, `/work/:slug`, `*`. Every page except `Index` is already `React.lazy`. |
| Lab page | `src/pages/LabPage.tsx` renders five capabilities from `src/data/lab.ts` plus two CTA buttons (Playground, Operations). |
| i18n | `I18nProvider` holds the global messages. Newer pages (`OperationsPage`, `PlaygroundPage`) keep their own `{ en, fr }` copy objects and read `language` from `useI18n()`. |
| Design tokens | `site-container`, `eyebrow`, `bg-neon`, `--bg-primary`, `--surface-1`, `--text-*`. Light/dark through `ThemeProvider`. |
| Offshore Fares project | `featuredProjects` entry `offshore-fares` (maturity `Prototype`), six screenshots in `public/portfolio-uploads/offshore-fares-*.png`, `githubLink` set. Case study route `/work/offshore-fares`. |
| Tests | 12 files / 38 tests, all green on `main` before this phase. |
| Bundles (baseline) | `index` 249,561 B; `LabPage` 16.7 kB; `OperationsPage` 15.5 kB; `PlaygroundPage` 23.9 kB. |
| Sitemap | Lists `/lab`, `/lab/playground`, `/lab/operations`. |

## 2. Reference project (Offshore Fares), verified in the public repository

Cloned read-only to a scratch directory. No `.env` or secret was read or copied.

- 18 n8n workflows (`WF01`…`WF17`, `WF99`). Real node types used: `code`, `postgres`, `executeWorkflow`, `switch`, `webhook`, `respondToWebhook`, `httpRequest`, `scheduleTrigger`, `gmail`, `gmailTrigger`, `errorTrigger`. There is **no** dedicated LLM node and **no** human-approval node: AI calls go through `httpRequest`/`code`, approval is a workflow (`WF11`) backed by database state.
- The state machine has **20 statuses** and an explicit transition table (`database/schema.sql`, mirrored in `lib/stateMachine.js`). `NEW → TICKETED` is refused by the database.
- **The 14-step journey in the Phase 5 brief is a business narrative, not the implemented status list.** `MESSAGE RECEIVED`, `AI CLASSIFIED`, `AI EXTRACTED`, `PRIORITY CALCULATED`, `FARES ENTERED`, `QUOTE GENERATED` are pipeline *events*; the implemented *statuses* are `NEW`, `READY_FOR_SEARCH`, `ASSIGNED`, `SEARCHING`, `FARES_FOUND`, `PENDING_APPROVAL`, `APPROVED`, `QUOTED`, `AWAITING_CLIENT`, `BOOKING_REQUESTED`, `TICKETING`, `TICKETED`, etc. The showcase therefore shows both: pipeline steps (visual) and the real status after each step (engine state).
- Priority rules (`lib/priority.js`, `docs/business-process.md`): travel < 24 h +40, < 72 h +25, First +25, Business +20, group (≥ 10) +20, 3+ premium passengers +10, VIP agency +15, explicit urgency +10. Levels: 0–29 LOW, 30–49 NORMAL, 50–69 HIGH, 70–100 CRITICAL. The documented example (Business 20 + 3 premium pax 10 + VIP 15 + urgent 10) is **55 HIGH**.
- Routing: group → Group Desk; First/Business/Premium Economy → Premium Desk; economy → General Desk.
- Approval has three outcomes in the schema: `APPROVED`, `EDITED`, `REJECTED`. A rejected quote moves `PENDING_APPROVAL → SEARCHING`. An edit/recheck moves `PENDING_APPROVAL → FARES_FOUND → PENDING_APPROVAL` (new version).
- Booking handoff: `BOOKING_REQUESTED` produces a Ticketing Desk summary. **Ticketing is always a human action**, so the simulation stops at `BOOKING_REQUESTED`.
- The quote step guards numbers: any altered or invented number is rejected and a template is used.

## 3. Reusable components and patterns

`Header`, `Footer`, `site-container`/`eyebrow` utilities, the `LabPage` card and CTA styling, the `OperationsPage` `{ en, fr }` page-copy pattern, `ThemeProvider`, `lucide-react` icons, the `MemoryRouter` + providers test harness from `LabPage.test.tsx`.

## 4. Showcase data model (decision)

Pure TypeScript engine in `src/features/automation/`, independent of React:

- `ScenarioInput`: origin, destination, passengers (1–12), cabin, `departureDate`, `daysToDeparture`, optional return date, optional note, `vipAgency`, `urgent`.
- `AutomationRun`: immutable value holding RFQ `status`, `cursor`, `steps`, `trace`, `decisions`, `quoteVersion`, `outcome`, `scenarioVersion`.
- Pure functions `startRun`, `advance`, `decide`. The visitor-facing React layer only dispatches these.
- Every status change goes through one `transition()` guard that checks the mirrored Offshore Fares transition table and throws on an illegal move.
- Trace entries carry a **code + params** (translated in the UI) and a sequence number. There are no timestamps, so nothing can be mistaken for a measured latency.
- `AutomationRunner` interface with one implementation, `SimulatedAutomationRunner`. A remote adapter is documented, not built.

## 5. Risks

| Risk | Mitigation |
|---|---|
| Presenting simulated AI as real | Permanent “Simulated AI classification” label; no network call anywhere in the feature; tests assert no `fetch`. |
| Breaking the chatbot / Qdrant | No change to `portfolio-ai-api`, ingestion, knowledge JSON, or assistant code. |
| Polluting Operations Monitor | No instrumentation; no new endpoint. |
| Bundle growth | Lazy route, no new dependency, CSS/React visualisation. |
| Sensitive input in the custom form | Letters-only places, no personal fields, note limited to 140 chars, nothing stored or sent, a visible warning. |
| Fake fares read as real | Fictional carriers, “Demo data only” banner, no fare is derived from a real route price. |
| Copy drift vs the real repository | Insights cite workflow/file names verified above; the transition table is mirrored and covered by a test. |

## 6. Files

Create: `src/features/automation/{types,transitions,rules,scenarios,engine,runner,copy}.ts`, `src/features/automation/components/*`, `src/pages/AutomationPage.tsx`, tests for engine and page, `docs/PORTFOLIO_PHASE5_REPORT.md`, `docs/BUSINESS_AUTOMATION_SHOWCASE_ARCHITECTURE.md`.
Modify: `src/App.tsx` (lazy route), `src/pages/LabPage.tsx` (CTA), `src/pages/CaseStudyPage.tsx` (Offshore CTA), `public/sitemap.xml`, `docs/PORTFOLIO_ROADMAP.md`.
Not touched: `portfolio-ai-api/**`, assistant components, `public_portfolio.json`, Render/Netlify config.

## 7. Tests required

Engine (deterministic, no React): scenarios, validation, RFQ id, classification, priority scoring (including the documented 55 HIGH example), routing, transitions legality, approve / reject / revise paths, revision cap, cannot skip the approval gate, cannot advance after rejection, restart. Page: route renders, Lab link, Offshore link, FR copy, keyboard-operable decision buttons, validation errors, no `fetch`. Regression: existing 38 tests, lint, type check, build.

## 8. Strategy

Explore → plan → implement engine first with tests → UI on top → integration links → docs → full validation. Work stays on the feature branch; no commit, push or deploy without explicit approval.
