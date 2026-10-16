import { ChevronDown } from "lucide-react";
import type { Language } from "@/i18n/I18nProvider";
import type { PlaygroundResponse } from "./types";

export default function EngineeringInsights({
  response,
  language,
}: {
  response: PlaygroundResponse;
  language: Language;
}) {
  const isFrench = language === "fr";
  return (
    <details className="group border-y border-white/10 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
        <span>{isFrench ? "Détails d’ingénierie" : "Engineering insights"}</span>
        <ChevronDown className="h-4 w-4 text-neon transition group-open:rotate-180" aria-hidden />
      </summary>
      <div className="mt-5 grid gap-6 md:grid-cols-[0.75fr_1.25fr]">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <div>
            <dt className="text-[var(--text-muted)]">{isFrench ? "Mode" : "Mode"}</dt>
            <dd className="mt-1 font-mono text-xs text-neon">{response.execution_mode}</dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">{isFrench ? "Passages" : "Passages"}</dt>
            <dd className="mt-1 font-mono text-xs">{response.selected_passages}</dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">{isFrench ? "Durée totale" : "Total time"}</dt>
            <dd className="mt-1 font-mono text-xs">{response.response_time_ms.toFixed(1)} ms</dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">Request ID</dt>
            <dd className="mt-1 break-all font-mono text-[10px]">{response.request_id}</dd>
          </div>
        </dl>
        <div>
          <p className="text-xs uppercase text-[var(--text-muted)]">
            {isFrench ? "Stratégie observée" : "Observed strategy"}
          </p>
          <p className="mt-2 text-sm leading-relaxed">{response.retrieval_strategy}</p>
          <p className="mt-4 text-xs uppercase text-[var(--text-muted)]">
            {isFrench ? "Limites" : "Limitations"}
          </p>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            {response.limitations.map((limitation) => (
              <li key={limitation} className="border-l border-neon/40 pl-3">{limitation}</li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}
