import { useEffect, useRef } from "react";
import { Check, RefreshCcw, X } from "lucide-react";
import type { AutomationCopy } from "../copy";
import { canRevise, latestQuote, revisionsUsed } from "../engine";
import { MAX_REVISIONS } from "../rules";
import type { ApprovalDecision, AutomationRun } from "../types";
import QuotePanel from "./QuotePanel";

interface Props {
  copy: AutomationCopy;
  run: AutomationRun;
  onDecide: (decision: ApprovalDecision) => void;
}

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon disabled:cursor-not-allowed disabled:opacity-50";

const ApprovalPanel = ({ copy, run, onDecide }: Props) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const quote = latestQuote(run);
  const version = quote?.version;
  const revisionAllowed = canRevise(run);
  const left = MAX_REVISIONS - revisionsUsed(run);

  // Move focus to the decision area whenever a new quote version needs a decision.
  useEffect(() => {
    headingRef.current?.focus();
  }, [version]);

  if (!quote) return null;

  return (
    <section
      aria-labelledby="approval-title"
      className="rounded-lg border border-amber-300/50 bg-amber-300/[0.04] p-5 sm:p-7"
    >
      <h2 id="approval-title" ref={headingRef} tabIndex={-1} className="font-mono text-xs uppercase text-[var(--warn)] outline-none">
        {copy.approval.title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">{copy.approval.description}</p>

      <div className="mt-5">
        <QuotePanel copy={copy} quote={quote} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <button
            type="button"
            onClick={() => onDecide("approve")}
            aria-describedby="approve-hint"
            className={`${buttonBase} w-full bg-neon text-black hover:brightness-110`}
          >
            <Check size={16} aria-hidden />
            {copy.approval.approve}
          </button>
          <p id="approve-hint" className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
            {copy.approval.approveHint}
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => onDecide("revise")}
            disabled={!revisionAllowed}
            aria-describedby="revise-hint"
            className={`${buttonBase} w-full border border-white/20 hover:border-neon/60 hover:text-neon`}
          >
            <RefreshCcw size={16} aria-hidden />
            {copy.approval.revise}
          </button>
          <p id="revise-hint" className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
            {copy.approval.reviseHint} {revisionAllowed ? copy.approval.reviseLeft(left) : copy.approval.reviseDisabled}
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => onDecide("reject")}
            aria-describedby="reject-hint"
            className={`${buttonBase} w-full border border-red-400/50 text-[var(--danger)] hover:bg-red-400/10`}
          >
            <X size={16} aria-hidden />
            {copy.approval.reject}
          </button>
          <p id="reject-hint" className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
            {copy.approval.rejectHint}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ApprovalPanel;
