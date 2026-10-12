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
    imageUrl: "/portfolio-uploads/production-multi-tenant-rag-platform.png",
    imageAlt: "Humans4Help multi-tenant assistant embedded in a client website",
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
    id: "arcwell",
    slug: "arcwell-agentic-crm",
    number: "02",
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
    number: "03",
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
    number: "04",
    title: "SIHIA — AI-Powered HealthTech Platform",
    label: "HealthTech · Hybrid RAG",
    plainSummary:
      "A healthcare operations platform combining hospital workflows, predictive analytics, and an AI assistant grounded in trusted knowledge.",
    technicalSummary:
      "Hybrid RAG using dense search, BM25, RRF fusion, and cross-encoder reranking.",
    description:
      "Full-stack healthcare operations platform combining secure hospital workflows, predictive analytics, and a grounded Hybrid RAG assistant.",
    highlights: [
      "Combines semantic and keyword search for more reliable evidence",
      "Reranks evidence before the model answers",
      "Answers include citations and can refuse when evidence is weak",
      "Hospital workflows and predictive analytics in one platform",
    ],
    proof: [
      { value: "118", label: "Backend tests", hint: "Automated validation" },
      { value: "65", label: "Frontend tests", hint: "UI coverage" },
      { value: "17", label: "End-to-end scenarios", hint: "Playwright flows" },
    ],
    stack: ["FastAPI", "React", "PostgreSQL", "Qdrant", "BM25", "FastEmbed", "Docker"],
    imageUrl: "/portfolio-uploads/sihia-rag-dashboard.png",
    demoLink: "https://sihia-platform.vercel.app/",
    caseStudyLink: "/work/sihia",
    featuredLayout: "standard",
    overview:
      "Healthcare operations platform with predictive analytics and a grounded Hybrid RAG assistant.",
    architecture: [
      "Dense retrieval + BM25",
      "Reciprocal Rank Fusion",
      "Cross-encoder reranking",
      "Evidence → LLM → Answer + Citations",
    ],
  },
  {
    id: "ai-sales",
    slug: "ai-sales-assistant",
    number: "05",
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
