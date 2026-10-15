export interface ProjectProof {
  label: string;
  value: string;
  hint?: string;
}

export interface ProjectGalleryImage {
  src: string;
  alt: string;
  title: string;
}

export type ProjectCategory =
  | "RAG & GenAI"
  | "AI Agents"
  | "Automation / n8n"
  | "Full-Stack"
  | "Data Engineering";

export type ProjectMaturity = "Production" | "Deployed Demo" | "Prototype" | "Research";

export interface FeaturedProject {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle?: string;
  label: string;
  categories: ProjectCategory[];
  maturity: ProjectMaturity;
  plainSummary: string;
  technicalSummary: string;
  description: string;
  problem?: string;
  solution?: string;
  highlights: string[];
  proof?: ProjectProof[];
  stack: string[];
  imageUrl?: string;
  imageAlt?: string;
  imagePending?: boolean;
  imageFit?: "cover" | "contain";
  gallery?: ProjectGalleryImage[];
  demoLink?: string;
  githubLink?: string;
  caseStudyLink: string;
  featuredLayout?: "flagship" | "standard";
  architecture?: string[];
  decisions?: string[];
  security?: string[];
  overview?: string;
  howItWorks?: string[];
  scoring?: {
    summary: string;
    factors: string[];
    range: string;
    classes: string[];
  };
  automation?: {
    summary: string;
    workflows: string[];
  };
  hitl?: string;
  decisionHighlight?: {
    title: string;
    body: string;
  };
  status?: string;
  integrations?: string[];
  outcomes?: string[];
  learnings?: string[];
  showArchitectureDiagram?: boolean;
}

export interface SecondaryProject {
  id: string;
  title: string;
  description: string;
  category: "AI / RAG" | "Automation" | "Backend & Data";
  categories: ProjectCategory[];
  maturity: ProjectMaturity;
  stack: string[];
  imageUrl?: string;
  githubLink?: string;
  demoLink?: string;
}

export interface ExperienceItem {
  id: string;
  period: string;
  title: string;
  company: string;
  location?: string;
  plainSummary: string;
  technicalSummary?: string;
  highlights: string[];
  proof?: ProjectProof[];
  stack?: string[];
  isPrimary?: boolean;
}

export interface ExpertisePillar {
  number: string;
  title: string;
  plainDescription: string;
  technicalDetail: string;
}

export interface SkillGroup {
  title: string;
  skills: string[];
}

export interface CertificationItem {
  title: string;
  issuer: string;
  year?: string;
  imageUrl: string;
  featured?: boolean;
}

export interface EducationItem {
  period: string;
  title: string;
  institution: string;
  detail?: string;
}
