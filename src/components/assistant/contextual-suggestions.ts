import { featuredProjects } from "@/data/projects";
import type { Language } from "@/i18n/I18nProvider";
import type { AssistantSource, SuggestedLink } from "./assistant-types";
import { isSafeAssistantUrl } from "./SourceCards";

const AGENT_SLUGS = new Set([
  "arcwell-agentic-crm",
  "ai-business-os",
  "ai-sales-assistant",
]);

function slugFromSource(sources: AssistantSource[]): string | undefined {
  for (const source of sources) {
    const match = source.url.match(/^\/work\/([^/?#]+)/);
    if (match?.[1]) return match[1];
  }
  return undefined;
}

function mergeLinks(
  primary: SuggestedLink[],
  extra: SuggestedLink[],
  limit: number,
): SuggestedLink[] {
  const seen = new Set<string>();
  const out: SuggestedLink[] = [];
  for (const link of [...primary, ...extra]) {
    if (!isSafeAssistantUrl(link.url) || seen.has(link.url)) continue;
    seen.add(link.url);
    out.push(link);
    if (out.length >= limit) break;
  }
  return out;
}

function mergeQuestions(primary: string[], extra: string[], limit: number): string[] {
  const seen = new Set(primary.map((q) => q.toLowerCase()));
  const out = [...primary];
  for (const question of extra) {
    const key = question.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(question);
    if (out.length >= limit) break;
  }
  return out.slice(0, limit);
}

export function enrichAssistantMetadata(
  sources: AssistantSource[],
  suggestedLinks: SuggestedLink[],
  suggestedQuestions: string[],
  language: Language,
) {
  const slug = slugFromSource(sources);
  const project = slug
    ? featuredProjects.find((item) => item.slug === slug)
    : undefined;

  const extraLinks: SuggestedLink[] = [];
  const extraQuestions: string[] = [];

  if (project?.caseStudyLink) {
    extraLinks.push({
      label:
        language === "fr"
          ? `Voir l’étude de cas ${project.title.split("—")[0].trim()}`
          : `View ${project.title.split("—")[0].trim()} case study`,
      url: project.caseStudyLink,
    });
  }

  if (slug === "arcwell-agentic-crm") {
    extraQuestions.push(
      language === "fr"
        ? "Comment fonctionne la validation humaine (HITL) ?"
        : "How does Human-in-the-Loop work?",
    );
    extraQuestions.push(
      language === "fr"
        ? "Quels autres projets utilisent des agents IA ?"
        : "Which other project uses AI agents?",
    );
  } else if (slug && AGENT_SLUGS.has(slug)) {
    extraQuestions.push(
      language === "fr"
        ? "Quels autres projets agentiques sont dans le portfolio ?"
        : "Which other agentic projects are in the portfolio?",
    );
  } else if (slug === "multi-tenant-rag" || slug === "sihia") {
    extraQuestions.push(
      language === "fr"
        ? "Comment le RAG est-il sécurisé et évalué ?"
        : "How is RAG secured and evaluated?",
    );
  }

  const otherAgent = featuredProjects.find(
    (item) => AGENT_SLUGS.has(item.slug) && item.slug !== slug,
  );
  if (otherAgent?.caseStudyLink && slug && AGENT_SLUGS.has(slug)) {
    extraLinks.push({
      label:
        language === "fr"
          ? `Comparer avec ${otherAgent.title.split("—")[0].trim()}`
          : `Compare with ${otherAgent.title.split("—")[0].trim()}`,
      url: otherAgent.caseStudyLink,
    });
  }

  const suggestedLinksOut = mergeLinks(suggestedLinks, extraLinks, 3);

  return {
    sources: sources.slice(0, 3),
    suggestedLinks: suggestedLinksOut,
    suggestedQuestions: mergeQuestions(suggestedQuestions, extraQuestions, 4),
  };
}
