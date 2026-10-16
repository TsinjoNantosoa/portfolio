export const RFQ_STATUSES = [
  "NEW",
  "NEEDS_INFORMATION",
  "READY_FOR_SEARCH",
  "ASSIGNED",
  "SEARCHING",
  "FARES_FOUND",
  "PENDING_APPROVAL",
  "APPROVED",
  "QUOTED",
  "AWAITING_CLIENT",
  "CLIENT_INTERESTED",
  "BOOKING_REQUESTED",
  "TICKETING",
  "TICKETED",
  "CHANGE_REQUESTED",
  "REFUND_REQUESTED",
  "CANCELLED",
  "LOST",
  "CLOSED",
  "ERROR",
] as const;

export type RfqStatus = (typeof RFQ_STATUSES)[number];

export type Cabin = "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";

export type PriorityLevel = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";

export type DeskCode = "PREMIUM_DESK" | "GROUP_DESK" | "GENERAL_DESK";

export type ApprovalDecision = "approve" | "reject" | "revise";

export type StepId =
  | "message_received"
  | "ai_classified"
  | "ai_extracted"
  | "rfq_created"
  | "priority_calculated"
  | "desk_assigned"
  | "fares_entered"
  | "quote_generated"
  | "human_approval"
  | "quote_sent"
  | "client_selected"
  | "booking_requested";

/** Engine-level state. The UI derives the transient "active" look from the next pending step. */
export type StepState = "pending" | "done" | "waiting" | "rejected";

/** Who performs a step. `ai-simulated` and `client-simulated` never involve a real model or person. */
export type Actor = "system" | "ai-simulated" | "fare-desk-simulated" | "human" | "client-simulated";

export interface ScenarioInput {
  origin: string;
  destination: string;
  passengers: number;
  cabin: Cabin;
  /**
   * Simulation clock: the ISO date on which the request is received. Explicit so the engine
   * never reads the real clock; the lead time is derived from it (see `daysToDeparture`).
   */
  requestDate: string;
  /** ISO date, fictional. */
  departureDate: string;
  returnDate?: string;
  note?: string;
  vipAgency: boolean;
  urgent: boolean;
}

export interface Scenario {
  id: "business-travel" | "corporate-travel" | "custom";
  version: string;
  input: ScenarioInput;
}

export type ValidationCode =
  | "place_invalid"
  | "same_place"
  | "passengers_range"
  | "cabin_invalid"
  | "request_invalid"
  | "departure_invalid"
  | "days_range"
  | "return_before_departure"
  | "note_too_long";

export interface ValidationIssue {
  field: keyof ScenarioInput;
  code: ValidationCode;
}

export interface PriorityRuleHit {
  rule: "TRAVEL_UNDER_24H" | "TRAVEL_UNDER_72H" | "FIRST" | "BUSINESS" | "GROUP" | "MULTI_PAX_PREMIUM" | "VIP_AGENCY" | "EXPLICIT_URGENT";
  points: number;
}

export interface PriorityResult {
  score: number;
  level: PriorityLevel;
  breakdown: PriorityRuleHit[];
}

export interface Classification {
  intent: "NEW_QUOTE";
  /** Phrases that triggered the deterministic urgency keyword check. */
  urgencyEvidence: string[];
}

export interface FareOption {
  id: "OPT-001" | "OPT-002" | "OPT-003";
  carrier: string;
  stops: 0 | 1;
  departure: string;
  arrival: string;
  baggage: string;
  fareClass: string;
  perPassengerUsd: number;
  totalUsd: number;
  refundable: boolean;
}

export interface Quote {
  version: number;
  currency: "USD";
  options: FareOption[];
  validityHours: number;
  /** Set on revisions: what the fare desk changed and why. */
  revisionNote?: { optionId: FareOption["id"]; deltaPerPassengerUsd: number };
  /** Simulates the real number-preservation guard (all figures re-derived by code). */
  numbersVerified: boolean;
}

export interface Extraction {
  intent: Classification["intent"];
  origin: string;
  destination: string;
  tripType: "ONE_WAY" | "ROUND_TRIP";
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabin: Cabin;
  urgent: boolean;
  missingFields: string[];
}

export type TraceCode =
  | "message_received"
  | "classified"
  | "extracted"
  | "rfq_created"
  | "priority_calculated"
  | "desk_assigned"
  | "search_started"
  | "fares_entered"
  | "quote_generated"
  | "approval_requested"
  | "decision_approve"
  | "decision_reject"
  | "decision_revise"
  | "fares_rechecked"
  | "quote_revised"
  | "quote_sent_simulated"
  | "awaiting_client"
  | "client_selected_simulated"
  | "booking_requested"
  | "handoff_prepared"
  | "run_completed"
  | "run_rejected";

export interface TraceEvent {
  seq: number;
  step: StepId;
  actor: Actor;
  code: TraceCode;
  from?: RfqStatus;
  to?: RfqStatus;
  params: Record<string, string | number | boolean>;
}

export interface StepRecord {
  id: StepId;
  state: StepState;
  /** Synthetic payload shown in the Engineering view. Never produced by a real workflow. */
  payload?: Record<string, unknown>;
}

export interface DecisionRecord {
  seq: number;
  decision: ApprovalDecision;
  quoteVersion: number;
}

export type RunOutcome = "completed" | "rejected";

export interface AutomationRun {
  scenarioId: Scenario["id"];
  scenarioVersion: string;
  input: ScenarioInput;
  rfqId: string;
  status: RfqStatus;
  steps: StepRecord[];
  trace: TraceEvent[];
  decisions: DecisionRecord[];
  classification?: Classification;
  extraction?: Extraction;
  priority?: PriorityResult;
  desk?: DeskCode;
  quotes: Quote[];
  selectedOptionId?: FareOption["id"];
  /** True while the run is paused at the human approval gate. */
  awaitingApproval: boolean;
  outcome: RunOutcome | null;
}
