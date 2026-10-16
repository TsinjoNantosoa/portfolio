# Business Automation Showcase — Architecture

Route: `/lab/automation` (lazy-loaded). Code: `src/features/automation/`, page `src/pages/AutomationPage.tsx`.

## Principle

A deterministic, frontend-only simulation of the Offshore Fares RFQ workflow. It reuses the reference project's **state machine and priority rules** but executes none of its n8n workflows, calls no model, and sends nothing. Every trace line and payload is produced by the simulator and labelled as such.

```
ScenarioPicker ──start──▶ useAutomationRun ──▶ AutomationRunner (simulated)
                              │                    └─ engine.ts: startRun / advance / decide  (pure)
                              ▼                          ├─ rules.ts       validation, classify, extract, priority, routing, fares, quote check
                       AutomationRun (immutable)         └─ transitions.ts mirrored Offshore Fares transition table
                              │
        ┌─────────────────────┼──────────────────────┬──────────────┐
 WorkflowVisualizer   RequestFileCard   ApprovalPanel / ResultPanel   TracePanel
 (Business | Engineering)                (human gate)                 (sequence, no timestamps)
```

The engine has no React or DOM dependency and is tested alone (`engine.test.ts`).

## Model

`AutomationRun` is an immutable value: `status` (one of the 20 Offshore Fares RFQ statuses), `steps[]` (12 pipeline steps with `pending | done | waiting | rejected`), `trace[]`, `decisions[]`, `quotes[]` (versions), `awaitingApproval`, `outcome` (`completed | rejected | null`), `scenarioVersion`. Each `advance`/`decide` returns a new run, so restart and history are trivial.

The visual "active" state is derived in the UI from the next pending step; the engine never fabricates progress.

## Pipeline and real statuses

| # | Step (event) | Actor | RFQ status after |
|---|---|---|---|
| 1 | Message received | system | `NEW` |
| 2 | Classified (intent `NEW_QUOTE`) | simulated AI | `NEW` |
| 3 | Extracted (structured fields) | simulated AI | `NEW` |
| 4 | RFQ created | system | `READY_FOR_SEARCH` |
| 5 | Priority calculated (rules, no AI) | system | `READY_FOR_SEARCH` |
| 6 | Fare desk assigned | system | `ASSIGNED` |
| 7 | Fares entered | simulated fare desk | `SEARCHING` → `FARES_FOUND` |
| 8 | Quote generated, numbers verified by code | simulated AI | `PENDING_APPROVAL` |
| 9 | **Human approval gate** | you | see below |
| 10 | Quote "sent" (nothing delivered) | system | `APPROVED` → `QUOTED` → `AWAITING_CLIENT` |
| 11 | Client reply selects an option | simulated client | `AWAITING_CLIENT` |
| 12 | Booking requested, summary for Ticketing Desk | system | `BOOKING_REQUESTED` |

The brief's 14-step journey (`MESSAGE RECEIVED … TICKETING NOTIFIED`) is a business narrative. In Offshore Fares, steps such as classification, extraction and priority calculation are pipeline events, not statuses, so the demo shows both. `TICKETING` and `TICKETED` are never reached: ticketing is a human action in the reference project.

## Decisions at the gate

| Decision | Transitions | Result |
|---|---|---|
| Approve | `PENDING_APPROVAL → APPROVED`, then steps 10–12 | `completed`, final status `BOOKING_REQUESTED` |
| Reject | `PENDING_APPROVAL → SEARCHING` | `rejected`. Run is final; `advance` and `decide` throw `RunFinishedError`. Nothing is sent |
| Request revision | `PENDING_APPROVAL → FARES_FOUND → PENDING_APPROVAL` | New quote version with a stated change (OPT-001 −USD 60, then OPT-002 −USD 40 per traveler). Totals recomputed by code. Maximum 2 revisions |

`transition()` is the only function that changes `status`. It rejects any pair absent from `ALLOWED_TRANSITIONS` (a copy of `rfq_status_transitions`) with `IllegalTransitionError`.

## Rules reproduced from Offshore Fares

- Priority weights: travel < 24 h +40, < 72 h +25, First +25, Business +20, group (≥ 10) +20, 3+ premium travelers +10, VIP agency +15, explicit urgency +10. Levels: LOW < 30 ≤ NORMAL < 50 ≤ HIGH < 70 ≤ CRITICAL. The documented example (Business, 3 premium travelers, VIP, urgent) yields 55 HIGH and is a test.
- Routing: group → Group Desk; any non-economy cabin → Premium Desk; otherwise General Desk.
- Quote guard: every total must equal `per-traveler × travelers`; revisions re-run the check.

Not reproduced: SLAs, VIP lookup, operator load balancing, AI confidence thresholds, delivery channels, follow-ups, after-sales.

## Scenarios

| Id | Input | Priority |
|---|---|---|
| `business-travel` | Mumbai → London, 3 × Business, VIP, urgent, 7 days ahead | 55 HIGH → Premium Desk |
| `corporate-travel` | Delhi → New York, 2 × Business, 2 days ahead | 45 NORMAL → Premium Desk |
| `custom` | Visitor input, validated | Computed |

Presets fix `daysToDeparture` so scores never depend on the visitor's clock. For custom requests the page derives it from the chosen date and passes it in, keeping the engine pure. Fares come from a seeded hash of route and cabin with fictional carriers (Aurora Airways, Meridian Air, Nimbus Airlines). `SCENARIO_VERSION` is shown in the result.

## Input safety

Places: letters, spaces, `.`, `'`, `-`, 2–39 characters. Travelers 1–12. Departure within 330 days, return not before departure. Note ≤ 140 characters, rendered as text, with a visible warning not to enter personal data. Nothing is stored, logged or sent.

## Extension seam

`AutomationRunner` (`runner.ts`) exposes `start`, `advance`, `decide`. Only `SimulatedAutomationRunner` exists. A `RemoteDemoAutomationRunner` would have to return the same `AutomationRun` shape from a backend; it is not built (see the V2 plan in the phase report).

## Boundaries

No change to `portfolio-ai-api`, Qdrant, ingestion, the assistant knowledge file, Render, Netlify configuration or the AI Operations Monitor. No metric from this page is reported to the monitor.
