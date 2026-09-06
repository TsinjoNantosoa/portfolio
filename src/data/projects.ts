import type { FeaturedProject, SecondaryProject } from "@/types/portfolio";

export const featuredProjects: FeaturedProject[] = [
  {
    id: "multi-tenant-rag",
    slug: "multi-tenant-rag",
    number: "01",
    title: "Production Multi-Tenant RAG Platform",
    label: "Professional Project · RAG",
    plainSummary:
      "A shared AI platform that lets multiple organizations run their own assistants while keeping each company's data, knowledge, branding, and configuration isolated.",
    technicalSummary:
      "Multi-tenant RAG with FastAPI, PostgreSQL, Redis, Qdrant, and automated website ingestion.",
    description:
      "Production-oriented multi-tenant conversational AI platform designed for multiple organizations with isolated knowledge bases, prompts, configuration, branding, and retrieval infrastructure.",
    problem:
      "Businesses needed independent AI assistants on one platform without sharing data or knowledge.",
    solution:
      "Built an end-to-end multi-tenant RAG architecture with ingestion, retrieval, tenant-aware config, memory, security controls, and embeddable chat interfaces.",
    highlights: [
      "Each organization only retrieves knowledge it is authorized to access",
      "Automated website ingestion into searchable knowledge bases",
      "Admin APIs for configuration, branding, and assistant operations",
      "Security guardrails and audited conversational flows",
    ],
    proof: [
      { value: "3", label: "Assistants", hint: "Deployed for real organizations" },
      { value: "700+", label: "Knowledge chunks", hint: "Indexed and maintained" },
      { value: "97/98", label: "Quality checks", hint: "Validated before production" },
    ],
    stack: ["Python", "FastAPI", "LangChain", "Qdrant", "PostgreSQL", "Redis", "React", "Docker"],
    caseStudyLink: "/work/multi-tenant-rag",
    featuredLayout: "flagship",
    overview:
      "Built for a professional engagement delivering conversational AI assistants across multiple organizations on a shared multi-tenant platform.",
    architecture: [
      "Tenant-aware ingestion and embedding pipeline",
      "Vector retrieval with isolated knowledge bases",
      "Conversation memory and admin configuration APIs",
      "Embeddable chat interfaces with branding per tenant",
    ],
    decisions: [
      "Isolated tenant knowledge to prevent cross-tenant leakage",
      "Shared platform infrastructure for operational efficiency",
      "Security and auditing layered around retrieval and responses",
    ],
    security: [
      "Tenant isolation for knowledge and configuration",
      "Guardrails and audited conversational flows",
      "Validated quality and security check suites (97/98)",
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
