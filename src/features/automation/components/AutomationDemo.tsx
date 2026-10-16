import { useEffect, useState } from "react";
import { FastForward, RotateCcw, StepForward } from "lucide-react";
import { automationCopy, describeTrace } from "../copy";
import { latestQuote, nextPendingStep } from "../engine";
import { useAutomationRun } from "../useAutomationRun";
import ApprovalPanel from "./ApprovalPanel";
import RequestFileCard from "./RequestFileCard";
import ResultPanel from "./ResultPanel";
import ScenarioPicker from "./ScenarioPicker";
import TracePanel from "./TracePanel";
import WorkflowVisualizer, { type WorkflowView } from "./WorkflowVisualizer";

interface Props {
  language: "en" | "fr";
}

const controlClass =
  "inline-flex min-h-11 items-center gap-2 rounded-md border border-white/20 px-4 text-sm font-semibold transition hover:border-neon/60 hover:text-neon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon";

const AutomationDemo = ({ language }: Props) => {
  const copy = automationCopy[language];
  const { run, running, autoplay, setAutoplay, start, step, skipToApproval, decide, reset } = useAutomationRun();
  const [view, setView] = useState<WorkflowView>("business");
  const [traceOpen, setTraceOpen] = useState(false);

  useEffect(() => {
    if (!run) setTraceOpen(false);
  }, [run]);

  const restart = () => {
    setTraceOpen(false);
    reset();
  };

  if (!run) {
    return (
      <div id="demo" className="scroll-mt-24 space-y-6">
        <ScenarioPicker copy={copy} onRun={start} />
        <p className="text-sm text-[var(--text-muted)]">{copy.noRun}</p>
      </div>
    );
  }

  const quote = latestQuote(run);
  const lastEvent = run.trace[run.trace.length - 1];
  const activeStep = running && autoplay ? nextPendingStep(run) : undefined;

  return (
    <div id="demo" className="scroll-mt-24 space-y-6">
      <div aria-live="polite" className="sr-only" data-testid="live-region">
        {lastEvent ? describeTrace(language, lastEvent) : ""}
      </div>

      <section aria-labelledby="workflow-title" className="rounded-lg border border-white/10 bg-[var(--surface-1)] p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="workflow-title" className="font-mono text-xs uppercase text-neon">
            {copy.workflow} · <span className="text-[var(--text-secondary)]">{run.rfqId}</span>
          </h2>
          <div role="group" aria-label={copy.viewSwitch} className="inline-flex overflow-hidden rounded-md border border-white/15">
            {(["business", "engineering"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={view === option}
                onClick={() => setView(option)}
                className={`min-h-11 px-4 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon ${
                  view === option ? "bg-neon text-black" : "hover:text-neon"
                }`}
              >
                {option === "business" ? copy.businessView : copy.engineeringView}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={autoplay} onChange={(event) => setAutoplay(event.target.checked)} />
            {copy.autoplay}
          </label>
          {running && !autoplay ? (
            <button type="button" onClick={step} className={controlClass}>
              <StepForward size={16} aria-hidden />
              {copy.nextStep}
            </button>
          ) : null}
          {running ? (
            <button type="button" onClick={skipToApproval} className={controlClass}>
              <FastForward size={16} aria-hidden />
              {copy.skipToApproval}
            </button>
          ) : null}
          {!run.outcome ? (
            <button type="button" onClick={restart} className={controlClass}>
              <RotateCcw size={16} aria-hidden />
              {copy.restart}
            </button>
          ) : null}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <WorkflowVisualizer copy={copy} language={language} run={run} view={view} activeStep={activeStep} />
          <div className="lg:sticky lg:top-24 lg:self-start">
            <RequestFileCard copy={copy} run={run} />
          </div>
        </div>
      </section>

      {run.awaitingApproval && quote ? <ApprovalPanel copy={copy} run={run} onDecide={decide} /> : null}

      {run.outcome ? (
        <ResultPanel
          copy={copy}
          run={run}
          traceOpen={traceOpen}
          onToggleTrace={() => setTraceOpen((open) => !open)}
          onRestart={restart}
        />
      ) : null}

      {traceOpen && run.outcome ? <TracePanel copy={copy} language={language} run={run} /> : null}
    </div>
  );
};

export default AutomationDemo;
