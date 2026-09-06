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
    imageUrl: "/portfolio-uploads/production-multi-tenant-rag-platform.png",
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
      "An AI layer for CRM workflows where agents can propose actions, but sensitive changes require business rules and human approval first.",
    technicalSummary:
      "LangGraph orchestration with tenant-scoped retrieval, policy checks, and Human-in-the-Loop approvals.",
    description:
      "A governed AI layer for CRM workflows where agents reason over authorized business context, propose structured actions, and require deterministic policy checks or human approval before sensitive mutations.",
    highlights: [
      "Agents propose actions instead of executing blindly",
      "Sensitive AI actions must pass business rules before execution",
      "Human approval before high-impact CRM changes",
      "Audit trails for proposed and approved actions",
    ],
    stack: ["Python", "FastAPI", "LangGraph", "Qdrant", "PostgreSQL", "Redis", "Celery", "React"],
    usePlaceholder: true,
    placeholderKind: "agent",
    placeholderSteps: ["Context", "AI Agent", "Policy", "Human Approval", "Action", "Audit"],
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
    label: "Sales Automation · LangGraph",
    plainSummary:
      "An AI sales assistant that qualifies leads, gathers structured information, and triggers follow-up workflows without letting the LLM control business scoring.",
    technicalSummary:
      "LangGraph conversation flow with deterministic scoring and n8n operational automation.",
    description:
      "AI-assisted sales system combining conversational qualification, deterministic lead scoring, Human-in-the-Loop handoff, and workflow automation.",
    highlights: [
      "Conversational qualification that extracts structured lead data",
      "Business scoring stays deterministic in the backend",
      "Human handoff before sensitive next steps",
      "Automated follow-up, alerts, and booking workflows",
    ],
    stack: ["Python", "FastAPI", "LangGraph", "OpenAI", "n8n", "React", "PostgreSQL"],
    usePlaceholder: true,
    placeholderKind: "workflow",
    placeholderSteps: [
      "Message",
      "Validation",
      "AI Extraction",
      "Deterministic Score",
      "Human Handoff",
      "Automation",
    ],
    caseStudyLink: "/work/ai-sales-assistant",
    featuredLayout: "standard",
    overview:
      "Sales qualification system where conversational AI extracts lead data while scoring remains deterministic.",
    architecture: [
      "User message → validation → safety check → context",
      "LLM / LangGraph structured lead extraction",
      "Deterministic scoring and Human-in-the-Loop handoff",
      "n8n workflows for capture, alerts, follow-up, booking, and error handling",
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
    imageUrl: "/portfolio-uploads/iot-pipeline.png",
    githubLink: "https://github.com/TsinjoNantosoa/iot-kafka-spark-redshift-pipeline",
  },
  {
    id: "weather-etl",
    title: "Weather ETL with Airflow",
    description: "Scheduled weather data extraction and transformation for analytics.",
    category: "Backend & Data",
    stack: ["Airflow", "Python", "ETL"],
    imageUrl: "/portfolio-uploads/weather-etl.png",
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
