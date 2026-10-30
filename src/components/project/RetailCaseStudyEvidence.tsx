import React from "react";
import { ArrowRight, Bot, CheckCircle2, Database, FileSearch, Gauge, Mic2, ShieldCheck, UserCheck, Workflow } from "lucide-react";
import type { Language } from "@/i18n/I18nProvider";
import type { LocalizedPortfolioText, RetailCaseStudyEvidence as RetailEvidence } from "@/types/portfolio";

interface Props {
  evidence: RetailEvidence;
  language: Language;
  evidenceGallery?: React.ReactNode;
}

const pick = (text: LocalizedPortfolioText, language: Language) => text[language];

const copy = {
  architecture: { en: "System architecture", fr: "Architecture du système" },
  agents: { en: "Multi-agent orchestration", fr: "Orchestration multi-agent" },
  agentsIntro: {
    en: "Two LLM agents coordinate reasoning. Deterministic workflows retain ownership of calculations, state, permissions, and side effects.",
    fr: "Deux agents LLM coordonnent le raisonnement. Les workflows déterministes conservent la responsabilité des calculs, de l’état, des permissions et des effets de bord.",
  },
  boundary: { en: "Control boundary", fr: "Limite de contrôle" },
  tools: { en: "Deterministic tools", fr: "Outils déterministes" },
  kpi: { en: "Deterministic KPI engine", fr: "Moteur KPI déterministe" },
  demoData: { en: "Synthetic P001 demonstration data", fr: "Données de démonstration P001 fictives" },
  thresholds: { en: "Verified alert and risk rules", fr: "Règles d’alerte et de risque vérifiées" },
  rag: { en: "Retail knowledge RAG", fr: "RAG de connaissances retail" },
  sources: { en: "Synthetic demonstration sources", fr: "Sources de démonstration fictives" },
  contract: { en: "Quality investigation contract", fr: "Contrat d’investigation qualité" },
  contractIntro: {
    en: "The agent must separate observed facts from hypotheses. Post-generation code validates the schema, allowed values, sources, and causal wording before the result is accepted.",
    fr: "L’agent doit séparer les faits observés des hypothèses. Un contrôle déterministe valide ensuite le schéma, les valeurs autorisées, les sources et les formulations causales avant d’accepter le résultat.",
  },
  approval: { en: "Human-in-the-loop", fr: "Validation humaine" },
  approve: { en: "APPROVE", fr: "APPROUVER" },
  approveBody: {
    en: "An authorized approval can claim the pending action and trigger configured incident, notification, audit, and case-memory workflows.",
    fr: "Une approbation autorisée peut réclamer l’action en attente et déclencher les workflows configurés d’incident, notification, audit et mémoire de cas.",
  },
  reject: { en: "REJECT", fr: "REFUSER" },
  rejectBody: {
    en: "A rejection records the decision without executing the sensitive operational action.",
    fr: "Un refus enregistre la décision sans exécuter l’action opérationnelle sensible.",
  },
  voice: { en: "Voice interaction path", fr: "Parcours d’interaction vocale" },
  scenarios: { en: "Demonstration walkthrough", fr: "Parcours de démonstration" },
  scenarioEvidence: { en: "Documented synthetic scenarios", fr: "Scénarios fictifs documentés" },
  inventory: { en: "Workflow inventory", fr: "Inventaire des workflows" },
  inventoryIntro: {
    en: "The archive contains 16 workflows: 15 active workflows and one inactive, manually triggered demo-corpus ingestion workflow. This is not a claim of 16 autonomous agents.",
    fr: "L’archive contient 16 workflows : 15 workflows actifs et un workflow inactif d’ingestion manuelle du corpus de démonstration. Cela ne signifie pas qu’il existe 16 agents autonomes.",
  },
  future: { en: "Future improvements", fr: "Améliorations futures" },
} as const;

const ArchitectureDiagram: React.FC<{ language: Language }> = ({ language }) => {
  const stages = [
    { label: "Telegram", kind: language === "fr" ? "Interface texte & voix" : "Text & voice interface", icon: Mic2 },
    { label: "AI Gateway", kind: language === "fr" ? "Autorisation & normalisation" : "Authorization & normalization", icon: ShieldCheck },
    { label: "Supervisor Agent", kind: language === "fr" ? "Agent LLM" : "LLM agent", icon: Bot },
    { label: "Tool Router", kind: language === "fr" ? "Routage déterministe" : "Deterministic routing", icon: Workflow },
    { label: "Quality Investigation", kind: language === "fr" ? "Agent LLM spécialisé" : "Specialized LLM agent", icon: FileSearch },
    { label: language === "fr" ? "Validation humaine" : "Human approval", kind: "APPROVE / REJECT", icon: UserCheck },
  ];
  const systems = ["OpenAI", "Qdrant", "Neon PostgreSQL", "Google Sheets"];
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[var(--surface-1)] p-4 sm:p-6">
      <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
        {stages.map(({ label, kind, icon: Icon }, index) => (
          <li key={label} className="relative min-h-32 border-t-2 border-neon/60 bg-white/[0.025] p-4">
            <Icon className="mb-5 text-neon" size={20} aria-hidden />
            <p className="text-sm font-semibold text-[var(--text-primary)]">{label}</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">{kind}</p>
            {index < stages.length - 1 ? <span className="absolute -right-2 top-1/2 z-10 hidden text-neon/70 xl:block" aria-hidden>→</span> : null}
          </li>
        ))}
      </ol>
      <div className="mt-4 grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-2 lg:grid-cols-4">
        {systems.map((system) => (
          <div key={system} className="flex min-h-11 items-center gap-2 border-l border-white/15 pl-3 font-mono text-xs text-[var(--text-secondary)]">
            <Database size={15} className="text-neon" aria-hidden /> {system}
          </div>
        ))}
      </div>
    </div>
  );
};

const SectionTitle: React.FC<{ icon: React.ElementType; children: React.ReactNode }> = ({ icon: Icon, children }) => (
  <h2 className="mb-4 flex items-center gap-3 text-[1.35rem] font-semibold text-[var(--text-primary)] sm:text-2xl">
    <Icon size={21} className="text-neon" aria-hidden /> {children}
  </h2>
);

const walkthroughStages = [
  { en: "Quality signal", fr: "Signal qualité" },
  { en: "Deterministic KPI", fr: "KPI déterministe" },
  { en: "RAG procedure", fr: "Procédure RAG" },
  { en: "AI investigation", fr: "Investigation IA" },
  { en: "Human approval", fr: "Validation humaine" },
  { en: "Action + audit", fr: "Action + audit" },
] as const;

const RetailCaseStudyEvidence: React.FC<Props> = ({ evidence, language, evidenceGallery }) => (
  <div className="mt-10 space-y-12">
    <aside className="border-l-2 border-neon bg-neon/[0.045] px-5 py-4 text-sm leading-relaxed text-[var(--text-secondary)]" role="note">
      <strong className="text-[var(--text-primary)]">POC · </strong>{pick(evidence.notice, language)}
    </aside>

    <section id="retail-architecture" className="scroll-mt-24" aria-labelledby="retail-architecture-title">
      <SectionTitle icon={Workflow}><span id="retail-architecture-title">{copy.architecture[language]}</span></SectionTitle>
      <ArchitectureDiagram language={language} />
    </section>

    <section id="retail-agents" className="scroll-mt-24" aria-labelledby="retail-agents-title">
      <SectionTitle icon={Bot}><span id="retail-agents-title">{copy.agents[language]}</span></SectionTitle>
      <p className="mb-5 max-w-[78ch] leading-relaxed text-[var(--text-secondary)]">{copy.agentsIntro[language]}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {evidence.agents.map((agent) => (
          <article key={agent.name} className="border-t-2 border-neon/60 bg-[var(--surface-1)] p-5">
            <h3 className="text-lg font-semibold">{agent.name}</h3>
            <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">{pick(agent.role, language)}</p>
            <p className="mt-4 font-mono text-[11px] uppercase text-neon">{copy.boundary[language]}</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{pick(agent.boundary, language)}</p>
          </article>
        ))}
      </div>
      <h3 className="mb-3 mt-6 font-mono text-xs uppercase text-neon">{copy.tools[language]}</h3>
      <ul className="flex flex-wrap gap-2">{evidence.deterministicTools.map((tool) => <li key={tool} className="border border-white/10 px-3 py-2 text-sm text-[var(--text-secondary)]">{tool}</li>)}</ul>
    </section>

    <section id="retail-kpi" className="scroll-mt-24" aria-labelledby="retail-kpi-title">
      <SectionTitle icon={Gauge}><span id="retail-kpi-title">{copy.kpi[language]}</span></SectionTitle>
      <p className="mb-4 font-mono text-xs uppercase text-neon">{copy.demoData[language]}</p>
      <div className="grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-4 lg:grid-cols-6">
        {evidence.kpiMetrics.map((metric) => <div key={metric.label.en} className="min-h-24 bg-[var(--surface-1)] p-4"><p className="font-mono text-xl font-semibold text-neon">{metric.value}</p><p className="mt-2 text-xs leading-snug text-[var(--text-muted)]">{pick(metric.label, language)}</p></div>)}
      </div>
      <h3 className="mb-3 mt-6 text-base font-semibold">{copy.thresholds[language]}</h3>
      <ul className="grid gap-2 sm:grid-cols-2">{evidence.kpiRules.map((rule) => <li key={rule.en} className="border-t border-white/10 pt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{pick(rule, language)}</li>)}</ul>
    </section>

    <div className="grid gap-10 lg:grid-cols-2">
      <section aria-labelledby="retail-rag-title">
        <SectionTitle icon={FileSearch}><span id="retail-rag-title">{copy.rag[language]}</span></SectionTitle>
        <ol className="space-y-3">{evidence.ragSteps.map((step, index) => <li key={step.en} className="flex gap-3 text-sm leading-relaxed text-[var(--text-secondary)]"><span className="font-mono text-neon">{String(index + 1).padStart(2, "0")}</span>{pick(step, language)}</li>)}</ol>
        <p className="mb-2 mt-5 font-mono text-xs uppercase text-neon">{copy.sources[language]}</p>
        <ul className="space-y-1 text-xs text-[var(--text-muted)]">{evidence.ragSources.map((source) => <li key={source}>• {source}</li>)}</ul>
      </section>
      <section aria-labelledby="retail-contract-title">
        <SectionTitle icon={CheckCircle2}><span id="retail-contract-title">{copy.contract[language]}</span></SectionTitle>
        <p className="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">{copy.contractIntro[language]}</p>
        <ul className="grid grid-cols-2 gap-2">{evidence.investigationContract.map((field) => <li key={field} className="border border-white/10 px-3 py-2 font-mono text-xs text-[var(--text-secondary)]">{field}</li>)}</ul>
      </section>
    </div>

    <section aria-labelledby="retail-approval-title">
      <SectionTitle icon={UserCheck}><span id="retail-approval-title">{copy.approval[language]}</span></SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border-l-2 border-neon bg-neon/[0.04] p-5"><h3 className="font-mono text-sm text-neon">{copy.approve[language]}</h3><p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{copy.approveBody[language]}</p></div>
        <div className="border-l-2 border-amber-400/70 bg-amber-400/[0.035] p-5"><h3 className="font-mono text-sm text-amber-300">{copy.reject[language]}</h3><p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{copy.rejectBody[language]}</p></div>
      </div>
    </section>

    <section aria-labelledby="retail-voice-title">
      <SectionTitle icon={Mic2}><span id="retail-voice-title">{copy.voice[language]}</span></SectionTitle>
      <ol className="flex flex-wrap gap-2">{evidence.voiceSteps.map((step, index) => <li key={step} className="flex items-center gap-2"><span className="border border-white/10 px-3 py-2 text-sm text-[var(--text-secondary)]">{step}</span>{index < evidence.voiceSteps.length - 1 ? <span className="text-neon" aria-hidden>→</span> : null}</li>)}</ol>
    </section>

    <section aria-labelledby="retail-scenarios-title">
      <SectionTitle icon={Workflow}><span id="retail-scenarios-title">{copy.scenarios[language]}</span></SectionTitle>
      <ol className="mb-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
        {walkthroughStages.map((stage, index) => (
          <li key={stage.en} className="relative min-h-20 border-t-2 border-neon/60 bg-[var(--surface-1)] px-3 py-4">
            <span className="font-mono text-[11px] text-neon">{String(index + 1).padStart(2, "0")}</span>
            <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{stage[language]}</p>
            {index < walkthroughStages.length - 1 ? (
              <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-neon/70 lg:block" size={18} aria-hidden />
            ) : null}
          </li>
        ))}
      </ol>
      <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-neon">{copy.scenarioEvidence[language]}</h3>
      <ol className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">{evidence.scenarios.map((scenario, index) => <li key={scenario.en} className="flex min-h-20 gap-3 bg-[var(--surface-1)] p-4 text-sm leading-relaxed text-[var(--text-secondary)]"><span className="font-mono text-neon">{String(index + 1).padStart(2, "0")}</span>{pick(scenario, language)}</li>)}</ol>
    </section>

    {evidenceGallery}

    <section aria-labelledby="retail-inventory-title">
      <SectionTitle icon={Database}><span id="retail-inventory-title">{copy.inventory[language]}</span></SectionTitle>
      <p className="mb-5 max-w-[78ch] text-sm leading-relaxed text-[var(--text-secondary)]">{copy.inventoryIntro[language]}</p>
      <div className="grid gap-5 md:grid-cols-3">{evidence.workflowGroups.map((group) => <div key={group.label.en}><h3 className="mb-3 font-mono text-xs uppercase text-neon">{pick(group.label, language)}</h3><ul className="space-y-2 text-sm text-[var(--text-muted)]">{group.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div>
    </section>

    <section aria-labelledby="retail-future-title">
      <SectionTitle icon={ShieldCheck}><span id="retail-future-title">{copy.future[language]}</span></SectionTitle>
      <ul className="grid gap-2 sm:grid-cols-2">{evidence.futureImprovements.map((item) => <li key={item.en} className="border-t border-white/10 pt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{pick(item, language)}</li>)}</ul>
    </section>
  </div>
);

export default RetailCaseStudyEvidence;
