import type { Language } from "@/i18n/I18nProvider";
import type { AssistantSource, SuggestedLink } from "./assistant-types";

/**
 * The service returns source titles, section names, link labels and follow-up questions from the portfolio
 * knowledge base, in English. When the visitor writes in French these are shown in French. Strings that are
 * not listed here (a new document, say) are shown as returned, so nothing is lost or invented.
 * Project and product names stay as they are written on the site.
 */

const normalize = (text: string) => text.replace(/[–—�]/g, "—").trim();

const TITLES: Record<string, string> = {
  "AI Agents & Agentic Systems": "Agents IA et systèmes agentiques",
  "AI Automation": "Automatisation IA",
  "AI Automation & Backend Engineering": "Automatisation IA et ingénierie backend",
  "AI Automation & Integration": "Automatisation IA et intégration",
  "AI Automation Consultant at Freelance / Project-based": "Consultant en automatisation IA, freelance / missions",
  "AI Engineer — Generative AI, RAG & AI Agents at Humans4Help Madagascar": "Ingénieur IA — IA générative, RAG et agents IA chez Humans4Help Madagascar",
  "AI engineering beyond the prototype.": "L’ingénierie IA au-delà du prototype.",
  "AI-Assisted Development": "Développement assisté par IA",
  "Additional certifications": "Certifications complémentaires",
  "Agentic AI": "IA agentique",
  "Backend Engineering": "Ingénierie backend",
  "CRM & Business Automation — Odoo 18 at ETS Baron": "CRM et automatisation métier — Odoo 18 chez ETS Baron",
  "Contact and public profiles": "Contact et profils publics",
  "Data & Vector Databases": "Données et bases vectorielles",
  "Data Engineering & Machine Learning": "Ingénierie des données et machine learning",
  "DevOps & Infrastructure": "DevOps et infrastructure",
  Education: "Formation",
  "Featured certifications": "Certifications principales",
  "Frontend Engineering": "Ingénierie frontend",
  "Generative AI & Agentic Systems": "IA générative et systèmes agentiques",
  Languages: "Langues",
  "Production Engineering": "Ingénierie de production",
  "Production RAG Systems": "Systèmes RAG en production",
  "RAG Engineering": "Ingénierie RAG",
};

const SECTIONS: Record<string, string> = {
  "Controls, evidence and stack": "Contrôles, preuves et stack",
  Credentials: "Titres et certifications",
  "Current limitations": "Limites actuelles",
  Degrees: "Diplômes",
  "Deterministic lead scoring": "Scoring déterministe des leads",
  "Engineering contributions": "Contributions d’ingénierie",
  "Engineering decisions": "Décisions d’ingénierie",
  "Evaluation and testing": "Évaluation et tests",
  Overview: "Vue d’ensemble",
  "Problem and solution": "Problème et solution",
  "Professional languages": "Langues professionnelles",
  "Professional positioning": "Positionnement professionnel",
  "Project overview": "Vue d’ensemble du projet",
  "Public links": "Liens publics",
  "Role overview": "Aperçu du poste",
  "Stack and public evidence": "Stack et preuves publiques",
  "Technical skills": "Compétences techniques",
  "n8n workflow automation": "Automatisation de workflows n8n",
};

const LABELS: Record<string, string> = {
  "Contact Tsinjo": "Contacter Tsinjo",
  "Open live demo": "Ouvrir la démo en ligne",
  "View GitHub": "Voir GitHub",
  "View GitHub repository": "Voir le dépôt GitHub",
  "View LinkedIn": "Voir LinkedIn",
};

const QUESTIONS: Record<string, string> = {
  "How are engineering claims validated?": "Comment les affirmations d’ingénierie sont-elles validées ?",
  "How did Tsinjo validate RAG quality?": "Comment Tsinjo a-t-il validé la qualité du RAG ?",
  "How does AI BOS control agent actions?": "Comment AI BOS contrôle-t-il les actions des agents ?",
  "How does Human-in-the-Loop protect sales actions?": "Comment la validation humaine protège-t-elle les actions commerciales ?",
  "How does Human-in-the-Loop work in Arcwell?": "Comment fonctionne la validation humaine dans Arcwell ?",
  "How does Human-in-the-Loop work in Offshore Fares?": "Comment fonctionne la validation humaine dans Offshore Fares ?",
  "How does Offshore Fares protect fare prices?": "Comment Offshore Fares protège-t-il les tarifs ?",
  "How does SIHIA's hybrid retrieval work?": "Comment fonctionne la recherche hybride de SIHIA ?",
  "How was tenant isolation implemented?": "Comment l’isolation des tenants a-t-elle été mise en œuvre ?",
  "What AI certifications does Tsinjo have?": "Quelles certifications IA Tsinjo possède-t-il ?",
  "What are Tsinjo's strongest engineering projects?": "Quels sont les projets d’ingénierie les plus solides de Tsinjo ?",
  "What are his strongest engineering skills?": "Quelles sont ses compétences d’ingénierie les plus solides ?",
  "What automation tools does Tsinjo use?": "Quels outils d’automatisation Tsinjo utilise-t-il ?",
  "What backend technologies does Tsinjo use?": "Quelles technologies backend Tsinjo utilise-t-il ?",
  "What do the 18 n8n workflows orchestrate?": "Que font les 18 workflows n8n ?",
  "What is Tsinjo's education?": "Quelle est la formation de Tsinjo ?",
  "What is Tsinjo's production experience?": "Quelle est l’expérience de Tsinjo en production ?",
  "What is Tsinjo's professional experience?": "Quelle est l’expérience professionnelle de Tsinjo ?",
  "What is the AI BOS architecture?": "Quelle est l’architecture d’AI BOS ?",
  "What limitations are documented?": "Quelles limites sont documentées ?",
  "What production experience supports these skills?": "Quelle expérience en production appuie ces compétences ?",
  "What stack powered the RAG platform?": "Quelle stack alimente la plateforme RAG ?",
  "What technical decisions did Tsinjo make?": "Quelles décisions techniques Tsinjo a-t-il prises ?",
  "Which flagship project uses related technologies?": "Quel projet phare utilise des technologies proches ?",
  "Which n8n workflows does AI Sales use?": "Quels workflows n8n AI Sales utilise-t-il ?",
  "Which other project uses LangGraph?": "Quel autre projet utilise LangGraph ?",
  "Which other project uses AI agents?": "Quel autre projet utilise des agents IA ?",
  "Which other agentic projects are in the portfolio?": "Quels autres projets agentiques sont dans le portfolio ?",
  "Which projects best demonstrate this experience?": "Quels projets illustrent le mieux cette expérience ?",
  "Which projects demonstrate AI Automation?": "Quels projets illustrent l’automatisation IA ?",
  "Which projects demonstrate AI-Assisted Development?": "Quels projets illustrent le développement assisté par IA ?",
  "Which projects demonstrate Agentic AI?": "Quels projets illustrent l’IA agentique ?",
  "Which projects demonstrate Production Engineering?": "Quels projets illustrent l’ingénierie de production ?",
  "Which projects demonstrate RAG Engineering?": "Quels projets illustrent l’ingénierie RAG ?",
  "Which projects demonstrate his AI engineering skills?": "Quels projets illustrent ses compétences en ingénierie IA ?",
  "Which projects demonstrate multi-tenancy?": "Quels projets illustrent le multi-tenant ?",
  "Which projects demonstrate this experience?": "Quels projets illustrent cette expérience ?",
  "Which projects demonstrate this expertise?": "Quels projets illustrent cette expertise ?",
  "Which projects should I review first?": "Quels projets dois-je consulter en premier ?",
  "Which projects use Qdrant?": "Quels projets utilisent Qdrant ?",
  "Which projects use these technologies?": "Quels projets utilisent ces technologies ?",
  "Which technologies supported this work?": "Quelles technologies ont soutenu ce travail ?",
  "Why are policy checks deterministic?": "Pourquoi les contrôles de règles sont-ils déterministes ?",
  "Why does SIHIA use reranking?": "Pourquoi SIHIA utilise-t-il un reranking ?",
  "Why is lead scoring outside the LLM?": "Pourquoi le scoring des leads est-il hors du LLM ?",
  "How does Human-in-the-Loop work?": "Comment fonctionne la validation humaine (HITL) ?",
  "How is RAG secured and evaluated?": "Comment le RAG est-il sécurisé et évalué ?",
};

const localizeTitle = (title: string) => TITLES[normalize(title)] ?? title;
const localizeSection = (section: string) => SECTIONS[section.trim()] ?? section;

const localizeLabel = (label: string) => {
  const key = normalize(label);
  if (LABELS[key]) return LABELS[key];
  const caseStudy = key.match(/^View (.+) case study$/);
  if (caseStudy) return `Voir l’étude de cas ${caseStudy[1]}`;
  const compare = key.match(/^Compare with (.+)$/);
  if (compare) return `Comparer avec ${compare[1]}`;
  const view = key.match(/^View (.+)$/);
  if (view) return `Voir ${localizeTitle(view[1])}`;
  return label;
};

const localizeQuestion = (question: string) => QUESTIONS[question.trim()] ?? question;

export function localizeAssistantMetadata(
  metadata: { sources: AssistantSource[]; suggestedLinks: SuggestedLink[]; suggestedQuestions: string[] },
  language: Language,
) {
  if (language !== "fr") return metadata;
  return {
    sources: metadata.sources.map((source) => ({
      ...source,
      title: localizeTitle(source.title),
      section: source.section ? localizeSection(source.section) : source.section,
    })),
    suggestedLinks: metadata.suggestedLinks.map((link) => ({ ...link, label: localizeLabel(link.label) })),
    suggestedQuestions: metadata.suggestedQuestions.map(localizeQuestion),
  };
}
