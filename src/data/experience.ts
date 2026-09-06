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
    period: "Jan 2026 — Aug 2026",
    title: "AI Engineer — Conversational AI & RAG Systems",
    company: "Humans4Help Madagascar",
    location: "Antananarivo, Madagascar",
    plainSummary:
      "Built a shared AI assistant platform allowing multiple organizations to operate independent assistants while keeping their knowledge and configuration isolated.",
    technicalSummary: "FastAPI · Qdrant · PostgreSQL · Redis · LangChain · Docker",
    highlights: [
      "Delivered tenant-isolated conversational AI backends",
      "Operated production RAG with knowledge isolation and retrieval controls",
      "Strengthened deployment, reliability, auditing, and security workflows",
    ],
    proof: [
      { value: "3", label: "Assistants" },
      { value: "700+", label: "Chunks" },
      { value: "97/98", label: "Checks" },
    ],
    stack: ["Python", "FastAPI", "LangChain", "Qdrant", "PostgreSQL", "Redis", "Docker"],
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
    period: "2024 — 2026",
    title: "Master’s Degree",
    detail: "Applied Mathematics, Computer Science & Statistics (MISA)",
    institution: "University of Antananarivo",
  },
  {
    period: "",
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
    title: "AI / LLM",
    skills: [
      "LangGraph",
      "LangChain",
      "OpenAI API",
      "RAG",
      "AI Agents",
      "Tool Calling",
      "Human-in-the-Loop",
    ],
  },
  {
    title: "Backend & Data",
    skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Qdrant", "SQLAlchemy", "REST APIs"],
  },
  {
    title: "Automation & Infrastructure",
    skills: ["n8n", "Webhooks", "Docker", "GitHub Actions", "Linux", "CI/CD"],
  },
  {
    title: "Frontend",
    skills: ["React", "TypeScript"],
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
