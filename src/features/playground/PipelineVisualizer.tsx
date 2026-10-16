import { Check, CircleDashed, Minus, X } from "lucide-react";
import { playgroundStepLabels } from "@/data/playground";
import type { Language } from "@/i18n/I18nProvider";
import type { PlaygroundTraceStep } from "./types";

const statusIcon = {
  completed: Check,
  skipped: Minus,
  error: X,
};

export default function PipelineVisualizer({
  trace,
  language,
}: {
  trace: PlaygroundTraceStep[];
  language: Language;
}) {
  if (!trace.length) {
    return (
      <p className="border-l border-white/15 pl-4 text-sm text-[var(--text-muted)]">
        {language === "fr"
          ? "Le pipeline apparaîtra après une exécution réelle."
          : "The pipeline will appear after a real execution."}
      </p>
    );
  }

  return (
    <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7" aria-label={language === "fr" ? "Trace du pipeline RAG" : "RAG pipeline trace"}>
      {trace.map((step, index) => {
        const Icon = statusIcon[step.status] || CircleDashed;
        return (
          <li key={step.id} className="min-w-0 border-t border-white/15 pt-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-neon">0{index + 1}</span>
              <Icon
                size={14}
                className={step.status === "completed" ? "text-neon" : "text-[var(--text-muted)]"}
                aria-hidden
              />
            </div>
            <h3 className="mt-2 text-sm font-semibold tracking-normal">
              {playgroundStepLabels[step.id][language]}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">{step.detail}</p>
            {step.duration_ms != null && step.duration_ms > 0 ? (
              <p className="mt-2 font-mono text-[10px] text-[var(--text-secondary)]">
                {step.duration_ms.toFixed(1)} ms
              </p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
