import { ArrowRight, CircleCheck, OctagonX, RotateCcw } from "lucide-react";
import type { AutomationCopy } from "../copy";
import { latestQuote } from "../engine";
import type { AutomationRun } from "../types";
import QuotePanel from "./QuotePanel";

interface Props {
  copy: AutomationCopy;
  run: AutomationRun;
  traceOpen: boolean;
  onToggleTrace: () => void;
  onRestart: () => void;
}

const ResultPanel = ({ copy, run, traceOpen, onToggleTrace, onRestart }: Props) => {
  const completed = run.outcome === "completed";
  const Icon = completed ? CircleCheck : OctagonX;
  const quote = latestQuote(run);
  const executed = run.steps.filter((step) => step.state === "done" || step.state === "rejected");
  const moves = run.trace.filter((event) => event.from && event.to);
  const { input } = run;

  return (
    <section
      aria-labelledby="result-title"
      className={`rounded-lg border p-5 sm:p-7 ${completed ? "border-neon/40 bg-neon/[0.04]" : "border-red-400/40 bg-red-400/[0.04]"}`}
    >
      <p className="font-mono text-xs uppercase text-[var(--text-muted)]">{copy.result.title}</p>
      <h2 id="result-title" className="mt-2 flex items-center gap-2 text-2xl font-semibold">
        <Icon size={24} className={completed ? "text-neon" : "text-[var(--danger)]"} aria-hidden />
        <span data-testid="outcome">{completed ? copy.result.completed : copy.result.rejected}</span>
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
        {completed ? copy.result.completedText : copy.result.rejectedText}
      </p>

      <dl className="mt-6 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {[
          [copy.result.summary, `${input.origin} → ${input.destination} · ${input.passengers} · ${copy.cabins[input.cabin]}`],
          [copy.rfqId, run.rfqId],
          [copy.result.finalStatus, run.status],
          [copy.result.scenarioVersion, run.scenarioVersion],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0 border-t border-white/10 pt-2">
            <dt className="font-mono text-[11px] uppercase text-[var(--text-muted)]">{label}</dt>
            <dd className="mt-0.5 break-words">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="font-mono text-xs uppercase text-neon">{copy.result.decisions}</h3>
          {run.decisions.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--text-muted)]">{copy.result.noDecisions}</p>
          ) : (
            <ol className="mt-2 space-y-1 text-sm">
              {run.decisions.map((decision) => (
                <li key={decision.seq}>
                  {copy.decisionLabels[decision.decision]}
                  <span className="text-[var(--text-muted)]"> · v{decision.quoteVersion}</span>
                </li>
              ))}
            </ol>
          )}

          <h3 className="mt-5 font-mono text-xs uppercase text-neon">
            {copy.result.stepsRun} ({executed.length}/{run.steps.length})
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
            {executed.map((step) => (
              <li key={step.id}>{copy.steps[step.id].business}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase text-neon">{copy.result.transitions}</h3>
          <ol data-testid="transition-history" className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-2 font-mono text-[11px]">
            <li className="text-[var(--text-muted)]">NEW</li>
            {moves.map((event) => (
              <li key={event.seq} className="flex items-center gap-1.5">
                <ArrowRight size={11} className="text-[var(--text-muted)]" aria-hidden />
                <span className="text-[var(--text-secondary)]">{event.to}</span>
              </li>
            ))}
          </ol>
          {completed ? <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">{copy.result.handoff}</p> : null}
        </div>
      </div>

      {quote ? (
        <div className="mt-6 border-t border-white/10 pt-5">
          <h3 className="mb-3 font-mono text-xs uppercase text-neon">{copy.result.quoteData}</h3>
          <QuotePanel copy={copy} quote={quote} selectedOptionId={run.selectedOptionId} />
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-neon px-5 text-sm font-semibold text-black transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
        >
          <RotateCcw size={16} aria-hidden />
          {copy.restart}
        </button>
        <button
          type="button"
          onClick={onToggleTrace}
          aria-expanded={traceOpen}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/20 px-5 text-sm font-semibold transition hover:border-neon/60 hover:text-neon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
        >
          {traceOpen ? copy.hideTrace : copy.viewTrace}
        </button>
      </div>
    </section>
  );
};

export default ResultPanel;
