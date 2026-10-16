import type { ProjectMaturity } from "./portfolio";

export interface LocalizedCopy {
  en: string;
  fr: string;
}

export interface LabProjectReference {
  slug: string;
  label: string;
}

export interface LabCapability {
  id: "rag" | "agentic" | "automation" | "production" | "assisted-development";
  number: string;
  title: LocalizedCopy;
  summary: LocalizedCopy;
  details: LocalizedCopy[];
  workflow: LocalizedCopy[];
  technologies: string[];
  maturity: ProjectMaturity;
  references: LabProjectReference[];
}
