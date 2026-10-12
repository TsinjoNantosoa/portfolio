import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  ExpertisePillar,
  SkillGroup,
} from "@/types/portfolio";

export const expertisePillars: ExpertisePillar[] = [
  {
    number: "01",
    title: "AI Agents & Agentic Systems",
    plainDescription:
      "I design AI agents that can take useful actions while remaining controlled, auditable, and safe for business workflows.",
    technicalDetail:
      "LangGraph · tool calling · structured outputs · policy checks · Human-in-the-Loop",
  },
  {
    number: "02",
    title: "Production RAG Systems",
    plainDescription:
      "I build knowledge assistants that retrieve trusted evidence, answer with citations, and keep each organization's data isolated.",
    technicalDetail:
      "Ingestion · vector search · hybrid retrieval · reranking · evaluation · multi-tenancy",
  },
  {
    number: "03",
    title: "AI Automation & Backend Engineering",
    plainDescription:
      "I connect AI to real business operations through reliable APIs, workflows, retries, and production-ready backends.",
    technicalDetail: "Python · FastAPI · n8n · webhooks · PostgreSQL · Redis · CI/CD",
  },
];

export const experienceItems: ExperienceItem[] = [
  {
    id: "h4h",
    period: "2025 – September 2026",
    title: "AI Engineer — Generative AI, RAG & AI Agents",
    company: "Humans4Help Madagascar",
    location: "Antananarivo, Madagascar",
    plainSummary:
      "Developed and deployed a multi-tenant conversational AI platform combining RAG, hybrid search, custom assistants, and LLM Tool Calling. Designed a commercial agent extension with business-tool orchestration, CRM integrations, and safety controls.",
    technicalSummary: "Python · FastAPI · LangChain · RAG · AI Agents · Tool Calling · Qdrant · PostgreSQL · Redis · React · TypeScript · Docker",
    highlights: [
      "Built a reusable RAG platform deployed for multiple organizations, with tenant-isolated knowledge and configuration",
      "Evolved the deterministic RAG assistant into a pilot commercial agent that selects approved business tools in a controlled execution loop",
      "Integrated HubSpot, Microsoft Teams, and SMTP workflows with server-side validation and explicit consent before sensitive actions",
    ],
    stack: ["Python", "FastAPI", "LangChain", "RAG", "AI Agents", "Tool Calling", "Qdrant", "PostgreSQL", "Redis", "React", "TypeScript", "Docker"],
    isPrimary: true,
  },
  {
    id: "freelance-automation",
    period: "Mar 2026 — Jul 2026",
    title: "AI Automation Consultant",
    company: "Freelance / Project-based",
    location: "Remote",
    plainSummary:
      "Built business automation workflows connecting APIs, CRM tools, and AI services with reliability-first orchestration.",
    technicalSummary: "n8n · Webhooks · Airtable · Google Workspace · FastAPI",
    highlights: [
      "Designed modular workflows with retries, idempotency, and error handling",
      "Extended automation with Python/FastAPI when orchestration alone was insufficient",
      "Added human approval for sensitive business actions",
    ],
    stack: ["n8n", "Python", "FastAPI", "Webhooks", "Airtable", "Google Workspace"],
  },
  {
    id: "ets-baron",
    period: "Jun 2026 — Aug 2026",
    title: "CRM & Business Automation — Odoo 18",
    company: "ETS Baron",
    plainSummary:
      "Implemented CRM and operational automation covering quotes, orders, planning, delivery, and invoicing.",
    technicalSummary: "Odoo 18 · Python · XML · PostgreSQL · Docker",
    highlights: [
      "Customized CRM and operational processes in Odoo 18",
      "Supported Docker-based delivery and CI/CD-oriented development practices",
    ],
    stack: ["Odoo 18", "Python", "XML", "PostgreSQL", "Docker", "CI/CD"],
  },
];

export const educationItems: EducationItem[] = [
  {
    period: "2026",
    title: "Master 2",
    detail: "Applied Mathematics, Computer Science & Statistics (MISA)",
    institution: "University of Antananarivo",
  },
  {
    period: "2024",
    title: "Bachelor’s Degree",
    detail: "Applied Mathematics, Computer Science & Statistics (MISA)",
    institution: "University of Antananarivo",
  },
];

export const ABOUT = {
  headline: "AI engineering beyond the prototype.",
  paragraphs: [
    "I'm an AI Engineer focused on turning promising AI prototypes into reliable systems that businesses can actually use.",
    "My work combines RAG, governed agents, automation and backend engineering with a strong focus on reliability, security, testing and deployment.",
  ],
};

export const languages = [
  { name: "Malagasy", level: "Native" },
  { name: "French", level: "Professional" },
  { name: "English", level: "Professional" },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Generative AI & Agentic Systems",
    skills: [
      "RAG",
      "AI Agents",
      "Tool Calling",
      "LangChain",
      "LangGraph",
      "OpenAI API",
      "Prompt Engineering",
      "Guardrails",
      "Vector Search",
      "Human-in-the-Loop",
    ],
  },
  {
    title: "Backend Engineering",
    skills: ["Python", "FastAPI", "REST APIs", "SSE", "WebSockets", "Pydantic", "SQLAlchemy", "JWT", "RBAC"],
  },
  {
    title: "Data & Vector Databases",
    skills: ["PostgreSQL", "Qdrant", "Redis", "SQL", "MongoDB"],
  },
  {
    title: "Frontend Engineering",
    skills: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "AI Automation & Integration",
    skills: ["n8n", "Workflow Orchestration", "API Integrations", "Webhooks", "CRM Integration", "Business Automation"],
  },
  {
    title: "DevOps & Infrastructure",
    skills: ["Docker", "Linux", "GitHub Actions", "CI/CD", "Automated Testing"],
  },
  {
    title: "Data Engineering & Machine Learning",
    skills: ["Pandas", "ETL / ELT", "Airflow", "Machine Learning", "Data Analytics"],
  },
];

export const featuredCertifications: CertificationItem[] = [
  {
    title: "Associate AI Engineer for Developers",
    issuer: "DataCamp",
    imageUrl: "/certificate/Screenshot from 2025-10-01 11-42-08.png",
    featured: true,
  },
  {
    title: "Data Engineer Professional",
    issuer: "DataCamp",
    imageUrl: "/certificate/professional_data_engeener.png",
    featured: true,
  },
  {
    title: "Professional Data Analyst",
    issuer: "DataCamp",
    imageUrl: "/certificate/data_analyst_associate.png",
    featured: true,
  },
  {
    title: "SQL Associate",
    issuer: "DataCamp",
    imageUrl: "/certificate/sql_associate.png",
    featured: true,
  },
];

export const allCertifications: CertificationItem[] = [
  ...featuredCertifications,
  { title: "Data Engineer Associate", issuer: "DataCamp", imageUrl: "/certificate/data_engineer_associate.png" },
  { title: "Python Data Associate", issuer: "DataCamp", imageUrl: "/certificate/python_data_associate.png" },
  { title: "AWS Cloud Practitioner (CLF-C02)", issuer: "AWS", imageUrl: "/certificate/aws_cloud_practitioner.png" },
  { title: "Data Engineer Career Track", issuer: "DataCamp", imageUrl: "/certificate/data_engineer_track.png" },
  { title: "Data Analyst in Python", issuer: "DataCamp", imageUrl: "/certificate/data_analyst_in_python.png" },
  { title: "Data Analyst in Power BI", issuer: "DataCamp", imageUrl: "/certificate/data_analyst_power_bi.png" },
  { title: "Data Engineer in Python", issuer: "DataCamp", imageUrl: "/certificate/Data_engeener_in_python.png" },
  { title: "Power BI Fundamentals", issuer: "DataCamp", imageUrl: "/certificate/power_bi_fondamental.png" },
  {
    title: "Snowflake Data Engineer Associate",
    issuer: "DataCamp",
    imageUrl: "/certificate/data_engeener_in_snowflake.png",
  },
];

export const CV_PATH = "/CV/CV_AIEngineer_AgentProduct_Sandaniaina_Tsinjo.pdf";
export const EMAIL = "tsinjonantosoa@gmail.com";
export const GITHUB_URL = "https://github.com/TsinjoNantosoa";
export const LINKEDIN_URL =
  "https://www.linkedin.com/in/sandaniaina-tsinjo-nantosoa-b6209a330/";
