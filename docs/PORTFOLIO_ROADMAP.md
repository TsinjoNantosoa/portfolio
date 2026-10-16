# Portfolio Engineering Roadmap

This roadmap covers work intentionally deferred after Phase 1. Items are ordered by value, evidence readiness, delivery risk, and operating cost.

## Phase 2 — Case Studies And AI Engineering Lab

Status: implemented locally on 2026-10-16, pending user-approved commit and deployment.

Delivered:

- Bilingual `/lab` route with five evidence-backed engineering capabilities.
- Project-linked workflows and explicit maturity labels.
- Evaluation, testing, and current limitations for SIHIA, AI BOS, and Arcwell.
- Route-level lazy loading that reduced the main JavaScript chunk from 559.78 kB to 248.52 kB.
- Public assistant knowledge updated from the same typed project and Lab sources.

### 2.1 Case-Study Platform

The current `/work/:slug` route and typed `FeaturedProject` model already support overview, problem, solution, architecture, decisions, security, integrations, outcomes, learnings, evidence, gallery, and Human-in-the-Loop content.

Next increments:

1. Add optional `challenges`, `evaluation`, and `limitations` fields to the existing model.
2. Render a compact on-page case-study navigation for long pages.
3. Add project-specific JSON-LD using only verified project facts and public URLs.
4. Pre-render the six public case-study routes during the build so their title, description, canonical URL, and image are available without client-side JavaScript.
5. Add automated link and metadata checks against every `featuredProjects` entry.
6. Keep sensitive professional architecture at the approved abstraction level already used by the production RAG case study.

Acceptance criteria:

- Existing slugs and links remain unchanged.
- Every case study identifies maturity and known limitations.
- Every metric is traceable to repository documentation or professional evidence approved for publication.
- All routes build as static public HTML or have an equivalent crawlable rendering strategy.

### 2.2 AI Engineering Lab

The `/lab` route now contains five complete, evidence-backed modules. Future additions must keep the same proof threshold.

Proposed modules:

- **RAG Engineering:** ingestion, chunking, retrieval, reranking, grounding, citations, evaluation, and refusal behavior mapped to the projects that implement each capability.
- **Agentic AI:** structured outputs, LangGraph where used, tool permissions, deterministic policies, Human-in-the-Loop, audit, and observability.
- **Automation Engineering:** n8n workflows, webhook validation, retries, idempotency, dead-letter handling, and operator checkpoints.
- **AI-Assisted Engineering:** a transparent workflow for exploration, planning, implementation, review, and tests with Codex, Claude Code, and Cursor. Tools should be presented as development aids, not as authorship substitutes.

Implementation approach:

- Store lab entries in typed data next to the project catalog.
- Link each capability to one or more real case studies.
- Label capabilities as `Production`, `Implemented`, `Prototype`, or `Explored`.
- Reuse current section, card, theme, i18n, and routing patterns.
- Lazy-load diagrams and interactive modules.

## Phase 3 — Interactive Demonstrations

Status: first Public RAG Playground implementation completed locally on 2026-10-16; production activation remains gated by budget approval and a live-provider deploy-preview test.

Phase 3.1 hardening is also complete locally: activation now defaults off, quotas cover renewed sessions/IP/global/concurrency, answer support is explicitly not evaluated, corpus versions are checked, and a USD 1.00 isolated live-acceptance plan is documented. No paid acceptance call has run.

Phase 3.2 final hardening is implemented locally and awaiting staging validation. It preserves HTTP 429 responses and `Retry-After`, distinguishes known 503 outages from unexpected 500 errors, validates the complete manifested Qdrant corpus, uses an explicit Render proxy trust mode, and expands the offline retrieval/refusal evaluation. No cloud resource, paid request, deployment, commit, or push was initiated as part of this phase.

Delivered for the Public RAG Playground:

- Bilingual lazy-loaded `/lab/playground` interface.
- Two explicitly authorized public corpora.
- Real structured pipeline traces rather than decorative stage animation.
- Retrieved passages, scores, citations, response timing, strategy, limitations, and request IDs.
- Input, origin, session, corpus, injection, rate, token, source-URL, and safe-error controls.
- Deterministic frontend and backend test coverage that requires no paid provider.
- Render kill switch set to disabled until explicit production approval.

Remaining before production activation:

1. Approve the provider budget and traffic ceiling.
2. Reingest the current public corpus and run the live retrieval evaluation.
3. Execute live, no-evidence, injection, timeout, and rate-limit scenarios in a deploy preview.
4. Replace the process-local limiter with shared storage before horizontal scaling.
5. Enable `PLAYGROUND_ENABLED` only after the acceptance evidence is recorded.

### 3.1 Offshore Fares Workflow Simulator

Status: delivered locally on 2026-10-16 as the Phase 5 **Business Automation Showcase** at `/lab/automation` (branch `feature/phase5-automation-showcase`, not committed or deployed). See `docs/PORTFOLIO_PHASE5_REPORT.md` and `docs/BUSINESS_AUTOMATION_SHOWCASE_ARCHITECTURE.md`. The text below is the original plan; the delivered version uses the real Offshore Fares status machine and adds revision requests, an Engineering view and a trace.

First release should be deterministic and clearly labeled `Simulation`.

Flow:

1. Visitor enters a fictitious travel request.
2. Client-side validation rejects missing or unsupported values.
3. A deterministic fixture classifies intent and extracts structured travel data.
4. The UI presents orchestration, business-rule, SLA, and approval stages.
5. The visitor approves or rejects a mock quote.
6. The demo displays the final simulated output and an audit timeline.

Safety boundaries:

- No live GDS, email, WhatsApp, client system, or commercial action.
- No real personal data.
- Fixed synthetic scenarios and transparent mock labels.
- No secret or paid provider required for the first release.

### 3.2 Public RAG Playground

Use a small curated corpus built from public portfolio documentation.

Required behavior:

- Show retrieved passages before or beside the answer.
- Include resolvable source links.
- Expose a simplified retrieval-stage timeline.
- Refuse unsupported or out-of-scope questions.
- Show loading, unavailable, rate-limit, and empty-evidence states.

Preferred implementation:

- Extend the existing read-only portfolio assistant API instead of deploying a second backend.
- Add a dedicated endpoint only if retrieval evidence must be returned in a richer debug format.
- Retain current origin checks, rate limits, input bounds, secret isolation, and cost controls.
- Keep the current assistant available as the lightweight default experience.

Detailed design boundary:

#### Interface

- A dedicated route separate from the lightweight assistant.
- Question input with examples, character limit, submit/cancel controls, and no automatic paid request.
- Answer panel beside or below retrieved evidence depending on viewport width.
- Retrieval timeline showing validation, retrieval, filtering, ranking, and answer generation without exposing private prompts or secrets.
- Source cards with title, section, excerpt, and resolvable public link.

#### Dataset

- Use only public portfolio documentation generated from `src/data/projects.ts`, `src/data/lab.ts`, and approved experience data.
- Add a small versioned synthetic fixture for hostile, incomplete, out-of-scope, and no-answer scenarios.
- Never index contact-form submissions, visitor conversations, private client records, or repository secrets.

#### Retrieval Pipeline

1. Normalize and validate a bounded query.
2. Apply origin, rate, and abuse controls.
3. Retrieve candidate chunks from the curated public corpus.
4. Apply route/source allowlists and relevance thresholds.
5. Return ranked evidence with stable identifiers.
6. Generate only from accepted evidence or return a controlled refusal.
7. Stream the answer and sources using the existing API conventions where practical.

#### Error Handling

- Separate invalid input, empty evidence, timeout, provider unavailable, rate limit, and server error states.
- Preserve the visitor's question for manual retry.
- Provide a deterministic evidence-only fallback when generation is unavailable, if retrieval succeeded.

#### Security

- Keep provider keys server-side and prohibit client-supplied provider credentials.
- Retain strict origin checks, request-size bounds, safe URL allowlists, output sanitization, and rate limiting.
- Reject prompt-injection requests that attempt to override the public-corpus boundary.
- Log coarse operational metadata without storing full visitor questions by default.

#### Usage Limits And Cost

- Start with per-IP/session rate limits and a hard server-side output-token ceiling.
- Disable the playground cleanly when the monthly budget is reached.
- Display when responses are unavailable because the provider or budget is disabled.
- Do not connect or deploy a paid provider until the owner explicitly approves a budget and credentials strategy.

#### Tests

- Unit tests for validation, route allowlists, source serialization, refusal, and cost/rate guards.
- Retrieval evaluations for expected source hit, no-answer accuracy, and bilingual queries.
- API tests for streaming, cancellation, timeouts, and unavailable-provider behavior.
- UI tests for keyboard use, mobile layout, loading, sources, retry, and error states.
- A deterministic default suite that requires no network or paid API.

## Phase 4 — Live AI Operations Monitor

Status: implemented locally on 2026-10-16; Phase 4.1 UI validation and hardening completed locally, feature flag disabled, and staging/production activation pending explicit approval.

Delivered architecture:

```text
Assistant / Playground -> bounded private technical event
                       -> in-process 24-hour aggregation
                       -> rate-limited public summary
                       -> lazy-loaded bilingual dashboard
```

Delivered public metrics:

- Accepted operation, processing-success, failure, and controlled-refusal counts.
- Separate assistant, Playground, test, and demonstration distribution.
- Total P50/P95, retrieval P95, and generation P95 latency.
- Bounded error-category distribution.
- Token totals only when reliable provider usage is actually available.
- Explicit disabled, no-data, stale, and available states.

Privacy and integrity rules:

- No public IP address, precise location, email, name, prompt content, or unique visitor trail.
- Store only the minimum data required for service monitoring.
- Use retention limits and documented aggregation windows.
- Never show seeded or simulated numbers as live.
- Label delayed, unavailable, and simulated data explicitly.
- Prefer existing PostgreSQL/Render/n8n infrastructure over a new analytics vendor.

Current implementation deliberately uses a bounded process-local collector because the API is single-instance and PostgreSQL is not part of this service. It stores no prompt, response, IP, session, JWT, request ID, exception detail, or visitor identity. Metrics reset on restart and are not uptime or billing data.

Before activation:

1. Complete the isolated staging checklist in `docs/AI_OPERATIONS_MONITOR_ARCHITECTURE.md`.
2. Inspect the public summary for forbidden or high-cardinality fields.
3. Validate monitor failure cannot break chatbot or Playground responses.
4. Approve the process-local retention limitation.
5. Explicitly authorize `OPERATIONS_MONITOR_ENABLED=true`; do not change other production flags.

Phase 4.1 validation notes:

- The dashboard uses an Operations-specific wide container on desktop while preserving compact tablet/mobile gutters.
- `available`, `no_data`, `stale`, `disabled`, and request `error` states have distinct copy and visual treatment.
- Synthetic collector tests cover all four public source dimensions (`assistant`, `playground`, `test`, `demo`), retention expiry, bounded storage, privacy serialization, rate limiting, and failure isolation.
- Full staging and production checklists, rollback, screenshots, and residual risks are recorded in `docs/PORTFOLIO_PHASE4_1_REPORT.md`.

## Phase 5 — Business Automation Showcase

Status: implemented and validated locally on 2026-10-16; pending user-approved commit, deploy preview and deployment.

Delivered:

- Lazy `/lab/automation` page with two preset scenarios and a validated custom request.
- Pure TypeScript engine reusing the Offshore Fares transition table and priority rules, tested independently of React.
- Human approval gate with approve, reject and revision paths that change the real run state.
- Business and Engineering views, synthetic payloads, execution trace, and an Insights section citing the reference repository.
- Links from the AI Engineering Lab and the Offshore Fares case study. No backend, assistant, Qdrant or monitor change.

Next candidates (not started):

1. Isolated n8n-backed demo (see the V2 plan in the Phase 5 report). Requires explicit approval and isolated infrastructure.
2. Split EN/FR copy of the showcase into separate dynamic imports to cut the 81 kB chunk.
3. Refresh the assistant knowledge with this page in a separate, deliberate ingestion step.
4. Add an automated check that the mirrored transition table matches the reference repository.

## Cross-Cutting Hardening Work (formerly labelled Phase 5)

This list kept its original numbering note: the name "Phase 5" now refers to the Business Automation Showcase above.

1. Pre-render public routes and validate canonical/OG metadata.
2. Split the main JavaScript bundle by route and heavy feature.
3. Generate responsive WebP/AVIF variants for the largest PNG captures.
4. Add automated keyboard and accessibility checks for navigation, filters, forms, case studies, and assistant dialogs.
5. Add a link checker for CV, GitHub, demos, certificates, and case-study media.
6. Run Lighthouse on mobile and desktop after pre-rendering and code splitting; treat 90+ as a target, not a claim.
7. Validate the Netlify form in a deploy preview after every form or CSP change.
8. Keep the sitemap generated from the structured project source to prevent route drift.

## Information Still To Validate

- A publishable source for the claim that more than five assistants/chatbots were deployed.
- Whether the AI BOS and SIHIA demo URLs should remain publicly promoted long term.
- Which professional architecture details and client references are approved for public diagrams.
- Whether a public lab should use separate localized URLs or continue using the current client preference.
- Whether real demo execution telemetry provides enough value to justify Phase 4.

## Recommended Next Session

Implement Phase 2.1 as a narrow delivery:

1. Add challenges, evaluation, and limitations to the project model.
2. Complete those fields for the three strongest public case studies.
3. Add project JSON-LD and static pre-rendering for all case-study routes.
4. Add route metadata and link tests.
5. Measure the resulting bundle and Lighthouse output before starting the Lab.

