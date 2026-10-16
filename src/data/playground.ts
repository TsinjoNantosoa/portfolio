import type { Language } from "@/i18n/I18nProvider";
import type { PlaygroundCorpus, PlaygroundStepId } from "@/features/playground/types";

export const playgroundCorpora: Array<{
  id: PlaygroundCorpus;
  label: Record<Language, string>;
  description: Record<Language, string>;
}> = [
  {
    id: "projects",
    label: { en: "Public case studies", fr: "Études de cas publiques" },
    description: {
      en: "Published project architecture, decisions, tests, and limitations.",
      fr: "Architecture, décisions, tests et limites publiés des projets.",
    },
  },
  {
    id: "engineering_lab",
    label: { en: "AI Engineering Lab", fr: "AI Engineering Lab" },
    description: {
      en: "Documented RAG, agentic AI, automation, and production practices.",
      fr: "Pratiques documentées en RAG, agents IA, automatisation et production.",
    },
  },
];

export const playgroundQuestions: Record<
  PlaygroundCorpus,
  Record<Language, string[]>
> = {
  projects: {
    en: [
      "How does SIHIA combine dense and lexical retrieval?",
      "How does Arcwell govern sensitive agent actions?",
      "What are the current limitations of AI BOS?",
    ],
    fr: [
      "Comment SIHIA combine-t-il recherche dense et lexicale ?",
      "Comment Arcwell gouverne-t-il les actions sensibles des agents ?",
      "Quelles sont les limites actuelles d’AI BOS ?",
    ],
  },
  engineering_lab: {
    en: [
      "What makes a RAG capability publishable in this Lab?",
      "Which controls are used for governed AI agents?",
      "How is AI automation prepared for production?",
    ],
    fr: [
      "Qu’est-ce qui rend une capacité RAG publiable dans ce Lab ?",
      "Quels contrôles sont utilisés pour les agents IA gouvernés ?",
      "Comment l’automatisation IA est-elle préparée pour la production ?",
    ],
  },
};

export const playgroundStepLabels: Record<
  PlaygroundStepId,
  Record<Language, string>
> = {
  query: { en: "User Query", fr: "Question utilisateur" },
  processing: { en: "Query Processing", fr: "Traitement de la question" },
  retrieval: { en: "Retrieval", fr: "Recherche" },
  context: { en: "Retrieved Context", fr: "Contexte retrouvé" },
  generation: { en: "LLM Generation", fr: "Génération LLM" },
  answer: { en: "Grounded Answer", fr: "Réponse fondée" },
  citations: { en: "Citations", fr: "Citations" },
};
