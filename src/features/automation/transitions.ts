import type { RfqStatus } from "./types";

/**
 * Mirror of `rfq_status_transitions` from the Offshore Fares repository
 * (database/schema.sql, kept identical to lib/stateMachine.js there).
 * Source: https://github.com/TsinjoNantosoa/offshore-fares-ai-automation
 */
const PAIRS: Array<[RfqStatus, RfqStatus[]]> = [
  ["NEW", ["NEEDS_INFORMATION", "READY_FOR_SEARCH", "CHANGE_REQUESTED", "REFUND_REQUESTED", "CANCELLED", "CLOSED", "ERROR"]],
  ["NEEDS_INFORMATION", ["READY_FOR_SEARCH", "CANCELLED", "LOST", "CLOSED", "ERROR"]],
  ["READY_FOR_SEARCH", ["ASSIGNED", "NEEDS_INFORMATION", "CANCELLED", "CLOSED", "ERROR"]],
  ["ASSIGNED", ["SEARCHING", "READY_FOR_SEARCH", "NEEDS_INFORMATION", "CANCELLED", "CLOSED", "ERROR"]],
  ["SEARCHING", ["FARES_FOUND", "NEEDS_INFORMATION", "READY_FOR_SEARCH", "CANCELLED", "LOST", "ERROR"]],
  ["FARES_FOUND", ["PENDING_APPROVAL", "APPROVED", "SEARCHING", "CANCELLED", "ERROR"]],
  ["PENDING_APPROVAL", ["APPROVED", "SEARCHING", "FARES_FOUND", "CANCELLED", "ERROR"]],
  ["APPROVED", ["QUOTED", "PENDING_APPROVAL", "SEARCHING", "ERROR"]],
  ["QUOTED", ["AWAITING_CLIENT", "ERROR"]],
  ["AWAITING_CLIENT", ["CLIENT_INTERESTED", "BOOKING_REQUESTED", "READY_FOR_SEARCH", "NEEDS_INFORMATION", "CANCELLED", "LOST", "CLOSED", "ERROR"]],
  ["CLIENT_INTERESTED", ["BOOKING_REQUESTED", "AWAITING_CLIENT", "READY_FOR_SEARCH", "NEEDS_INFORMATION", "CANCELLED", "LOST", "CLOSED", "ERROR"]],
  ["BOOKING_REQUESTED", ["TICKETING", "AWAITING_CLIENT", "READY_FOR_SEARCH", "CANCELLED", "ERROR"]],
  ["TICKETING", ["TICKETED", "BOOKING_REQUESTED", "CANCELLED", "ERROR"]],
  ["TICKETED", ["CHANGE_REQUESTED", "REFUND_REQUESTED", "CLOSED"]],
  ["CHANGE_REQUESTED", ["TICKETING", "TICKETED", "REFUND_REQUESTED", "CANCELLED", "CLOSED", "ERROR"]],
  ["REFUND_REQUESTED", ["CLOSED", "CANCELLED", "ERROR"]],
  ["CANCELLED", ["CLOSED"]],
  ["LOST", ["READY_FOR_SEARCH", "CLOSED"]],
  ["ERROR", ["NEW", "NEEDS_INFORMATION", "READY_FOR_SEARCH", "ASSIGNED", "SEARCHING", "CANCELLED", "CLOSED"]],
];

export const ALLOWED_TRANSITIONS: ReadonlyMap<RfqStatus, ReadonlySet<RfqStatus>> = new Map(
  PAIRS.map(([from, to]) => [from, new Set(to)]),
);

export const canTransition = (from: RfqStatus, to: RfqStatus): boolean =>
  ALLOWED_TRANSITIONS.get(from)?.has(to) ?? false;

export const allowedFrom = (from: RfqStatus): RfqStatus[] => [...(ALLOWED_TRANSITIONS.get(from) ?? [])];

export class IllegalTransitionError extends Error {
  constructor(
    readonly from: RfqStatus,
    readonly to: RfqStatus,
  ) {
    super(`ILLEGAL_TRANSITION: ${from} -> ${to}`);
    this.name = "IllegalTransitionError";
  }
}
