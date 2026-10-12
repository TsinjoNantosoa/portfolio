import {
  Bot,
  Boxes,
  BrainCircuit,
  Database,
  Globe2,
  ServerCog,
  UserRound,
  Wrench,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const flow = [
  { label: ["Visitor", "Visiteur"], detail: ["Conversation", "Conversation"], icon: UserRound },
  { label: ["React widget", "Widget React"], detail: ["Tenant branding", "Identité du tenant"], icon: Globe2 },
  { label: ["FastAPI", "FastAPI"], detail: ["API & controls", "API et contrôles"], icon: ServerCog },
  { label: ["RAG / Agent", "RAG / Agent"], detail: ["Orchestration", "Orchestration"], icon: BrainCircuit },
  { label: ["LLM", "LLM"], detail: ["Response / choice", "Réponse / choix"], icon: Bot },
  { label: ["Approved tools", "Outils approuvés"], detail: ["Validated calls", "Appels validés"], icon: Wrench },
  { label: ["Business services", "Services métier"], detail: ["CRM · Teams · SMTP", "CRM · Teams · SMTP"], icon: Boxes },
] as const;

const stores = [
  { name: "Qdrant", detail: ["Tenant-scoped vectors", "Vecteurs isolés par tenant"] },
  { name: "PostgreSQL", detail: ["Config & application data", "Configuration et données applicatives"] },
  { name: "Redis", detail: ["Sessions & transient state", "Sessions et état transitoire"] },
] as const;

const ArchitectureDiagram = () => {
  const { language } = useI18n();
  const languageIndex = language === "fr" ? 1 : 0;

  return (
    <figure
      className="architecture-diagram rounded-2xl border border-white/10 bg-[var(--surface-1)] p-4 sm:p-6"
      aria-labelledby="architecture-diagram-title"
    >
      <figcaption id="architecture-diagram-title" className="mb-5">
        <span className="eyebrow">
          {language === "fr" ? "Flux de la plateforme" : "Platform flow"}
        </span>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--text-muted)]">
          {language === "fr"
            ? "Le chemin RAG répond à partir de connaissances isolées. Le chemin agentique peut sélectionner des outils approuvés, mais les validations et l’exécution restent côté serveur."
            : "The RAG path answers from isolated knowledge. The agent path may select approved tools, while validation and execution remain server-controlled."}
        </p>
      </figcaption>

      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7" aria-label={language === "fr" ? "Architecture de gauche à droite" : "Architecture from left to right"}>
        {flow.map(({ label, detail, icon: Icon }, index) => (
          <li key={label[0]} className="relative min-w-0">
            <div className="flex h-full min-h-[106px] flex-col justify-between rounded-xl border border-white/10 bg-[var(--surface-2)] p-3.5">
              <div className="flex items-center justify-between gap-2">
                <Icon className="h-4 w-4 shrink-0 text-neon" aria-hidden />
                <span className="font-mono text-[10px] text-[var(--text-muted)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{label[languageIndex]}</p>
                <p className="mt-1 text-[11px] leading-snug text-[var(--text-muted)]">{detail[languageIndex]}</p>
              </div>
            </div>
            {index < flow.length - 1 ? (
              <span className="architecture-arrow" aria-hidden>→</span>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="mt-4 grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-3 lg:ml-[28.5%] lg:w-[43%]">
        {stores.map((store) => (
          <div key={store.name} className="rounded-lg border border-neon/15 bg-neon/[0.035] p-3">
            <div className="flex items-center gap-2">
              <Database className="h-3.5 w-3.5 text-neon" aria-hidden />
              <p className="font-mono text-xs font-semibold text-[var(--text-primary)]">{store.name}</p>
            </div>
            <p className="mt-1.5 text-[10.5px] leading-snug text-[var(--text-muted)]">{store.detail[languageIndex]}</p>
          </div>
        ))}
      </div>
    </figure>
  );
};

export default ArchitectureDiagram;
