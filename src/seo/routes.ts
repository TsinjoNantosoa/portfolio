import { absoluteUrl, DEFAULT_OG_IMAGE, PERSON_ID, ROBOTS_INDEXABLE, ROBOTS_NOINDEX, SITE_NAME, SITE_URL, WEBSITE_ID } from "./site";

export type SeoLanguage = "en" | "fr";

export interface SeoBreadcrumb {
  name: string;
  path: string;
}

export interface SeoRecord {
  kind: "home" | "section" | "case-study" | "not-found";
  path: string;
  language: SeoLanguage;
  title: string;
  description: string;
  /** Absolute image URL for Open Graph and Twitter cards. */
  image: string;
  imageAlt: string;
  noindex: boolean;
  breadcrumbs: SeoBreadcrumb[];
  /** Verifiable repository link, when the page describes a project that has one. */
  codeRepository?: string;
}

type Localized = Record<SeoLanguage, string>;

interface StaticRouteCopy {
  title: Localized;
  description: Localized;
}

/** Public, indexable routes that are not case studies. Order is the sitemap order. */
export const STATIC_PUBLIC_PATHS = ["/", "/lab", "/lab/playground", "/lab/operations", "/lab/automation"] as const;
export type StaticPublicPath = (typeof STATIC_PUBLIC_PATHS)[number];

export const robotsContent = (record: SeoRecord): string => (record.noindex ? ROBOTS_NOINDEX : ROBOTS_INDEXABLE);

const LAB_NAME: Localized = { en: "AI Engineering Lab", fr: "AI Engineering Lab" };

const STATIC_COPY: Record<StaticPublicPath, StaticRouteCopy> = {
  "/": {
    title: {
      en: "Sandaniaina Tsinjo Nantosoa — AI Engineer (RAG & AI Agents)",
      fr: "Sandaniaina Tsinjo Nantosoa — Ingénieur IA (RAG & agents IA)",
    },
    description: {
      en: "AI Engineer specializing in generative AI, multi-tenant RAG platforms, Tool Calling agents, FastAPI backends, and reliable production delivery.",
      fr: "Ingénieur IA spécialisé en IA générative, plateformes RAG multi-tenant, agents IA avec Tool Calling, backend FastAPI et déploiement de solutions fiables.",
    },
  },
  "/lab": {
    title: { en: "AI Engineering Lab — Tsinjo", fr: "AI Engineering Lab — Tsinjo" },
    description: {
      en: "Methods, architectures, and evidence from real RAG, AI agent, automation, and production engineering projects.",
      fr: "Méthodes, architectures et preuves issues de projets réels en RAG, agents IA, automatisation et ingénierie de production.",
    },
  },
  "/lab/playground": {
    title: { en: "Public RAG Playground — Tsinjo", fr: "Playground RAG public — Tsinjo" },
    description: {
      en: "Public RAG demonstration with observable retrieval, evidence-linked generation, and verifiable citations.",
      fr: "Démonstration RAG publique avec recherche observable, génération reliée aux preuves et citations vérifiables.",
    },
  },
  "/lab/operations": {
    title: { en: "AI Operations Monitor — Tsinjo", fr: "Moniteur d’opérations IA — Tsinjo" },
    description: {
      en: "Privacy-preserving operational signals for the portfolio assistant and public RAG Playground.",
      fr: "Signaux opérationnels agrégés et respectueux de la confidentialité pour l’assistant et le Playground RAG.",
    },
  },
  "/lab/automation": {
    title: { en: "Business Automation Showcase — Tsinjo", fr: "Business Automation Showcase — Tsinjo" },
    description: {
      en: "Interactive, simulated walk-through of a business automation workflow with human approval, based on the Offshore Fares project (n8n, PostgreSQL, controlled AI).",
      fr: "Démonstration interactive et simulée d’un workflow d’automatisation avec validation humaine, d’après le projet Offshore Fares (n8n, PostgreSQL, IA contrôlée).",
    },
  },
};

const HOME_CRUMB: Localized = { en: "Home", fr: "Accueil" };

const staticBreadcrumbs = (path: StaticPublicPath, language: SeoLanguage): SeoBreadcrumb[] => {
  const home = { name: HOME_CRUMB[language], path: "/" };
  if (path === "/") return [home];
  const lab = { name: LAB_NAME[language], path: "/lab" };
  if (path === "/lab") return [home, lab];
  return [home, lab, { name: STATIC_COPY[path].title[language].replace(/ — Tsinjo$/, ""), path }];
};

const defaultImage = { image: `${SITE_URL}${DEFAULT_OG_IMAGE.path}`, imageAlt: DEFAULT_OG_IMAGE.alt };

export const isStaticPublicPath = (path: string): path is StaticPublicPath =>
  (STATIC_PUBLIC_PATHS as readonly string[]).includes(path);

export const getStaticSeo = (path: StaticPublicPath, language: SeoLanguage = "en"): SeoRecord => ({
  kind: path === "/" ? "home" : "section",
  path,
  language,
  title: STATIC_COPY[path].title[language],
  description: STATIC_COPY[path].description[language],
  ...defaultImage,
  noindex: false,
  breadcrumbs: staticBreadcrumbs(path, language),
});

/** Minimal project shape needed for SEO, so this module never imports the large project catalog. */
export interface ProjectSeoInput {
  slug: string;
  title: string;
  description: string;
  plainSummary?: string;
  imageUrl?: string;
  imageAlt?: string;
  githubLink?: string;
  caseStudyLink: string;
}

export const MAX_DESCRIPTION_LENGTH = 160;

/** Search results cut descriptions around 160 characters; shorten at a word boundary instead of mid-word. */
export const fitDescription = (text: string, max = MAX_DESCRIPTION_LENGTH): string => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-–—]+$/, "")}…`;
};

const CASE_STUDY_SUFFIX: Localized = { en: "Case Study", fr: "Étude de cas" };
const PROJECTS_CRUMB: Localized = { en: "Projects", fr: "Projets" };

export const getProjectSeo = (
  project: ProjectSeoInput,
  language: SeoLanguage = "en",
  /** Optional translator for catalog text (the page passes `localizePortfolioText`). */
  localize: (text: string, language: SeoLanguage) => string = (text) => text,
): SeoRecord => {
  const summary = project.plainSummary ? localize(project.plainSummary, language) : "";
  return {
    kind: "case-study",
    path: project.caseStudyLink,
    language,
    title: `${project.title} — ${CASE_STUDY_SUFFIX[language]}`,
    description: fitDescription(summary || project.description),
    image: project.imageUrl ? `${SITE_URL}${project.imageUrl}` : defaultImage.image,
    imageAlt: (project.imageAlt && localize(project.imageAlt, language)) || `${project.title} — ${SITE_NAME}`,
    noindex: false,
    breadcrumbs: [
      { name: HOME_CRUMB[language], path: "/" },
      { name: PROJECTS_CRUMB[language], path: "/#projects" },
      { name: project.title, path: project.caseStudyLink },
    ],
    codeRepository: project.githubLink,
  };
};

export const getNotFoundSeo = (language: SeoLanguage = "en"): SeoRecord => ({
  kind: "not-found",
  path: "/404",
  language,
  title: language === "fr" ? "Page introuvable — Tsinjo" : "Page not found — Tsinjo",
  description:
    language === "fr"
      ? "Cette page n’existe pas. Retournez à l’accueil du portfolio de Sandaniaina Tsinjo Nantosoa."
      : "This page does not exist. Return to the portfolio of Sandaniaina Tsinjo Nantosoa.",
  ...defaultImage,
  noindex: true,
  breadcrumbs: [],
});

const authorNode = { "@type": "Person", "@id": PERSON_ID, name: SITE_NAME, url: absoluteUrl("/") };
const siteNode = { "@type": "WebSite", "@id": WEBSITE_ID, name: SITE_NAME, url: absoluteUrl("/") };

/** schema.org graph for a page. Only facts present in the site data are used; no dates, ratings or metrics. */
export const buildJsonLd = (record: SeoRecord): Array<Record<string, unknown>> => {
  if (record.kind === "home" || record.kind === "not-found") return [];
  const url = absoluteUrl(record.path);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: record.breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
  const page: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: record.title,
    description: record.description,
    inLanguage: record.language,
    isPartOf: siteNode,
    author: authorNode,
    breadcrumb: { "@id": `${url}#breadcrumb` },
  };
  if (record.kind === "case-study") {
    page.mainEntity = record.codeRepository
      ? {
          "@type": "SoftwareSourceCode",
          name: record.title.replace(new RegExp(` — ${CASE_STUDY_SUFFIX[record.language]}$`), ""),
          description: record.description,
          codeRepository: record.codeRepository,
          author: authorNode,
        }
      : {
          "@type": "CreativeWork",
          name: record.title.replace(new RegExp(` — ${CASE_STUDY_SUFFIX[record.language]}$`), ""),
          description: record.description,
          author: authorNode,
        };
  }
  return [{ ...breadcrumb, "@id": `${url}#breadcrumb` }, page];
};
