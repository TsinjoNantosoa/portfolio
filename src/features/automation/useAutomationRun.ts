import { useCallback, useEffect, useState } from "react";
import { AutomationValidationError, runUntilGate } from "./engine";
import { simulatedAutomationRunner, type AutomationRunner } from "./runner";
import type { ApprovalDecision, AutomationRun, Scenario, ValidationIssue } from "./types";

/** Delay between automatic steps. This is an interface delay, never a production metric. */
export const STEP_DELAY_MS = 650;

export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(() => {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    let query: MediaQueryList;
    try {
      query = window.matchMedia("(prefers-reduced-motion: reduce)");
    } catch {
      return undefined;
    }
    const onChange = () => setReduced(query.matches);
    query.addEventListener?.("change", onChange);
    return () => query.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
};

export const useAutomationRun = (runner: AutomationRunner = simulatedAutomationRunner) => {
  const [run, setRun] = useState<AutomationRun | null>(null);
  const [autoplay, setAutoplay] = useState(true);
  const reducedMotion = usePrefersReducedMotion();

  const start = useCallback(
    (scenario: Scenario): ValidationIssue[] => {
      try {
        setRun(runner.start(scenario));
        return [];
      } catch (error) {
        if (error instanceof AutomationValidationError) return error.issues;
        throw error;
      }
    },
    [runner],
  );

  const step = useCallback(
    () =>
      setRun((current) => {
        if (!current || current.awaitingApproval || current.outcome) return current;
        return runner.advance(current);
      }),
    [runner],
  );

  const skipToApproval = useCallback(
    () => setRun((current) => (current && !current.outcome ? runUntilGate(current) : current)),
    [],
  );

  const decide = useCallback(
    (decision: ApprovalDecision) =>
      setRun((current) => {
        if (!current) return current;
        try {
          return runner.decide(current, decision);
        } catch {
          // The engine refuses decisions that are not valid right now; keep the visible state unchanged.
          return current;
        }
      }),
    [runner],
  );

  const reset = useCallback(() => setRun(null), []);

  const running = Boolean(run && !run.awaitingApproval && !run.outcome);

  useEffect(() => {
    if (!running || !autoplay) return undefined;
    const timer = window.setTimeout(step, reducedMotion ? 0 : STEP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [run, running, autoplay, reducedMotion, step]);

  return { run, running, autoplay, setAutoplay, reducedMotion, start, step, skipToApproval, decide, reset };
};
