import type { FeaturedProject, SecondaryProject } from "@/types/portfolio";

export const featuredProjects: FeaturedProject[] = [
  {
    id: "multi-tenant-rag",
    slug: "multi-tenant-rag",
    number: "01",
    title: "Enterprise RAG & AI Commercial Agent Platform",
    label: "Featured Professional Project · Production + Pilot",
    categories: ["RAG & GenAI", "AI Agents", "Full-Stack"],
    maturity: "Production",
    plainSummary:
      "A multi-tenant conversational AI platform combining grounded knowledge assistants with a controlled commercial agent that can select and use approved business tools.",
    technicalSummary:
      "Python · FastAPI · LangChain · RAG · AI Agents · Tool Calling · Qdrant · PostgreSQL · Redis · React · TypeScript · Docker",
    description:
      "Design, development, and production delivery of a multi-tenant conversational AI platform combining Retrieval-Augmented Generation, LLM integration, custom assistants, and a pilot commercial agent with controlled business-tool orchestration.",
    problem:
      "Organizations needed reliable assistants grounded in their own content, with isolated data and configuration. The platform also needed to move beyond question answering and support commercial workflows without giving the LLM unrestricted control over business actions.",
    solution:
      "Built an end-to-end platform spanning content ingestion, hybrid retrieval, tenant-aware APIs, conversational interfaces, LLM providers, and deployment. Added a separate agentic extension in which the model can select approved tools while server-side code validates parameters, consent, iteration limits, and execution outcomes.",
    highlights: [
      "Reusable RAG platform deployed for multiple organizations with isolated knowledge and configuration",
      "Hybrid semantic and BM25 retrieval with source-grounded answers",
      "Pilot commercial agent using controlled LLM Tool Calling and business integrations",
    ],
    proof: [
      { value: "Production", label: "Multi-tenant RAG", hint: "Deployed for multiple organizations" },
      { value: "Pilot", label: "Commercial agent", hint: "Tool Calling extension evaluated in a controlled environment" },
      { value: "Isolated", label: "Tenant knowledge", hint: "Organization-scoped data and configuration" },
    ],
    stack: ["Python", "FastAPI", "LangChain", "RAG", "AI Agents", "Tool Calling", "Qdrant", "PostgreSQL", "Redis", "React", "TypeScript", "Docker"],
    imageUrl: "/portfolio-uploads/enterprise-rag-satisco-assistant.png",
    imageAlt: "Satisco Assistant embedded in an enterprise data integration and governance website",
    caseStudyLink: "/work/multi-tenant-rag",
    featuredLayout: "flagship",
    status: "Production RAG platform · Agent extension evaluated as a pilot",
    showArchitectureDiagram: true,
    overview:
      "Built at Humans4Help Madagascar as a professional platform for several organizations. It combines a production RAG foundation with a distinct commercial-agent extension, keeping deterministic retrieval and action-oriented agent behavior clearly separated.",
    architecture: [
      "React and TypeScript widget embedded in client websites, including WordPress integrations",
      "FastAPI services for tenant configuration, sessions, retrieval, responses, and server-side controls",
      "RAG path: ingestion, extraction, chunking, embeddings, Qdrant vector search, BM25, and source-grounded context",
      "Agent path: LangChain bind_tools(), tool_calls, ToolMessage results, controlled execution loops, and conversational state",
      "Configurable OpenAI and Azure OpenAI providers integrated through the backend",
      "PostgreSQL for application data, Redis for transient state, and Docker-based delivery",
    ],
    howItWorks: [
      "Content from approved websites and documents is extracted, segmented, embedded, and indexed for the correct organization.",
      "A visitor asks a question through the branded React widget; FastAPI resolves the tenant and conversation context.",
      "The RAG path retrieves tenant-scoped semantic and lexical evidence, then supplies grounded context and sources to the LLM.",
      "For eligible commercial requests, the separate agent path lets the LLM select from a restricted set of business tools.",
      "The server validates tool parameters, consent, access rules, and iteration limits before executing any action.",
      "Tool results return to the agent as structured messages, which are used to prepare the final response or a human handoff.",
    ],
    decisions: [
      "Kept deterministic RAG retrieval separate from the agentic execution loop",
      "Scoped knowledge, prompts, branding, and configuration to each organization",
      "Allowed the agent to choose only registered tools; authorization and execution remain server-controlled",
      "Required explicit consent before contact collection or other sensitive commercial actions",
    ],
    integrations: [
      "Organization website and commercial-offer search",
      "Visitor-needs qualification and contact-request preparation",
      "Human handoff",
      "HubSpot",
      "Microsoft Teams",
      "SMTP messaging",
    ],
    security: [
      "Tenant isolation for knowledge, sessions, and configuration",
      "Server-side input and tool-parameter validation",
      "Explicit consent gates and access controls before sensitive actions",
      "Iteration limits, error handling, logging, and application guardrails around LLM behavior",
      "Automated tests and CI/CD checks for platform reliability",
      "Docker-based deployment and platform maintenance through Plesk",
    ],
    outcomes: [
      "A reusable RAG platform deployed for multiple organizations",
      "Customizable assistants with organization-specific knowledge and visual identity",
      "One integrated system spanning backend, retrieval, conversational frontend, LLMs, data stores, and deployment",
      "A controlled evolution from a deterministic RAG chatbot to a commercial Tool Calling agent",
      "An agentic extension developed and evaluated in a pilot environment",
    ],
    learnings: [
      "Designing tenant-aware AI systems from ingestion through retrieval and response generation",
      "Separating probabilistic reasoning from deterministic authorization and business execution",
      "Building reliable agent loops with validation, consent, failure handling, and observability",
      "Delivering maintainable full-stack AI features across backend, frontend, data, testing, and deployment",
    ],
  },
  {
    id: "offshore-fares",
    slug: "offshore-fares",
    number: "02",
    title: "Offshore Fares",
    subtitle: "AI Travel Operations Orchestrator",
    label: "AI Automation · Travel Operations",
    categories: ["AI Agents", "Automation / n8n", "Full-Stack"],
    maturity: "Prototype",
    plainSummary:
      "AI-powered travel operations platform that transforms email and WhatsApp fare requests into structured RFQs and orchestrates Fare Desk operations, human-approved quotes, booking handoff, and after-sales workflows.",
    technicalSummary:
      "n8n · OpenAI · PostgreSQL · Node.js · Gmail API · Docker",
    description:
      "A production-oriented travel operations orchestrator for premium airfare requests, coordinating the workflow from inbound message to RFQ, Fare Desk, controlled quote delivery, booking handoff, and after-sales.",
    problem:
      "Premium travel agents receive urgent fare requests through fragmented email and WhatsApp conversations. Requests may be incomplete, spread across several messages, and followed by multiple operational handoffs, quote revisions, booking decisions, changes, or refunds.",
    solution:
      "Built a modular orchestration platform that classifies inbound intent, extracts structured travel requirements, merges conversations into RFQs, applies priority and SLA rules, routes work to the Fare Desk, prepares guarded quotes, and coordinates human approval, client delivery, booking handoff, and after-sales routing.",
    highlights: [
      "18 modular n8n workflows across the end-to-end RFQ lifecycle",
      "Gmail thread-aware intake and delivery with a multi-channel WhatsApp architecture",
      "Human-approved quotes with deterministic safeguards around every fare price",
    ],
    proof: [
      { value: "18", label: "n8n workflows", hint: "Modular event-driven orchestration" },
      { value: "Gmail", label: "Thread-aware", hint: "Inbound and outbound OAuth2 integration" },
      { value: "Human", label: "Approved quotes", hint: "Sensitive delivery stays controlled" },
    ],
    stack: [
      "n8n",
      "OpenAI",
      "PostgreSQL",
      "Node.js",
      "Gmail API",
      "Docker",
      "GPT-4.1-mini",
      "Neon",
      "WhatsApp Cloud API",
      "REST APIs",
      "Render",
      "OVH VPS",
      "JavaScript",
    ],
    imageUrl: "/portfolio-uploads/offshore-fares-operations-dashboard.png",
    imageAlt: "Offshore Fares AI Travel Operations Orchestrator dashboard",
    imageFit: "contain",
    gallery: [
      {
        src: "/portfolio-uploads/offshore-fares-client-response-workflow.png",
        alt: "Offshore Fares n8n client response workflow with booking, clarification, and Fare Desk routes",
        title: "Client response orchestration workflow",
      },
      {
        src: "/portfolio-uploads/offshore-fares-live-rfq-queue.png",
        alt: "Offshore Fares live RFQ queue with priority, SLA, status, and Fare Desk assignment",
        title: "Live RFQ queue and SLA control",
      },
      {
        src: "/portfolio-uploads/offshore-fares-client-outbox.png",
        alt: "Offshore Fares outbox showing controlled quote, booking, and after-sales messages",
        title: "Auditable client communications",
      },
      {
        src: "/portfolio-uploads/offshore-fares-audit-trail.png",
        alt: "Offshore Fares activity and audit trail for AI, system, human, and client actions",
        title: "End-to-end activity and audit trail",
      },
      {
        src: "/portfolio-uploads/offshore-fares-demo-simulator.png",
        alt: "Offshore Fares demo simulator for email and WhatsApp travel request scenarios",
        title: "Email and WhatsApp QA simulator",
      },
    ],
    githubLink: "https://github.com/TsinjoNantosoa/offshore-fares-ai-automation",
    labDemoLink: "/lab/automation",
    caseStudyLink: "/work/offshore-fares",
    featuredLayout: "standard",
    status: "Advanced working prototype · Production-oriented architecture",
    overview:
      "Offshore Fares is an AI-assisted operations platform for premium airfare requests. It turns fragmented inbound conversations into a traceable RFQ lifecycle while keeping fare entry, quote approval, ticketing decisions, and sensitive after-sales actions under human control.",
    architecture: [
      "Gmail OAuth2 integration and WhatsApp Cloud API architecture normalize inbound requests into a common message model",
      "OpenAI Structured Outputs classify intent and extract travel requirements; server-side validation verifies every AI result",
      "PostgreSQL stores conversations, RFQs, state transitions, fares, approvals, audit logs, and workflow events",
      "18 event-driven n8n workflows coordinate intake, clarification, priority, SLA, Fare Desk, quotes, delivery, replies, and errors",
      "A Node.js operations console exposes the queue, approvals, desk inbox, activity trail, dead letters, and QA simulator",
      "Render hosts the operations console, Neon provides PostgreSQL, and n8n is designed for deployment on an OVH VPS",
    ],
    howItWorks: [
      "Email or WhatsApp request enters the channel-specific intake workflow",
      "AI classifies the intent and extracts structured travel requirements",
      "Deterministic validation identifies missing or unsupported information",
      "The conversation is merged into a structured RFQ",
      "Priority and SLA rules classify urgency and response targets",
      "The RFQ is routed to the appropriate Fare Desk",
      "A human operator enters or verifies the fare options",
      "AI formats the quote without controlling commercial numbers",
      "A human approves, edits, or rejects the exact quote version",
      "The approved quote returns through the original client channel",
      "The client response is matched to the selected option",
      "Booking is handed off to the Ticketing Desk",
      "Change, cancellation, and refund requests become traceable after-sales tasks",
    ],
    decisions: [
      "Use AI for classification, structured extraction, and controlled content formatting, not for commercial authority",
      "Enforce RFQ state transitions, idempotency, price preservation, and approval gates in deterministic code and PostgreSQL",
      "Separate Fare Desk entry from quote formatting so mock fares can later be replaced by a GDS or NDC provider adapter",
      "Keep booking as a human handoff rather than claiming automated ticket issuance",
    ],
    decisionHighlight: {
      title: "The AI never creates or edits a fare price",
      body: "Fare prices come from the Fare Desk and currently use mock data for demonstration scenarios. The AI may understand the request and format a response, but code verifies every commercial number, rejects altered values, and requires human approval before delivery.",
    },
    automation: {
      summary:
        "Modular event-driven orchestration across 18 n8n workflows, with each workflow owning one operational responsibility and failures routed through retry and dead-letter handling.",
      workflows: [
        "Email and WhatsApp intake",
        "Intent classification and travel extraction",
        "Missing-information handling and RFQ management",
        "Priority, SLA, and Fare Desk routing",
        "Fare intake and guarded quote formatting",
        "Human approval and client delivery",
        "Follow-up and client response handling",
        "Booking and after-sales handoff",
        "Operator actions and error handling",
      ],
    },
    hitl:
      "Human-in-the-loop by design: operators enter or verify fares, approve the exact quote version, own ticketing decisions, and handle changes, cancellations, and refunds. The platform coordinates these decisions but does not replace them.",
    security: [
      "AI outputs are schema-constrained and verified against the original message or approved fare data",
      "A quote cannot be delivered without approval, and the database independently blocks unapproved or duplicate sends",
      "Idempotent message registration and conversation locks prevent duplicate or out-of-order processing",
      "Prompt-injection screening, secret isolation, retries, dead letters, and full audit trails protect operations",
      "Demo fares are explicitly mocked; no live GDS pricing or automated ticket issuance is claimed",
    ],
    integrations: [
      "Gmail API and OAuth2 for thread-aware inbound and outbound email",
      "WhatsApp Business Cloud API architecture with webhook verification and delivery status handling",
      "OpenAI Chat Completions with Structured Outputs (configurable model, default GPT-4.1-mini)",
      "PostgreSQL 16 with Neon deployment support",
      "Render operations console connected to n8n on an OVH VPS",
      "FareProvider contract prepared for future GDS or NDC adapters",
    ],
    outcomes: [
      "A traceable workflow from unstructured inbound request to RFQ, controlled quote, booking handoff, and after-sales",
      "A validated Gmail scenario can preserve the original thread across request intake and quote delivery",
      "Fare prices remain sourced from human-entered or mock provider data rather than generated by the model",
      "The operator dashboard and QA simulator make workflow state, approvals, errors, and audit history inspectable",
    ],
    learnings: [
      "Designing AI-assisted operations around deterministic state machines and transactional boundaries",
      "Coordinating long-running, multi-channel workflows with idempotency, SLA monitoring, and human checkpoints",
      "Keeping provider integrations replaceable without coupling AI reasoning to sensitive commercial data",
    ],
  },
  {
    id: "arcwell",
    slug: "arcwell-agentic-crm",
    number: "03",
    title: "Arcwell — Governed Agentic CRM",
    subtitle:
      "A production-oriented CRM intelligence layer where AI proposes typed actions and the application retains authority over every business mutation.",
    label: "Agentic CRM · Governance · Human Approval",
    categories: ["RAG & GenAI", "AI Agents", "Full-Stack"],
    maturity: "Prototype",
    plainSummary:
      "A governed AI layer that analyzes CRM context, retrieves authorized knowledge, and proposes traceable actions without giving the model direct control over business data.",
    technicalSummary:
      "React 19 + FastAPI · LangGraph · PostgreSQL · Qdrant · Redis/Celery · Deterministic policy engine · Human-in-the-Loop",
    description:
      "Full-stack governed Agentic CRM reference implementation with tenant-scoped intelligence, typed tool proposals, deterministic authorization, atomic human approval, controlled connectors, and correlated audit trails.",
    problem:
      "CRM teams benefit from AI summaries, call analysis, internal knowledge retrieval, and next-step recommendations. The risk begins when probabilistic model output is treated as permission to change lead status, move an opportunity, or create downstream work without deterministic access checks, tenant isolation, concurrency control, and an accountable decision trail.",
    solution:
      "Arcwell treats every model-generated mutation as untrusted structured input. LangGraph assembles authorized CRM and knowledge context, the provider returns Pydantic-validated proposals, and a deterministic policy engine decides whether each proposal is denied, permitted, or held for approval. Only a trusted application service can execute an approved command through a typed CRM connector.",
    highlights: [
      "LangGraph account intelligence over tenant-scoped CRM and role-filtered knowledge",
      "Typed proposals evaluated by deterministic policy before any sensitive CRM mutation",
      "Atomic Manager/Admin approval with policy re-check and stale-value conflict protection",
      "Correlated audit, execution, AI usage, automation, and transactional outbox records",
    ],
    proof: [
      { value: "99", label: "Backend tests passed", hint: "Documented repository audit" },
      { value: "71%", label: "Measured coverage", hint: "Documented backend line coverage" },
      { value: "13", label: "Frontend tests passed", hint: "Documented Vitest validation" },
    ],
    stack: ["React 19", "TypeScript", "FastAPI", "LangGraph", "Pydantic", "SQLAlchemy", "Alembic", "PostgreSQL 16", "Qdrant", "Redis 7", "Celery", "OpenAI", "SuiteCRM", "Prometheus", "Docker Compose"],
    imageUrl: "/portfolio-uploads/arcwell-agentic-crm-login.png",
    imageAlt:
      "Arcwell Agentic CRM sign-in interface presenting governed revenue intelligence and human approval controls",
    imageFit: "contain",
    githubLink: "https://github.com/TsinjoNantosoa/arcwell-agentic-crm",
    caseStudyLink: "/work/arcwell-agentic-crm",
    featuredLayout: "standard",
    status: "Production-oriented reference implementation · Full-stack demo · Active development",
    overview:
      "Arcwell is a FastAPI modular monolith with a React client and Celery workers. Its central trust boundary is explicit: models may analyze evidence and propose typed actions, while authenticated application services retain authority over mutations. The complete Docker profile runs PostgreSQL, Redis, Qdrant, migrations, deterministic demo providers, the API, workers, and the frontend without requiring external credentials.",
    architecture: [
      "React 19 and TypeScript client with TanStack Query plus swappable HTTP and demo data providers",
      "FastAPI modular monolith with async SQLAlchemy, Pydantic contracts, Alembic migrations, and RBAC dependencies",
      "LangGraph StateGraph for account intelligence and direct governed FastAPI flows for RAG and call analysis",
      "PostgreSQL as the source of truth, Redis for rate limits and Celery, and optional filtered Qdrant retrieval",
      "Typed provider and connector boundaries for AI, embeddings, CRM, email, telephony, transcription, and vector search",
      "Transactional proposal, approval, execution, audit, and outbox lifecycle with correlated request metadata",
    ],
    howItWorks: [
      "The API authenticates the actor and reconstructs organization and role claims from a signed access token",
      "LangGraph loads organization-scoped CRM aggregates and retrieves only knowledge permitted for the actor's role",
      "The configured deterministic or OpenAI provider returns a structured analysis and typed action proposals",
      "Each proposal is schema-validated and checked against tool allowlists, role permissions, tenant ownership, and sensitivity rules",
      "Sensitive proposals are persisted for a Manager or Administrator to approve or reject outside the model",
      "Approval acquires a row lock, atomically claims execution, re-runs policy, checks for stale CRM values, and dispatches through the trusted CRM service",
      "The outcome, before/after values, actor, evidence, correlation IDs, audit event, and outbox event are committed together",
    ],
    decisionHighlight: {
      title: "AI proposes; the system authorizes",
      body:
        "Natural-language model output is never accepted as permission. Arcwell parses supported responses into finite Pydantic schemas, evaluates policy in ordinary Python code, persists the decision, and permits execution only through an authenticated application service after any required human approval.",
    },
    decisions: [
      "Keep authorization outside prompts so policy remains deterministic and independently testable",
      "Filter organization and access-level knowledge before evidence reaches the model",
      "Separate approval from execution and use row locks plus conditional state transitions to prevent duplicate concurrent writes",
      "Re-check policy and compare observed CRM values immediately before an approved mutation",
      "Use a modular monolith to preserve simple transaction boundaries across approval, mutation, audit, and outbox records",
      "Expose deterministic demo providers explicitly as simulated instead of presenting seeded integrations as live",
    ],
    security: [
      "Argon2id passwords, short-lived signed JWTs, rotated hashed refresh tokens, HttpOnly cookies, and revocation",
      "RBAC for Administrator, Manager, and Sales Representative plus organization predicates and object-level checks",
      "Tool allowlist, forbidden capabilities, typed arguments, risk classification, and tenant validation before execution",
      "Signed Twilio/Plivo and HMAC webhooks with replay protection, event idempotency, and Redis-backed rate limits",
      "Upload type, size, filename, tenant-path, and retrieval-access validation for PDF, DOCX, TXT, and Markdown knowledge",
      "HTTPS-only transcription URLs with host allowlists, DNS/private-address checks, redirect blocking, and content limits",
    ],
    integrations: [
      "Local PostgreSQL CRM and SuiteCRM REST V8 connector",
      "OpenAI Responses API and deterministic demo AI provider",
      "PostgreSQL lexical retrieval and Qdrant vector retrieval",
      "Twilio and Plivo signed inbound webhooks",
      "SendGrid adapter and n8n signed webhook ingestion",
      "Prometheus metrics, structured JSON logs, Docker Compose, and GitHub Actions",
    ],
    evaluation: [
      "Repository audit: 99 passing backend tests with 71% measured line coverage",
      "Frontend lint, typecheck, 13 Vitest tests, and production build documented as passing",
      "Policy scoring, provider security, RAG lifecycle, API contracts, and critical flows have dedicated backend tests",
      "Docker Compose configuration was validated, but complete container startup was not rerun during the source audit",
    ],
    outcomes: [
      "A traceable account-intelligence flow from authorized evidence to proposal, policy decision, approval, and controlled mutation",
      "Executable approved actions for lead status, opportunity stage, and follow-up task creation",
      "Tenant- and role-filtered retrieval across PostgreSQL and Qdrant implementations",
      "The audited repository reports 99 passing backend tests with 71% measured coverage and 13 passing frontend tests",
      "CI validates linting, migrations, tests, builds, and Docker Compose configuration against PostgreSQL 16",
    ],
    limitations: [
      "Backend mypy currently reports 83 typing errors, primarily around third-party decorators and stubs",
      "Only account intelligence uses LangGraph; other AI endpoints use direct governed workflows",
      "SuiteCRM, SendGrid, transcription, and external providers require real credentials and are not bundled as live services",
      "Tenant isolation uses application predicates rather than PostgreSQL Row-Level Security",
      "Complete Docker startup was not revalidated in the documented repository audit",
    ],
    learnings: [
      "Model output should be treated as evidence for a decision, never as an authorization decision",
      "Human approval is reliable only when execution is atomic, re-authorized, idempotent, and protected against stale data",
      "Tenant isolation must cover CRM queries, connector context, approval lookup, and vector retrieval before generation",
      "Provider abstractions should reveal implementation maturity instead of making every available adapter look production-connected",
      "Production-oriented documentation must disclose validation gaps; the current dependency set still requires mypy remediation",
    ],
    hitl:
      "Managers and Administrators can approve or reject sensitive proposals; Sales Representatives may inspect them but cannot resolve them. Rejection executes nothing. Approval re-evaluates policy and current CRM state before the application service performs a supported command, preventing the model or an outdated proposal from bypassing business control.",
  },
  {
    id: "ai-bos",
    slug: "ai-business-os",
    number: "04",
    title: "AI Business Operating System",
    subtitle:
      "A multi-tenant operating platform where business modules, governed AI tools, RAG, and auditable workflows share one secure foundation.",
    label: "AI SaaS · Governed Agents · Workflows",
    categories: ["RAG & GenAI", "AI Agents", "Full-Stack"],
    maturity: "Deployed Demo",
    plainSummary:
      "An AI-first business platform connecting CRM, finance, projects, support, knowledge, analytics, and controlled agent actions.",
    technicalSummary:
      "React 18 + FastAPI · PostgreSQL forced RLS · Hybrid RAG · Tool Calling · Human-in-the-Loop · SSE · GitHub Actions",
    description:
      "Functional full-stack MVP combining persistence-backed business operations, tenant-grounded AI assistance, controlled tool execution, and durable workflow history.",
    problem:
      "Business teams often split CRM, finance, projects, support, documents, and automation across disconnected tools. Adding a separate copilot to every silo duplicates identity, permissions, context, observability, and integration logic while making AI actions difficult to govern.",
    solution:
      "AI BOS consolidates operational modules on one tenant-aware platform layer. The copilot retrieves organization knowledge, selects only registered tools, and submits sensitive mutations for approval; backend permissions, repositories, audit records, and workflow rules remain the execution authority.",
    highlights: [
      "Persistence-backed CRM, finance, projects, tasks, support, documents, and platform administration",
      "Custom AI orchestration with an explicit tool registry and deterministic offline fallback",
      "Tenant-grounded Hybrid RAG with database-backed sources and citations",
      "Human approval, permission checks, audit records, and AI traces around sensitive actions",
    ],
    proof: [
      { value: "214", label: "Backend tests passed", hint: "Documented audit · 2026-09-07" },
      { value: "16", label: "Frontend tests passed", hint: "Documented audit · 2026-09-07" },
      { value: "26", label: "Database migrations", hint: "PostgreSQL schema and RLS" },
    ],
    stack: ["React 18", "TypeScript", "Vite", "FastAPI", "SQLAlchemy", "Alembic", "PostgreSQL 16", "OpenAI", "SSE", "TanStack Query", "React Flow", "Playwright", "Docker", "GitHub Actions"],
    imageUrl: "/portfolio-uploads/ai-bos-dashboard.webp",
    imageAlt: "AI BOS executive dashboard with revenue, pipeline, treasury, clients, tickets, and team metrics",
    imageFit: "contain",
    gallery: [
      {
        src: "/portfolio-uploads/ai-bos-dashboard.webp",
        alt: "AI BOS executive dashboard with business KPIs and commercial pipeline",
        title: "Unified executive dashboard and operational KPIs",
      },
      {
        src: "/portfolio-uploads/ai-bos-project-portfolio.webp",
        alt: "AI BOS project portfolio with progress, teams, budgets, and delivery dates",
        title: "Project portfolio, delivery progress, teams, and budgets",
      },
      {
        src: "/portfolio-uploads/ai-bos-business-analytics.webp",
        alt: "AI BOS business analytics with revenue, conversion, customer, and funnel charts",
        title: "Cross-module business analytics and conversion insights",
      },
      {
        src: "/portfolio-uploads/ai-bos-ml-forecasting.webp",
        alt: "AI BOS machine learning forecast with confidence interval and AI recommendations",
        title: "Machine-learning forecasts with confidence and recommendations",
      },
    ],
    demoLink: "https://ai-business-os-murex.vercel.app/",
    caseStudyLink: "/work/ai-business-os",
    featuredLayout: "standard",
    status: "Functional full-stack MVP · Local and staging-oriented · Active development",
    overview:
      "AI BOS is a modular monolith that connects business data and AI actions inside the same identity, tenant, authorization, workflow, and audit boundaries. The React application exposes permission-aware operational modules while FastAPI services, tenant-filtered repositories, and PostgreSQL provide the enforcement layer.",
    architecture: [
      "React 18 and TypeScript application with protected, permission-aware routes, TanStack Query, and Zustand",
      "FastAPI modular monolith organized into presentation, service, repository, and SQLAlchemy layers",
      "PostgreSQL 16 with Alembic migrations, tenant-aware repository filters, and forced Row-Level Security",
      "Custom tool-calling orchestrator with registered JSON schemas and a deterministic local planner fallback",
      "Hybrid lexical and cosine retrieval over persisted knowledge chunks with database-backed citations",
      "Persistent domain events and visual workflows with step inputs, outputs, status, duration, and sanitized errors",
    ],
    howItWorks: [
      "JWT or scoped API-key identity establishes an immutable organization context",
      "Business modules read and mutate data through permission checks and tenant-filtered repositories",
      "The copilot retrieves tenant knowledge and either calls OpenAI or uses deterministic local intent planning",
      "The model can propose only tools exposed by the explicit registry; it never receives arbitrary database or shell access",
      "Medium-risk mutations are persisted as pending actions and re-authorized when a human approves them",
      "Tool results, audit records, AI traces, notifications, and workflow execution history remain inspectable",
    ],
    decisionHighlight: {
      title: "AI reasons; the platform authorizes and executes",
      body:
        "The model may select a registered tool and prepare its parameters, but authenticated tenant context, named backend permissions, risk metadata, human approval, repository validation, and audit logging determine whether the action can run.",
    },
    decisions: [
      "Use a modular monolith to keep cross-module transactions and platform policies coherent at the MVP stage",
      "Treat the tenant header as a consistency assertion, never as a way to switch organizations",
      "Keep authorization in backend policy code instead of prompts or model output",
      "Persist approval requests before sensitive mutations and re-check the approver's permissions at execution time",
      "Provide deterministic local embeddings and intent planning so core demonstrations remain usable without an AI provider",
    ],
    security: [
      "PBKDF2 password hashing, signed JWTs, hashed refresh sessions, rotation, reuse detection, and revocation",
      "Named RBAC permissions, scoped API keys, tenant repository filters, and forced PostgreSQL Row-Level Security",
      "Google and Microsoft OAuth with state, PKCE, verified profiles, and invitation-gated onboarding",
      "Secret redaction, security headers, production CORS validation, audit records, and disabled production OpenAPI routes",
      "Outbound workflow requests reject credentials in URLs and local, private, or reserved network targets",
    ],
    integrations: [
      "OpenAI function calling and embeddings with deterministic local fallbacks",
      "Google and Microsoft OAuth",
      "Stripe billing webhooks",
      "SMTP email and in-app notifications",
      "S3-compatible document storage",
      "Render, Vercel, Docker Compose, and GitHub Actions",
    ],
    evaluation: [
      "Documented audit on 2026-09-07: 214 backend tests passed and one PostgreSQL-only test was skipped",
      "Frontend typecheck, 16 Vitest tests, and production build passed with zero ESLint errors",
      "PostgreSQL migrations 001 through 026 passed and direct tenant-isolation checks rejected a cross-tenant write",
      "Playwright reported three passing and four failing scenarios; the failures are not presented as successful validation",
    ],
    outcomes: [
      "One platform foundation connects operational modules, tenant knowledge, AI tools, workflows, notifications, and audit history",
      "Sensitive agent actions remain inspectable and require approval before controlled execution",
      "Database-grounded citations keep retrieved evidence separate from model-generated claims",
      "The documented audit reports 214 passing backend tests, 16 passing frontend tests, and successful production builds",
    ],
    limitations: [
      "Four of seven documented Playwright scenarios currently fail because of timeouts and a mobile-header expectation",
      "The PostgreSQL RLS pytest harness needs correction even though direct policy checks succeeded",
      "Vector scoring runs in Python over stored JSON values; Qdrant, pgvector, RRF, and cross-encoder reranking are not part of this runtime",
      "Workflow execution is synchronous and in-process without Redis or distributed workers",
      "The Vercel and Render configuration does not by itself prove an active production backend deployment",
    ],
    learnings: [
      "Designing AI features as part of the authorization and data architecture rather than as a detached chat layer",
      "Enforcing tenant isolation redundantly across identity claims, repositories, and PostgreSQL policies",
      "Balancing portable local development with clearly documented production scaling limits",
      "Separating implemented runtime behavior from roadmap concepts and partial module surfaces",
    ],
    hitl:
      "The copilot can read authorized business context and propose actions, but sensitive mutations such as creating a CRM lead or an assigned task are stored as pending actions. Approval triggers a fresh permission check before controlled execution; rejection stops the operation.",
  },
  {
    id: "sihia",
    slug: "sihia",
    number: "05",
    title: "SIHIA — AI-Powered HealthTech Platform",
    label: "HealthTech · Hybrid RAG",
    categories: ["RAG & GenAI", "Full-Stack", "Data Engineering"],
    maturity: "Deployed Demo",
    subtitle:
      "Healthcare operations, predictive planning, and a citation-first AI assistant in one secure full-stack platform.",
    plainSummary:
      "A full-stack hospital operations platform for patient records, appointments, waiting rooms, analytics, attendance forecasting, and a grounded document assistant.",
    technicalSummary:
      "React 19 + FastAPI · PostgreSQL/Alembic · Qdrant + BM25 Hybrid RAG · SSE streaming · JWT/RBAC · Playwright CI",
    description:
      "Secure healthcare operations platform combining patient workflows, predictive analytics, and a source-grounded Hybrid RAG assistant.",
    problem:
      "Hospital teams need to coordinate patient records, practitioners, appointments, waiting rooms, documents, and operational forecasts without fragmenting data across disconnected tools. A generic chatbot is not sufficient in this context: answers must be traceable, medical boundaries must be enforced, and the system must fail safely when evidence is missing.",
    solution:
      "SIHIA unifies day-to-day hospital operations with secure role-based workflows, 7/30-day attendance forecasts, configurable notifications, and an administrable knowledge base. Its assistant retrieves evidence from approved PDF, Markdown, and text documents, cites the sources used, streams the answer, and refuses unsupported diagnosis or low-evidence questions.",
    highlights: [
      "Patient, practitioner, appointment, waiting-room, document, and analytics workflows",
      "Hybrid dense + BM25 retrieval fused with RRF and reranked before generation",
      "Citation-first answers with medical guardrails and evidence-based refusal",
      "Responsive trilingual interface with light/dark themes and RTL support",
    ],
    proof: [
      { value: "118", label: "Backend tests", hint: "Documented validation · 2026-08-11" },
      { value: "65", label: "Frontend tests", hint: "Documented validation · 2026-08-11" },
      { value: "17", label: "End-to-end scenarios", hint: "Documented Playwright validation" },
    ],
    stack: ["React 19", "TypeScript", "FastAPI", "SQLAlchemy", "Alembic", "PostgreSQL", "Qdrant", "BM25 / RRF", "FastEmbed", "OpenAI", "Playwright", "Docker"],
    imageUrl: "/portfolio-uploads/sihia-rag-dashboard.png",
    imageAlt: "SIHIA healthcare operations dashboard with predictive analytics and grounded AI assistant",
    gallery: [
      {
        src: "/portfolio-uploads/sihia-notifications-ai-assistant.webp",
        alt: "SIHIA notification center with grounded healthcare assistant conversation",
        title: "Proactive notifications and the grounded SIHIA assistant",
      },
      {
        src: "/portfolio-uploads/sihia-healthcare-analytics.webp",
        alt: "SIHIA healthcare analytics dashboard with revenue admissions satisfaction and age charts",
        title: "Hospital analytics, occupancy, admissions, and patient satisfaction",
      },
      {
        src: "/portfolio-uploads/sihia-doctor-directory.webp",
        alt: "SIHIA practitioner directory showing availability schedules and patient metrics",
        title: "Practitioner directory with availability and weekly planning",
      },
      {
        src: "/portfolio-uploads/sihia-ai-prediction.webp",
        alt: "SIHIA AI prediction screen for patient flow and no-show risk",
        title: "Patient-flow forecasting and no-show risk prioritization",
      },
    ],
    demoLink: "https://sihia-platform.vercel.app/",
    caseStudyLink: "/work/sihia",
    featuredLayout: "standard",
    status: "Active development · Product demo · Automated quality gates",
    overview:
      "SIHIA is an end-to-end HealthTech product rather than a standalone chatbot. The React application and FastAPI API cover operational workflows, analytics, forecasting, document administration, and a guarded assistant backed by PostgreSQL and Qdrant. The architecture can run with SQLite for lightweight development and PostgreSQL 16 for the complete environment.",
    architecture: [
      "React 19 and TypeScript frontend with TanStack data flows",
      "FastAPI application services with SQLAlchemy and Alembic migrations",
      "PostgreSQL for operational data, document lifecycle, and lexical chunks",
      "Qdrant dense retrieval combined with a persisted BM25 lexical index",
      "Reciprocal Rank Fusion followed by a lazy CPU cross-encoder reranker",
      "Evidence-limited prompt → structured citations → streamed SSE answer",
    ],
    howItWorks: [
      "JWT authentication and RBAC authorize hospital and knowledge-base operations",
      "Teams manage patients, practitioners, availability, appointments, waiting rooms, and documents",
      "Approved PDF, Markdown, and text files are validated, hashed, parsed, and split at semantic boundaries",
      "Chunks are stored in SQL for lifecycle and lexical search, then embedded into Qdrant",
      "Dense and BM25 results are fused with RRF and reranked before the relevance threshold is applied",
      "Sources are emitted before answer tokens; insufficient evidence triggers a controlled refusal",
    ],
    decisionHighlight: {
      title: "Degrade retrieval safely; never fall back to unsupported model memory",
      body:
        "When Qdrant or the embedding provider is unavailable, SIHIA falls back to its persisted lexical index. If the remaining evidence does not meet the configured threshold, the assistant refuses to answer instead of relying on unverified model knowledge.",
    },
    decisions: [
      "Separate SQL document lifecycle and searchable text from Qdrant vector storage",
      "Use deterministic, boundary-aware chunking with preserved page and section metadata",
      "Lazy-load the semantic reranker and provide a deterministic lexical fallback",
      "Contextualize short follow-ups with the latest user turn without using full chat history as the retrieval query",
      "Send structured sources before SSE answer tokens so citations remain inspectable",
    ],
    security: [
      "JWT access control, refresh-token rotation and revocation, plus RBAC in both API and interface",
      "Emergency, diagnosis, out-of-scope, and prompt-injection guardrails execute before retrieval and generation",
      "Uploads use allowlisted formats and sizes, normalized filenames, SHA-256 duplicate detection, and are never executed",
      "Operational logs expose identifiers and error types without recording document bodies or user queries",
      "The assistant does not diagnose or prescribe; medical content requires human validation before real-world use",
    ],
    integrations: [
      "PostgreSQL 16 / SQLite development mode",
      "Qdrant vector database",
      "OpenAI-compatible generation and embeddings",
      "Configurable email and SMS reminders",
      "Airflow operational and ML pipelines",
      "Docker Compose and GitHub Actions CI",
    ],
    evaluation: [
      "Documented local validation on 2026-08-11: 118 backend tests passed and one was skipped",
      "The same validation reports 65 frontend tests and 17 Playwright scenarios passing",
      "A deterministic 30-question French/English benchmark covers single-source, multi-source, follow-up, and no-answer retrieval",
      "Optional generated-answer RAGAS evaluation requires provider credentials, network access, and paid API calls",
    ],
    outcomes: [
      "A single product flow connects hospital operations, analytics, forecasting, and trusted document assistance",
      "The assistant supports cited answers, conversational follow-ups, and explicit no-answer behavior",
      "A deterministic 30-question French/English benchmark measures retrieval and no-answer accuracy without network calls",
      "CI validates dependencies, backend behavior, PostgreSQL hardening, frontend quality, production builds, and Playwright flows",
    ],
    limitations: [
      "Scanned PDFs without a text layer are unsupported because OCR is not implemented",
      "Synchronous ingestion targets demos and moderate corpora rather than large document-processing workloads",
      "The default cross-encoder reranker is primarily optimized for English; lexical fallback remains available for French",
      "Local Ollama generation is not implemented, and generated-answer evaluation requires an OpenAI-compatible endpoint",
      "Medical content requires human validation; the assistant does not diagnose or prescribe",
    ],
    learnings: [
      "Designing medical AI around explicit safety gates, evidence thresholds, citations, and human responsibility",
      "Combining dense and lexical retrieval while preserving a deterministic fallback path",
      "Coordinating SQL metadata, vector storage, reindexing, and failure states across the document lifecycle",
      "Testing a full-stack product across unit, integration, security, accessibility, and end-to-end layers",
    ],
    hitl:
      "SIHIA positions AI as an operational and documentary assistant, not a clinical decision-maker. Emergency requests are redirected to emergency services, diagnosis and prescription requests are refused, and healthcare professionals remain responsible for validating medical content and decisions.",
  },
  {
    id: "ai-sales",
    slug: "ai-sales-assistant",
    number: "06",
    title: "AI Sales Assistant",
    subtitle:
      "AI-assisted lead qualification and sales automation with deterministic scoring and Human-in-the-Loop control.",
    label: "Sales Automation · LangGraph",
    categories: ["AI Agents", "Automation / n8n", "Full-Stack"],
    maturity: "Prototype",
    plainSummary:
      "An AI-assisted sales platform that qualifies leads, gathers structured information, and automates follow-up workflows while keeping business scoring deterministic and sensitive decisions under human control.",
    technicalSummary:
      "LangGraph orchestration · deterministic lead scoring · FastAPI backend · PostgreSQL · n8n workflow automation",
    description:
      "AI-assisted sales platform combining conversational qualification, structured lead-data extraction, deterministic lead scoring, Human-in-the-Loop handoff, and automated business workflows.",
    problem:
      "Sales teams often spend time manually qualifying leads, updating CRM information, scheduling follow-ups, and deciding which opportunities deserve attention first. Using an LLM alone for these decisions would make the process difficult to control, audit, and reproduce. The system therefore needs to combine AI assistance with deterministic business rules and workflow automation.",
    solution:
      "Designed an AI-assisted sales platform that combines conversational qualification, structured lead-data extraction, deterministic lead scoring, Human-in-the-Loop handoff, and automated business workflows. The AI helps understand conversations and extract useful information, while business scoring remains deterministic in the backend. n8n workflows handle operational automation such as lead capture, alerts, follow-ups, appointments, reminders, and error handling.",
    highlights: [
      "Conversational AI qualification with structured lead-data extraction",
      "Deterministic 0–100 lead scoring kept outside the LLM",
      "Human handoff before sensitive or high-value next steps",
      "Automated follow-ups, alerts, bookings, and operational workflows",
    ],
    stack: ["Python", "FastAPI", "LangGraph", "OpenAI", "PostgreSQL", "n8n", "React"],
    imageUrl: "/portfolio-uploads/ai-sales-assistant-dashboard.png",
    imageAlt:
      "AI Sales Assistant dashboard showing lead metrics, qualification KPIs, lead generation trends, and lead source analytics",
    caseStudyLink: "/work/ai-sales-assistant",
    featuredLayout: "standard",
    overview:
      "AI Sales Assistant is an AI-assisted sales platform designed to help teams manage the journey from lead capture to qualification, follow-up, and meeting scheduling. The system combines conversational AI with structured business logic rather than allowing an LLM to control the complete sales process. LangGraph orchestrates the conversational workflow, FastAPI manages business logic and persistence, deterministic scoring prioritizes opportunities, and n8n handles operational automation.",
    howItWorks: [
      "User message",
      "Validate input",
      "Safety check",
      "Load context",
      "LLM / LangGraph structured lead extraction",
      "Deterministic scoring",
      "Human handoff when required",
      "Persistence",
      "Automation events via n8n",
    ],
    architecture: [
      "React UI for dashboard, leads, pipeline, and conversation management",
      "FastAPI API for business logic, persistence, and scoring services",
      "LangGraph conversation flow with OpenAI for structured extraction",
      "Deterministic LeadScoringService produces a 0–100 score outside the LLM",
      "PostgreSQL stores leads, scores, conversation state, and events",
      "n8n orchestrates operational workflows without replacing the backend",
    ],
    decisions: [
      "The LLM extracts structured lead information but does not control the final score",
      "Business scoring stays deterministic, explainable, testable, and auditable",
      "Sensitive next steps escalate to a human before execution",
      "n8n handles operational automation while FastAPI remains the source of truth",
    ],
    decisionHighlight: {
      title: "Why scoring is outside the LLM",
      body: "The LLM is used to understand conversations and extract structured lead information, but it is not treated as the source of truth for business scoring. A deterministic backend service calculates the final score, making qualification more predictable, explainable, testable, and easier to audit.",
    },
    scoring: {
      summary:
        "A deterministic backend scoring service calculates a 0–100 qualification score from structured lead factors. The LLM does not directly decide whether a lead is Hot, Warm, or Cold.",
      factors: [
        "Budget",
        "Urgency",
        "Service Fit",
        "Decision Authority",
        "Company Size",
        "Profile Completeness",
      ],
      range: "0–100",
      classes: ["Hot", "Warm", "Cold"],
    },
    automation: {
      summary:
        "n8n is used as the orchestration layer for operational workflows, while FastAPI remains responsible for core business logic and data integrity.",
      workflows: [
        "Lead Capture",
        "AI Qualification",
        "Hot Lead Alert",
        "Follow-up",
        "Appointment Booking",
        "Meeting Reminder",
        "Global Error Handler",
      ],
    },
    hitl: "Sensitive next steps and high-value sales actions can be escalated to a human rather than executed blindly by the AI layer. This keeps the system useful for automation while preserving operational control.",
    security: [
      "Input validation and safety checks before model calls",
      "Deterministic scoring for reproducible qualification outcomes",
      "Human approval path before sensitive or high-value actions",
      "Global error-handling workflow for operational reliability",
    ],
  },
];

export const secondaryProjects: SecondaryProject[] = [
  {
    id: "worldbank",
    title: "World Bank AI Chatbot (RAG)",
    description: "Ask questions about World Bank open data and get sourced answers.",
    category: "AI / RAG",
    categories: ["RAG & GenAI", "Full-Stack"],
    maturity: "Prototype",
    stack: ["Python", "RAG", "FAISS", "FastAPI"],
    imageUrl: "/portfolio-uploads/worldbank-ai-chatbot.png",
    githubLink: "https://github.com/TsinjoNantosoa/worldbank-ai-chatbot",
  },
  {
    id: "iot-pipeline",
    title: "IoT Kafka Spark Pipeline",
    description: "Real-time IoT streaming pipeline prepared for analytics ingestion.",
    category: "Backend & Data",
    categories: ["Data Engineering"],
    maturity: "Prototype",
    stack: ["Kafka", "Spark", "AWS", "Python"],
    githubLink: "https://github.com/TsinjoNantosoa/iot-kafka-spark-redshift-pipeline",
  },
  {
    id: "weather-etl",
    title: "Weather ETL with Airflow",
    description: "Scheduled weather data extraction and transformation for analytics.",
    category: "Backend & Data",
    categories: ["Automation / n8n", "Data Engineering"],
    maturity: "Prototype",
    stack: ["Airflow", "Python", "ETL"],
    githubLink: "https://github.com/TsinjoNantosoa/weather_etl",
  },
  {
    id: "bank-loan",
    title: "Bank Loan Analytics Dashboard",
    description: "Portfolio quality and banking risk indicators in one dashboard.",
    category: "Backend & Data",
    categories: ["Data Engineering"],
    maturity: "Prototype",
    stack: ["Power BI", "SQL", "Dashboard"],
    imageUrl: "/portfolio-uploads/bank-loan-dashboard.png",
    githubLink: "https://github.com/TsinjoNantosoa/bank-loan-analytics-dashboard",
  },
];

export const getFeaturedProjectBySlug = (slug: string) =>
  featuredProjects.find((project) => project.slug === slug);
