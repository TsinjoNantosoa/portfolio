import { ArrowRight, CheckCircle2, Circle, Loader2, UserCheck, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { describeTrace, type AutomationCopy } from "../copy";
import { allowedFrom } from "../transitions";
import type { AutomationRun, StepId, StepRecord } from "../types";

export type WorkflowView = "business" | "engineering";
type VisualState = "pending" | "active" | "done" | "waiting" | "rejected";

const stateIcon: Record<VisualState, LucideIcon> = {
  pending: Circle,
  active: Loader2,
  done: CheckCircle2,
  waiting: UserCheck,
  rejected: XCircle,
};

const stateColor: Record<VisualState, string> = {
  pending: "text-[var(--text-muted)]",
  active: "text-neon",
  done: "text-neon",
  waiting: "text-[var(--warn)]",
  rejected: "text-[var(--danger)]",
};

interface Props {
  copy: AutomationCopy;
  language: "en" | "fr";
  run: AutomationRun;
  view: WorkflowView;
  activeStep?: StepId;
}

const visualState = (step: StepRecord, activeStep?: StepId): VisualState =>
  step.state === "pending" && step.id === activeStep ? "active" : step.state;

const WorkflowVisualizer = ({ copy, language, run, view, activeStep }: Props) => {
  const done = run.steps.filter((step) => step.state === "done").length;
  const percent = Math.round((done / run.steps.length) * 100);
  const nextStatuses = allowedFrom(run.status);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-white/10 bg-[var(--bg-primary)] px-3 py-2">
        <span className="font-mono text-[11px] uppercase text-[var(--text-muted)]">{copy.rfqStatus}</span>
        <span data-testid="rfq-status" className="font-mono text-sm text-neon">
          {run.status}
        </span>
        <span
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label={copy.workflow}
          className="ml-auto h-1.5 w-28 overflow-hidden rounded-full bg-white/10"
        >
          <span className="block h-full bg-neon transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${percent}%` }} />
        </span>
      </div>

      {view === "engineering" ? (
        <p className="mb-4 text-xs leading-relaxed text-[var(--text-muted)]">
          <span className="font-mono uppercase">{copy.allowedNext}: </span>
          <span className="font-mono text-[var(--text-secondary)]">{nextStatuses.join(" · ") || "—"}</span>
        </p>
      ) : null}

      <ol className="space-y-1">
        {run.steps.map((step, index) => {
          const state = visualState(step, activeStep);
          const Icon = stateIcon[state];
          const events = run.trace.filter((event) => event.step === step.id);
          const label = copy.steps[step.id][view];
          const isAi = step.id === "ai_classified" || step.id === "ai_extracted";
          return (
            <li
              key={step.id}
              data-step={step.id}
              data-state={state}
              aria-current={state === "active" || state === "waiting" ? "step" : undefined}
              className={`rounded-md border px-3 py-3 transition-colors ${
                state === "waiting" ? "border-amber-300/50 bg-amber-300/[0.05]" : state === "pending" ? "border-transparent opacity-60" : "border-white/10"
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  size={18}
                  className={`mt-0.5 shrink-0 ${stateColor[state]} ${state === "active" ? "animate-spin motion-reduce:animate-none" : ""}`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-medium">{label}</span>
                    {isAi && state !== "pending" ? (
                      <span className="rounded-full border border-amber-400/40 px-2 py-0.5 font-mono text-[10px] text-[var(--warn)]">
                        {step.id === "ai_classified" ? copy.simulatedAi : copy.simulatedAiExtract}
                      </span>
                    ) : null}
                    <span className={`ml-auto font-mono text-[11px] ${stateColor[state]}`}>{copy.stateLabels[state]}</span>
                  </div>

                  {events.length > 0 ? (
                    <ul className="mt-2 space-y-1.5">
                      {events.map((event) => (
                        <li key={event.seq} className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
                          {view === "engineering" && event.from && event.to ? (
                            <span className="mr-2 inline-flex items-center gap-1 font-mono text-[11px] text-neon">
                              {event.from}
                              <ArrowRight size={11} aria-hidden />
                              {event.to}
                            </span>
                          ) : null}
                          {describeTrace(language, event)}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {view === "engineering" && step.payload ? (
                    <details className="mt-2">
                      <summary className="inline-flex min-h-9 cursor-pointer items-center text-xs text-neon">{copy.payload}</summary>
                      <p className="mt-1 text-[11px] text-[var(--text-muted)]">{copy.payloadNote}</p>
                      <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-[var(--bg-primary)] p-3 font-mono text-[11px] leading-relaxed text-[var(--text-secondary)]">
                        {JSON.stringify(step.payload, null, 2)}
                      </pre>
                    </details>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default WorkflowVisualizer;
