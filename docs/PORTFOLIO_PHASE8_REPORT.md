# Portfolio Phase 8 — LLM-Ready Portfolio and `llms.txt`

Date: 2026-10-30  
Branch: `feature/phase8-llms-txt`  
Status: implemented and validated locally; not committed, pushed, merged, or deployed

## Scope and source of truth

The implementation was built from the current typed portfolio sources:

- `src/data/projects.ts` for project names, maturity, stack, evidence, and limitations.
- `src/data/experience.ts` for professional experience, skills, education, languages, and public contact details.
- `src/data/lab.ts` for the five AI Engineering Lab capabilities.
- `src/seo/routes.ts` and the generated sitemap for public routes.
- `index.html`, `netlify.toml`, and the Vite prerender plugin for delivery behavior.

The file follows the `/llms.txt` v2 ordering documented at <https://llmstxt.org/>: one H1, a summary blockquote, context without additional headings, H2 file-list sections, absolute links, and an `Optional` section.

No French duplicate or `llms-full.txt` was created. The main English file states the documented language capabilities and links to the bilingual portfolio. This avoids a non-standard duplicate until a real need for a separate French resource is demonstrated.

## Files created and modified

| File | Purpose |
| --- | --- |
| `public/llms.txt` | Source document copied unchanged by Vite to `dist/llms.txt`. |
| `scripts/verify-llms-txt.mjs` | Validates UTF-8, v2 structure, links, internal routes, build output, discoverability, placeholders, secret patterns, and Netlify MIME configuration. |
| `package.json` | Adds `npm run verify:llms`. |
| `index.html` | Advertises `/llms.txt` with `rel="describedby"` on every prerendered page. |
| `netlify.toml` | Declares `text/plain; charset=utf-8` and a one-hour public cache for `/llms.txt`. |
| `docs/PORTFOLIO_PHASE8_REPORT.md` | Records implementation, evidence, validation, limitations, and deployment steps. |

No chatbot, FastAPI, SSE, Qdrant, authentication, rate-limit, route, project, or animation implementation was changed. No dependency was added.

## Final `llms.txt`

```markdown
# Sandaniaina Tsinjo Nantosoa — AI Engineering Portfolio

> Professional portfolio of Sandaniaina Tsinjo Nantosoa, an AI Engineer focused on production RAG systems, governed AI agents, business automation, and reliable full-stack delivery.

This English index maps agents to public, evidence-backed portfolio resources. The portfolio documents professional work, project architecture, engineering decisions, tests, limitations, and public demonstrations. It supports English and French; the published profile lists Malagasy as native and French and English as professional working languages.

Interpret maturity labels literally: the multi-tenant RAG platform is production work with a separate pilot agent extension; SIHIA and AI BOS are deployed demos; Offshore Fares, Arcwell, AI Sales Assistant, and the secondary projects are prototypes or reference implementations. Interactive Lab pages are demonstrations and engineering evidence, not live client systems.

## Professional Profile

- [Portfolio overview](https://tsinjona.netlify.app/): Professional introduction, selected work, expertise, education, credentials, and public contact details.
- [Professional experience](https://tsinjona.netlify.app/#experience): AI engineering at Humans4Help Madagascar, project-based AI automation consulting, and Odoo 18 CRM and business automation work.
- [Skills and education](https://tsinjona.netlify.app/#skills): Verified AI engineering, backend, frontend, data, automation, infrastructure, language, and academic background.
- [Public CV](https://tsinjona.netlify.app/CV/CV_AIEngineer_AgentProduct_Sandaniaina_Tsinjo.pdf): Downloadable professional résumé published by the portfolio owner.

## AI Engineering Expertise

- [AI Engineering Lab](https://tsinjona.netlify.app/lab): Evidence-backed methods for RAG engineering, governed agentic AI, n8n automation, production engineering, and AI-assisted development.
- [Public RAG Playground](https://tsinjona.netlify.app/lab/playground): Public demonstration of observable retrieval, evidence-linked generation, citations, and controlled refusal behavior.
- [AI Operations Monitor](https://tsinjona.netlify.app/lab/operations): Privacy-preserving operational signals for the portfolio assistant and RAG Playground, with explicit disabled, no-data, stale, error, and available states.
- [Business Automation Showcase](https://tsinjona.netlify.app/lab/automation): Deterministic Offshore Fares workflow simulation with business rules, execution traces, and human approval; it performs no live commercial action.

## Professional Experience

- [AI Engineer — Humans4Help Madagascar](https://tsinjona.netlify.app/#experience): 2025 to September 2026 work on a multi-tenant RAG platform, hybrid retrieval, custom assistants, controlled tool calling, CRM integrations, testing, and deployment.
- [AI Automation Consultant](https://tsinjona.netlify.app/#experience): Project-based work connecting APIs, CRM tools, n8n workflows, FastAPI services, retries, idempotency, and human approval.
- [CRM and Business Automation — ETS Baron](https://tsinjona.netlify.app/#experience): Odoo 18 customization for CRM, quotes, orders, planning, delivery, invoicing, and Docker-based delivery.

## Selected Engineering Projects

- [Enterprise RAG and AI Commercial Agent Platform](https://tsinjona.netlify.app/work/multi-tenant-rag): Production multi-tenant RAG platform with tenant-isolated knowledge, hybrid retrieval, citations, FastAPI, Qdrant, PostgreSQL, Redis, React, and a separately evaluated tool-calling agent pilot.
- [Offshore Fares](https://tsinjona.netlify.app/work/offshore-fares): Advanced prototype using 18 modular n8n workflows to turn email and WhatsApp travel requests into governed RFQs, human-approved quotes, booking handoffs, and auditable after-sales workflows.
- [Arcwell — Governed Agentic CRM](https://tsinjona.netlify.app/work/arcwell-agentic-crm): Production-oriented reference implementation using LangGraph, typed proposals, deterministic policy checks, tenant-scoped context, atomic human approval, audit trails, FastAPI, PostgreSQL, Qdrant, Redis, and Celery.
- [AI Business Operating System](https://tsinjona.netlify.app/work/ai-business-os): Deployed demo of a multi-tenant business platform connecting CRM, finance, projects, support, knowledge, analytics, governed AI tools, hybrid RAG, PostgreSQL row-level security, and human approval.
- [SIHIA — AI-Powered HealthTech Platform](https://tsinjona.netlify.app/work/sihia): Deployed healthcare demo combining hospital operations, predictive planning, and citation-first hybrid RAG with Qdrant, BM25, RRF, FastEmbed, FastAPI, React, PostgreSQL, JWT, and role-based access control.
- [AI Sales Assistant](https://tsinjona.netlify.app/work/ai-sales-assistant): Prototype for lead qualification and follow-up automation using LangGraph orchestration, deterministic scoring, FastAPI, PostgreSQL, n8n, React, and human control for sensitive decisions.

## Engineering Evidence

- [RAG architecture and evaluation evidence](https://tsinjona.netlify.app/work/sihia): Documents dense and lexical retrieval, RRF fusion, reranking, citations, explicit no-answer behavior, a deterministic bilingual benchmark, and current limitations.
- [Agent governance and test evidence](https://tsinjona.netlify.app/work/arcwell-agentic-crm): Documents typed action proposals, deterministic authorization, stale-data protection, auditability, repository test results, measured coverage, and unresolved typing and infrastructure limitations.
- [Multi-tenant security evidence](https://tsinjona.netlify.app/work/ai-business-os): Documents forced PostgreSQL row-level security, tool authorization, human approval, audit results, passing and failing test scenarios, and deployment limitations.
- [Automation architecture evidence](https://tsinjona.netlify.app/work/offshore-fares): Documents schema-constrained AI extraction, deterministic state transitions, idempotency, approval gates, audit trails, error handling, and mocked fare boundaries.

## Public Contact

- [Contact form](https://tsinjona.netlify.app/#contact): Public portfolio form for professional project and collaboration enquiries.
- [Email](mailto:tsinjonantosoa@gmail.com): Public professional email address.
- [GitHub](https://github.com/TsinjoNantosoa): Public source repositories and engineering work.
- [LinkedIn](https://www.linkedin.com/in/sandaniaina-tsinjo-nantosoa-b6209a330/): Public professional profile.

## Optional

- [World Bank AI Chatbot](https://github.com/TsinjoNantosoa/worldbank-ai-chatbot): RAG prototype using Python, FAISS, and FastAPI over public World Bank data.
- [IoT Kafka Spark Pipeline](https://github.com/TsinjoNantosoa/iot-kafka-spark-redshift-pipeline): Data engineering prototype using Kafka, Spark, AWS, and Python.
- [Weather ETL with Airflow](https://github.com/TsinjoNantosoa/weather_etl): Data pipeline prototype for weather extraction and transformation using Airflow and Python.
- [Bank Loan Analytics Dashboard](https://github.com/TsinjoNantosoa/bank-loan-analytics-dashboard): Analytics prototype using Power BI and SQL.
```

## Resource inventory

The document contains 29 resources in seven H2 sections:

- Four profile resources, including the public CV.
- Four AI Engineering Lab resources.
- Three documented professional experience entries.
- Six selected case studies, with explicit maturity context.
- Four evidence-oriented case-study entry points.
- Four public contact resources.
- Four optional public repositories.

Internal page URLs are validated against the generated sitemap. The CV is validated as a built public asset. External URLs are syntax-checked by the local validator and were probed separately where automated access was possible.

## Integration and delivery

Vite copies `public/llms.txt` to `dist/llms.txt` unchanged. The file does not enter React routing and is not affected by the generated Netlify route rewrites. Every prerendered HTML page contains:

```html
<link rel="describedby" href="/llms.txt" type="text/plain" />
```

Netlify is configured to serve the stable path with:

```text
Content-Type: text/plain; charset=utf-8
Cache-Control: public, max-age=3600
```

The file was deliberately not added to `sitemap.xml`; the sitemap remains the index of human-readable pages, while `llms.txt` is a curated agent entry point.

## Validation results

| Check | Result |
| --- | --- |
| Production build | Passed; 1,904 modules transformed. |
| Main JS bundle | 293.32 kB raw / 96.14 kB gzip; no material Phase 8 JS added. |
| TypeScript | Passed with `npx tsc -b --pretty false`. |
| ESLint | Passed with 0 errors and 6 pre-existing Fast Refresh warnings. |
| Vitest | 257/257 passed across 32 files when split into three bounded groups. |
| Offshore reference sync | 4/4 passed. |
| SEO build validation | Passed for 11 routes and 20 Netlify rewrites. |
| `llms.txt` validator | Passed: UTF-8, v2 structure, 29 absolute links, internal routes, build copy, discoverability, placeholders, and secret patterns. |
| Local HTTP | `/llms.txt` returned 200 as `text/plain`, started with the expected H1, and contained no HTML fallback. |
| Public resource probes | 19 portfolio/GitHub resources returned 200. LinkedIn returned its automated-access code 999. |
| Production `/llms.txt` | 404 before deployment, as expected. |

The single `npm run test:run` process exceeded the local 180-second command limit under Node 24.13.0. Running all files in three non-overlapping groups completed successfully: assistant 90 tests, application 163 tests, and Offshore sync 4 tests. Netlify remains configured for Node 20.

The Vite preview server supplied `text/plain` without an explicit charset. The Netlify-specific UTF-8 MIME rule is present and validated statically, but its final response header cannot be claimed until a deploy preview or production deployment is inspected.

## Agent comprehension checklist

No independent agent-evaluation harness was available, so no synthetic LLM score is claimed. A reproducible document-only review should confirm that an agent starting from `/llms.txt` can:

- Identify Sandaniaina Tsinjo Nantosoa as the portfolio owner and AI Engineer.
- Summarize RAG, governed agents, automation, backend, frontend, and production engineering specializations.
- Find the production multi-tenant RAG platform, SIHIA, and the Public RAG Playground.
- Find n8n evidence in Offshore Fares, the Automation Showcase, consulting experience, and AI Sales Assistant.
- Reach all six public technical case studies.
- Locate the contact form, public email, GitHub, LinkedIn, and CV.
- Distinguish production work, pilot work, deployed demos, prototypes, and simulations.
- Follow evidence links for architecture, security, tests, evaluations, and limitations.

## Limitations and non-verified points

- The production site still returns 404 for `/llms.txt`; no deployment was authorized or performed.
- Netlify's final `text/plain; charset=utf-8` response must be confirmed after deployment.
- LinkedIn returned HTTP 999 to the automated probe; the URL is sourced from the portfolio but was not machine-verified as 200.
- Linked pages are prerendered HTML or PDF rather than dedicated Markdown mirrors. The v2 proposal recommends Markdown detail pages, but creating many duplicate documents was outside this phase.
- No independent LLM comprehension benchmark was run; the checklist above is intentionally reproducible and does not claim an agent score.
- Project evidence remains bounded by the dates and limitations stated in each case study; historical test counts are not presented as current production telemetry.

## Deployment and post-deployment verification

No deployment action has been performed. After explicit approval:

1. Review and commit the Phase 8 files on `feature/phase8-llms-txt`.
2. Merge the approved branch into the deployment branch and push without force.
3. Wait for the Netlify build to finish successfully.
4. Request `https://tsinjona.netlify.app/llms.txt` without authentication and confirm HTTP 200.
5. Confirm `Content-Type: text/plain; charset=utf-8`, a Markdown H1 at the start, and no HTML application shell.
6. Confirm a rendered page advertises `/llms.txt` with `rel="describedby"`.
7. Run `npm run build && npm run verify:llms && npm run verify:seo` against the deployed commit.
8. Re-run the public URL probes and record any external-link restrictions separately from genuine 404/5xx failures.
