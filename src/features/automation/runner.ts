import { advance, decide, startRun } from "./engine";
import type { ApprovalDecision, AutomationRun, Scenario } from "./types";

/**
 * Seam for a future backend-driven demo. Only the simulated strategy exists today:
 * it makes no network call and has no side effects.
 */
export interface AutomationRunner {
  readonly kind: "simulated";
  start(scenario: Scenario): AutomationRun;
  advance(run: AutomationRun): AutomationRun;
  decide(run: AutomationRun, decision: ApprovalDecision): AutomationRun;
}

export const simulatedAutomationRunner: AutomationRunner = {
  kind: "simulated",
  start: startRun,
  advance,
  decide,
};
