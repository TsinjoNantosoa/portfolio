# Portfolio V2 - Phase 9 Report

Date: 2026-10-30  
Branch: `feature/phase9-retail-ai-case-study`  
Scope: local frontend and documentation integration only. No workflow execution, backend change, push, merge, or deployment.

## A. Technical analysis

### Source and evidence level

The private `retail-ai-orchestrator.zip` archive was extracted to a temporary directory for read-only inspection. No source workflow was modified and no raw export was copied into the portfolio.

Evidence reviewed:

- 16 n8n workflow JSON exports.
- 9 supplied execution screenshots.
- Node parameters, workflow triggers, connections, credential references, deterministic Code nodes, SQL operations, LLM prompts, and post-generation validation logic.
- Demonstration fixture P001 and the synthetic RAG corpus embedded in the exports.

The archive contains no automated test suite. Screenshots show selected successful demonstration outputs, but they do not prove every branch, retry, concurrency case, provider failure, or malformed-input path.

### Verified inventory

- 15 active workflows.
- 1 inactive, manually triggered demonstration-corpus ingestion workflow.
- 2 actual LLM agents: Supervisor Agent and Quality Investigation Agent.
- Deterministic tools for product data, KPI calculation, case history, RAG retrieval, action preparation, approval, incident creation, notification, audit, and case memory.
- One health-check workflow.

The 16 workflows are not described as 16 autonomous agents.

### Architecture and integrations

- n8n: orchestration, tool routing, callbacks, controlled actions, and health checks.
- OpenAI: `gpt-4o-mini` for the two demonstration agents; speech-to-text, text-to-speech, and embeddings endpoints are also represented in the exports.
- Qdrant: vector retrieval over synthetic demonstration procedures.
- Neon PostgreSQL: conversation memory, workflow state, pending actions, approvals, case history, and audit records.
- Google Sheets: synthetic product source and an audit-log demonstration.
- Telegram: authorized text, voice, and approval callback interface.
- Gmail: configured quality-alert notification delivery.
- MCP: not used by the current implementation; documented only as a possible future improvement.

### Deterministic KPI evidence

P001 synthetic fixture:

- 420 units sold and 61 returns.
- 14.52% return rate.
- 6.20% category benchmark.
- +8.32 percentage-point delta.
- 26 expected returns and 35 excess returns.
- 90/100 risk score.
- Dominant reason: `Taille trop petite`, 28 returns / 45.9%.

Verified quality alert condition: sold units at least 100, return rate at least 10%, and category delta at least 3 points. The risk score is rule-based and capped at 100. These values are synthetic and are not production performance results.

### Agent controls

The Quality Investigation Agent must separate observed facts from hypotheses, include confidence and supporting sources, and propose conditional checks and actions. Deterministic post-processing validates JSON structure, allowed owners and confidence values, source references, causal wording, and minimum content. It forces human approval and records that no action was executed by the agent.

The approval workflow has distinct APPROVE and REJECT paths. The exports include authorization and pending-action claim controls. Their presence is documented without claiming perfect idempotence because no reproducible concurrency test suite was supplied.

## B. Case study created

Route: `/work/retail-ai-multi-agent`

Implemented content:

- Functional POC and synthetic-data disclosure.
- Business problem and governed solution overview.
- Responsive system architecture diagram.
- Two-agent orchestration and deterministic-tool boundary.
- P001 KPI evidence and verified rules.
- Retail knowledge RAG pipeline and three synthetic source titles.
- Quality investigation output contract and post-generation validation.
- Human APPROVE / REJECT paths.
- Telegram text and voice flow.
- Ten documented demonstration scenarios.
- Sixteen-workflow inventory grouped by responsibility.
- Engineering decisions, validation evidence, limitations, future improvements, and technology stack.

The generic project content uses the existing portfolio translation dictionary. Retail-specific evidence uses typed English/French values in the same project record. The language switch was tested in both directions.

### Visual policy

No raw screenshot was published. The supplied screenshots contain a personal email address, incident/case IDs, timestamps, account information, and approval identifiers. A sanitized, code-authored architecture asset replaces them:

`/portfolio-uploads/retail-ai-quality-architecture.svg`

## C. Files changed

- `src/data/projects.ts`: one canonical project record and verified Phase 9 evidence.
- `src/types/portfolio.ts`: typed localized retail evidence structures.
- `src/components/project/RetailCaseStudyEvidence.tsx`: responsive architecture, KPI, RAG, agents, HITL, voice, scenarios, inventory, and roadmap sections.
- `src/pages/CaseStudyPage.tsx`: optional rendering and section navigation for retail evidence.
- `src/i18n/portfolioContent.ts`: complete French copy for generic case-study fields.
- `src/data/lab.ts`: internal references from RAG, Agentic AI, and AI Automation capabilities.
- `public/portfolio-uploads/retail-ai-quality-architecture.svg`: sanitized lead visual.
- `public/llms.txt`: selected-project and engineering-evidence entries.
- `src/pages/RetailCaseStudyPage.test.tsx`: data, route, evidence, no-live-demo, and bilingual rendering tests.
- `src/components/Sections/Projects.test.tsx`: catalog-count assertion now derives from project data.
- `docs/PORTFOLIO_PHASE9_REPORT.md`: this report.

## D. SEO and discoverability

- Canonical route generated as `https://tsinjona.netlify.app/work/retail-ai-multi-agent`.
- Unique generated title: `Retail AI Multi-Agent Quality Assistant - Case Study`.
- 156-character English meta description derived from the verified summary.
- Open Graph image and alt text use the sanitized architecture asset.
- Existing JSON-LD generator adds BreadcrumbList and WebPage/CreativeWork records.
- Existing sitemap generator includes the route automatically from `featuredProjects`.
- Internal links are available from Projects and three AI Engineering Lab capabilities.
- `public/llms.txt` contains one project entry and one evidence entry.

## E. Security review

Confirmed:

- No raw n8n JSON, archive, database URL, bearer token, API credential, Telegram approval identifier, incident ID, or private webhook is included in `public` or `dist`.
- The public professional email already present across the portfolio remains unchanged; private screenshot content was not copied.
- No affiliation with OKAIDI or another retail client is claimed.
- No production deployment, business impact, coverage percentage, or unverified reliability result is claimed.
- Credential references observed in n8n remain in the private source archive.

The final `dist` scan found no archive name, raw workflow marker, incident prefix, database connection string, or bearer-token pattern. Generic text discussing API keys remains in existing portfolio documentation and is not a credential.

## F. Validation results

Executed locally:

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed with 0 errors and 6 pre-existing Fast Refresh warnings in shared UI files.
- `npx vitest run src/pages/RetailCaseStudyPage.test.tsx`: 2/2 passed.
- `npm run test:run`: 255 passed, 4 skipped; 32 files passed, 1 skipped.
- `npm run check:offshore`: 4/4 passed.
- `npm run build`: passed; 1,905 modules transformed.
- `npm run verify:seo`: passed; 12 routes and 22 rewrites, including the new route.
- `npm run verify:llms`: passed; UTF-8, structure, links, build copy, routes, placeholders, and secret patterns validated.
- `git diff --check`: passed; only repository line-ending notices were emitted.

Known unrelated warnings:

- React test output still reports the existing `fetchPriority` DOM-property warning in `ProfileImage`.
- Six existing Fast Refresh warnings remain in shared UI component files.

### Responsive inspection

The production preview was inspected with headless Chrome at 1440x1000 and a compact 500x900 viewport. The title, status, architecture visual, navigation, and content remain readable without overlap. The component grid itself defines one-column layouts below `sm` and expands progressively for tablet and desktop.

## G. Remaining limitations

- No retail workflow was executed during this portfolio integration.
- No paid OpenAI call or external-service test was made.
- No automated tests, load tests, RAG benchmark, or concurrency harness were supplied by the source project.
- Screenshots are demonstration evidence only and are intentionally not published.
- External provider availability and credential configuration were not validated.
- The project has no public live demo or public source repository.
- A production claim would require authorized real-system integration, security review, observability, recovery tests, and reproducible acceptance evidence.

## H. Preview and deployment

Local preview:

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4174
```

Open `http://127.0.0.1:4174/work/retail-ai-multi-agent` and verify English/French, light/dark themes, project filters, mobile navigation, and the absence of a Live Demo button.

For Netlify, create a branch preview from `feature/phase9-retail-ai-case-study`, then verify the route, canonical tag, Open Graph image, sitemap entry, `/llms.txt`, and the existing chatbot before approving any merge or production deployment. This phase has not been pushed or deployed.
