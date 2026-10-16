import {
  buildQuote,
  buildRequestMessage,
  calculatePriority,
  classify,
  extract,
  MAX_REVISIONS,
  normalizeInput,
  RECOMMENDED_OPTION_ID,
  rfqIdFor,
  routeToDesk,
  validateInput,
} from "./rules";
import { canTransition, IllegalTransitionError } from "./transitions";
import type {
  ApprovalDecision,
  AutomationRun,
  Quote,
  RfqStatus,
  Scenario,
  StepId,
  StepState,
  TraceEvent,
  ValidationIssue,
} from "./types";

export const STEP_ORDER: readonly StepId[] = [
  "message_received",
  "ai_classified",
  "ai_extracted",
  "rfq_created",
  "priority_calculated",
  "desk_assigned",
  "fares_entered",
  "quote_generated",
  "human_approval",
  "quote_sent",
  "client_selected",
  "booking_requested",
];

export class AutomationValidationError extends Error {
  constructor(readonly issues: ValidationIssue[]) {
    super("INVALID_SCENARIO_INPUT");
    this.name = "AutomationValidationError";
  }
}
export class ApprovalRequiredError extends Error {
  constructor() {
    super("APPROVAL_REQUIRED: a human decision is needed before the workflow can continue");
    this.name = "ApprovalRequiredError";
  }
}
export class NoPendingApprovalError extends Error {
  constructor() {
    super("NO_PENDING_APPROVAL: there is no quote waiting for a decision");
    this.name = "NoPendingApprovalError";
  }
}
export class RunFinishedError extends Error {
  constructor() {
    super("RUN_FINISHED: the workflow has already reached a final outcome");
    this.name = "RunFinishedError";
  }
}
export class RevisionLimitError extends Error {
  constructor() {
    super(`REVISION_LIMIT: at most ${MAX_REVISIONS} revisions are allowed in the demo`);
    this.name = "RevisionLimitError";
  }
}

type EventInput = Omit<TraceEvent, "seq" | "from" | "to">;

const log = (run: AutomationRun, event: Omit<TraceEvent, "seq">): AutomationRun => ({
  ...run,
  trace: [...run.trace, { ...event, seq: run.trace.length + 1 }],
});

/** The only way the RFQ status changes. Refuses any move missing from the Offshore Fares table. */
const move = (run: AutomationRun, to: RfqStatus, event: EventInput): AutomationRun => {
  if (!canTransition(run.status, to)) throw new IllegalTransitionError(run.status, to);
  return { ...log(run, { ...event, from: run.status, to }), status: to };
};

const setStep = (
  run: AutomationRun,
  id: StepId,
  state: StepState,
  payload?: Record<string, unknown>,
): AutomationRun => ({
  ...run,
  steps: run.steps.map((step) => (step.id === id ? { ...step, state, payload: payload ?? step.payload } : step)),
});

export const latestQuote = (run: AutomationRun): Quote | undefined => run.quotes[run.quotes.length - 1];

export const revisionsUsed = (run: AutomationRun): number =>
  run.decisions.filter((decision) => decision.decision === "revise").length;

export const canRevise = (run: AutomationRun): boolean => run.awaitingApproval && revisionsUsed(run) < MAX_REVISIONS;

export const isFinished = (run: AutomationRun): boolean => run.outcome !== null;

export const nextPendingStep = (run: AutomationRun): StepId | undefined =>
  run.steps.find((step) => step.state === "pending")?.id;

export const startRun = (scenario: Scenario): AutomationRun => {
  const issues = validateInput(scenario.input);
  if (issues.length > 0) throw new AutomationValidationError(issues);
  const input = normalizeInput(scenario.input);
  return {
    scenarioId: scenario.id,
    scenarioVersion: scenario.version,
    input,
    rfqId: rfqIdFor(input),
    status: "NEW",
    steps: STEP_ORDER.map((id) => ({ id, state: "pending" as const })),
    trace: [],
    decisions: [],
    quotes: [],
    awaitingApproval: false,
    outcome: null,
  };
};

const executors: Record<StepId, (run: AutomationRun) => AutomationRun> = {
  message_received: (run) =>
    setStep(
      log(run, { step: "message_received", actor: "system", code: "message_received", params: { channel: "email" } }),
      "message_received",
      "done",
      { channel: "email (simulated)", body: buildRequestMessage(run.input), status: run.status },
    ),

  ai_classified: (run) => {
    const classification = classify(run.input);
    return setStep(
      log(
        { ...run, classification },
        { step: "ai_classified", actor: "ai-simulated", code: "classified", params: { intent: classification.intent } },
      ),
      "ai_classified",
      "done",
      { mode: "deterministic demo rules, no model call", ...classification },
    );
  },

  ai_extracted: (run) => {
    if (!run.classification) throw new Error("ORDER_VIOLATION: classification is required before extraction");
    const extraction = extract(run.input, run.classification);
    return setStep(
      log(
        { ...run, extraction },
        {
          step: "ai_extracted",
          actor: "ai-simulated",
          code: "extracted",
          params: { passengers: extraction.passengers, cabin: extraction.cabin },
        },
      ),
      "ai_extracted",
      "done",
      { mode: "deterministic demo rules, no model call", ...extraction },
    );
  },

  rfq_created: (run) =>
    setStep(
      move(run, "READY_FOR_SEARCH", {
        step: "rfq_created",
        actor: "system",
        code: "rfq_created",
        params: { rfqId: run.rfqId },
      }),
      "rfq_created",
      "done",
      { rfq_id: run.rfqId, status: "READY_FOR_SEARCH", trip_type: run.extraction?.tripType },
    ),

  priority_calculated: (run) => {
    if (!run.extraction) throw new Error("ORDER_VIOLATION: extraction is required before priority scoring");
    const priority = calculatePriority(run.extraction, run.input.daysToDeparture, run.input.vipAgency);
    return setStep(
      log(
        { ...run, priority },
        {
          step: "priority_calculated",
          actor: "system",
          code: "priority_calculated",
          params: { score: priority.score, level: priority.level },
        },
      ),
      "priority_calculated",
      "done",
      { ...priority, ai_used: false },
    );
  },

  desk_assigned: (run) => {
    if (!run.extraction) throw new Error("ORDER_VIOLATION: extraction is required before routing");
    const desk = routeToDesk(run.extraction);
    return setStep(
      move({ ...run, desk }, "ASSIGNED", { step: "desk_assigned", actor: "system", code: "desk_assigned", params: { desk } }),
      "desk_assigned",
      "done",
      { desk, operator: "demo operator (fictional)", strategy: "least-loaded member, simulated" },
    );
  },

  fares_entered: (run) => {
    const searching = move(run, "SEARCHING", {
      step: "fares_entered",
      actor: "fare-desk-simulated",
      code: "search_started",
      params: { desk: run.desk ?? "" },
    });
    const quote = buildQuote(run.input, 1);
    return setStep(
      move({ ...searching, quotes: [quote] }, "FARES_FOUND", {
        step: "fares_entered",
        actor: "fare-desk-simulated",
        code: "fares_entered",
        params: { options: quote.options.length },
      }),
      "fares_entered",
      "done",
      { source: "demo data only, no live fare availability", currency: quote.currency, options: quote.options },
    );
  },

  quote_generated: (run) => {
    const quote = latestQuote(run);
    if (!quote) throw new Error("ORDER_VIOLATION: fares are required before a quote");
    return setStep(
      move(run, "PENDING_APPROVAL", {
        step: "quote_generated",
        actor: "ai-simulated",
        code: "quote_generated",
        params: { version: quote.version, numbersVerified: quote.numbersVerified },
      }),
      "quote_generated",
      "done",
      {
        version: quote.version,
        numbers_verified_by_code: quote.numbersVerified,
        formats: ["email", "whatsapp (simulated)"],
      },
    );
  },

  human_approval: (run) =>
    setStep(
      log(
        { ...run, awaitingApproval: true },
        {
          step: "human_approval",
          actor: "system",
          code: "approval_requested",
          params: { version: latestQuote(run)?.version ?? 1 },
        },
      ),
      "human_approval",
      "waiting",
      { required: true, options: ["approve", "reject", "revise"] },
    ),

  quote_sent: (run) => {
    const quoted = move(run, "QUOTED", {
      step: "quote_sent",
      actor: "system",
      code: "quote_sent_simulated",
      params: { channel: "email thread", version: latestQuote(run)?.version ?? 1 },
    });
    return setStep(
      move(quoted, "AWAITING_CLIENT", { step: "quote_sent", actor: "system", code: "awaiting_client", params: {} }),
      "quote_sent",
      "done",
      { actually_sent: false, note: "No email or WhatsApp message is sent by this demo" },
    );
  },

  client_selected: (run) =>
    setStep(
      log(
        { ...run, selectedOptionId: RECOMMENDED_OPTION_ID },
        {
          step: "client_selected",
          actor: "client-simulated",
          code: "client_selected_simulated",
          params: { option: RECOMMENDED_OPTION_ID },
        },
      ),
      "client_selected",
      "done",
      { simulated_reply: "Option 2 works, please proceed.", selected: RECOMMENDED_OPTION_ID },
    ),

  booking_requested: (run) => {
    const requested = move(run, "BOOKING_REQUESTED", {
      step: "booking_requested",
      actor: "system",
      code: "booking_requested",
      params: { option: run.selectedOptionId ?? "" },
    });
    const handoff = log(requested, {
      step: "booking_requested",
      actor: "system",
      code: "handoff_prepared",
      params: { desk: "TICKETING_DESK", automaticTicketing: false },
    });
    const completed = log(
      { ...handoff, outcome: "completed" },
      { step: "booking_requested", actor: "system", code: "run_completed", params: {} },
    );
    return setStep(completed, "booking_requested", "done", {
      handoff_to: "TICKETING_DESK (summary only)",
      automatic_ticketing: false,
      payment: "none",
      reservation: "none",
    });
  },
};

/** Runs the next automatic step. Throws at the human gate and after a final outcome. */
export const advance = (run: AutomationRun): AutomationRun => {
  if (run.outcome) throw new RunFinishedError();
  if (run.awaitingApproval) throw new ApprovalRequiredError();
  const next = nextPendingStep(run);
  if (!next) throw new RunFinishedError();
  return executors[next](run);
};

/** Applies the visitor's decision at the approval gate. */
export const decide = (run: AutomationRun, decision: ApprovalDecision): AutomationRun => {
  if (run.outcome) throw new RunFinishedError();
  if (!run.awaitingApproval) throw new NoPendingApprovalError();
  const quote = latestQuote(run);
  if (!quote) throw new Error("ORDER_VIOLATION: no quote to decide on");
  const record = { seq: run.trace.length + 1, decision, quoteVersion: quote.version };
  const base = { ...run, decisions: [...run.decisions, record] };

  if (decision === "approve") {
    return setStep(
      move({ ...base, awaitingApproval: false }, "APPROVED", {
        step: "human_approval",
        actor: "human",
        code: "decision_approve",
        params: { version: quote.version },
      }),
      "human_approval",
      "done",
      { decision, quote_version: quote.version },
    );
  }

  if (decision === "reject") {
    const rejected = move({ ...base, awaitingApproval: false }, "SEARCHING", {
      step: "human_approval",
      actor: "human",
      code: "decision_reject",
      params: { version: quote.version },
    });
    return setStep(
      log({ ...rejected, outcome: "rejected" }, { step: "human_approval", actor: "system", code: "run_rejected", params: {} }),
      "human_approval",
      "rejected",
      { decision, quote_version: quote.version, sent_to_client: false },
    );
  }

  if (revisionsUsed(run) >= MAX_REVISIONS) throw new RevisionLimitError();
  const reopened = move(base, "FARES_FOUND", {
    step: "human_approval",
    actor: "human",
    code: "decision_revise",
    params: { version: quote.version },
  });
  const revised = buildQuote(run.input, quote.version + 1, quote);
  return setStep(
    move({ ...reopened, quotes: [...reopened.quotes, revised] }, "PENDING_APPROVAL", {
      step: "human_approval",
      actor: "fare-desk-simulated",
      code: "quote_revised",
      params: {
        version: revised.version,
        option: revised.revisionNote?.optionId ?? "",
        delta: revised.revisionNote?.deltaPerPassengerUsd ?? 0,
        numbersVerified: revised.numbersVerified,
      },
    }),
    "human_approval",
    "waiting",
    { decision, previous_version: quote.version, new_version: revised.version, revision_note: revised.revisionNote },
  );
};

/** Convenience for tests and the "skip to approval" control: advances until the gate or the end. */
export const runUntilGate = (run: AutomationRun): AutomationRun => {
  let current = run;
  while (!current.awaitingApproval && !current.outcome) current = advance(current);
  return current;
};

export const runToEnd = (run: AutomationRun, decision: ApprovalDecision = "approve"): AutomationRun => {
  let current = runUntilGate(run);
  if (current.awaitingApproval) current = decide(current, decision);
  while (!current.outcome) current = advance(current);
  return current;
};
