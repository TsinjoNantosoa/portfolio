import type { FeaturedProject, SecondaryProject } from "@/types/portfolio";

export const featuredProjects: FeaturedProject[] = [
  {
    id: "multi-tenant-rag",
    slug: "multi-tenant-rag",
    number: "01",
    title: "Enterprise RAG & AI Commercial Agent Platform",
    label: "Featured Professional Project · Production + Pilot",
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
    label: "Agentic AI · Governance",
    plainSummary:
      "An AI layer that helps CRM teams automate work while keeping sensitive actions under business rules and human approval.",
    technicalSummary:
      "LangGraph orchestration · tenant-scoped retrieval · policy checks · Human-in-the-Loop",
    description:
      "A governed AI layer for CRM workflows where agents reason over authorized business context, propose structured actions, and require deterministic policy checks or human approval before sensitive mutations.",
    highlights: [
      "Agents propose actions instead of executing blindly",
      "Sensitive AI actions must pass business rules before execution",
      "Human approval before high-impact CRM changes",
      "Audit trails for proposed and approved actions",
    ],
    stack: ["Python", "FastAPI", "LangGraph", "Qdrant", "PostgreSQL", "Redis", "Celery", "React"],
    imageUrl: "/portfolio-uploads/arcwell-agentic-crm-login.png",
    imageAlt:
      "Arcwell Agentic CRM sign-in interface presenting governed revenue intelligence and human approval controls",
    githubLink: "https://github.com/TsinjoNantosoa/arcwell-agentic-crm",
    caseStudyLink: "/work/arcwell-agentic-crm",
    featuredLayout: "standard",
    overview:
      "Agentic CRM layer focused on governed tool use, policy checks, and human approval before sensitive mutations.",
    architecture: [
      "LangGraph orchestration for multi-step agent workflows",
      "Tenant-scoped retrieval with access filtering",
      "Action proposal layer separated from execution",
      "HITL approval and audit trail persistence",
    ],
    decisions: [
      "Separate reasoning from authorization and execution",
      "Deterministic policy checks before sensitive mutations",
      "Human approval for high-impact CRM operations",
    ],
  },
  {
    id: "ai-bos",
    slug: "ai-business-os",
    number: "04",
    title: "AI Business Operating System",
    subtitle: "Agentic Business Platform",
    label: "AI SaaS · Agents · Workflows",
    plainSummary:
      "An AI-first business platform where agents can retrieve context, help with business tasks, and propose controlled actions.",
    technicalSummary:
      "Multi-tenant FastAPI/React architecture with RAG, tool calling, workflows, and Human-in-the-Loop.",
    description:
      "Multi-tenant AI-first SaaS platform combining business operations, knowledge retrieval, workflows, and controlled agent actions.",
    highlights: [
      "Agents help with business tasks using authorized tools",
      "Human approval before sensitive operations",
      "Shared platform with organization-level access control",
      "Business modules connected to knowledge retrieval and workflows",
    ],
    stack: ["Python", "FastAPI", "React", "PostgreSQL", "Redis", "OpenAI", "Docker"],
    imageUrl: "/portfolio-uploads/ai-business-os-dashboard.png",
    demoLink: "https://ai-business-os-murex.vercel.app/",
    caseStudyLink: "/work/ai-business-os",
    featuredLayout: "standard",
    overview:
      "Full-stack AI business platform combining operations, agent-driven actions, and a working product demo.",
    architecture: [
      "FastAPI backend with React frontend",
      "Agent and tool orchestration with controlled execution",
      "PostgreSQL + Redis supporting application state",
      "Human-in-the-Loop approval for sensitive actions",
    ],
  },
  {
    id: "sihia",
    slug: "sihia",
    number: "05",
    title: "SIHIA — AI-Powered HealthTech Platform",
    label: "HealthTech · Hybrid RAG",
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
      { value: "118", label: "Backend tests", hint: "Automated validation" },
      { value: "65", label: "Frontend tests", hint: "UI coverage" },
      { value: "17", label: "End-to-end scenarios", hint: "Playwright flows" },
    ],
    stack: ["React 19", "TypeScript", "FastAPI", "SQLAlchemy", "Alembic", "PostgreSQL", "Qdrant", "BM25 / RRF", "FastEmbed", "OpenAI", "Playwright", "Docker"],
    imageUrl: "/portfolio-uploads/sihia-rag-dashboard.png",
    imageAlt: "SIHIA healthcare operations dashboard with predictive analytics and grounded AI assistant",
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
    outcomes: [
      "A single product flow connects hospital operations, analytics, forecasting, and trusted document assistance",
      "The assistant supports cited answers, conversational follow-ups, and explicit no-answer behavior",
      "A deterministic 30-question French/English benchmark measures retrieval and no-answer accuracy without network calls",
      "CI validates dependencies, backend behavior, PostgreSQL hardening, frontend quality, production builds, and Playwright flows",
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
    stack: ["Python", "RAG", "FAISS", "FastAPI"],
    imageUrl: "/portfolio-uploads/worldbank-ai-chatbot.png",
    githubLink: "https://github.com/TsinjoNantosoa/worldbank-ai-chatbot",
  },
  {
    id: "iot-pipeline",
    title: "IoT Kafka Spark Pipeline",
    description: "Real-time IoT streaming pipeline prepared for analytics ingestion.",
    category: "Backend & Data",
    stack: ["Kafka", "Spark", "AWS", "Python"],
    githubLink: "https://github.com/TsinjoNantosoa/iot-kafka-spark-redshift-pipeline",
  },
  {
    id: "weather-etl",
    title: "Weather ETL with Airflow",
    description: "Scheduled weather data extraction and transformation for analytics.",
    category: "Backend & Data",
    stack: ["Airflow", "Python", "ETL"],
    githubLink: "https://github.com/TsinjoNantosoa/weather_etl",
  },
  {
    id: "bank-loan",
    title: "Bank Loan Analytics Dashboard",
    description: "Portfolio quality and banking risk indicators in one dashboard.",
    category: "Backend & Data",
    stack: ["Power BI", "SQL", "Dashboard"],
    imageUrl: "/portfolio-uploads/bank-loan-dashboard.png",
    githubLink: "https://github.com/TsinjoNantosoa/bank-loan-analytics-dashboard",
  },
];

export const getFeaturedProjectBySlug = (slug: string) =>
  featuredProjects.find((project) => project.slug === slug);
