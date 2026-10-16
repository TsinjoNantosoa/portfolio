import { describe, expect, it, vi } from "vitest";
import {
  advance,
  ApprovalRequiredError,
  AutomationValidationError,
  canRevise,
  decide,
  latestQuote,
  NoPendingApprovalError,
  RevisionLimitError,
  RunFinishedError,
  runToEnd,
  runUntilGate,
  startRun,
  STEP_ORDER,
} from "./engine";
import {
  buildQuote,
  calculatePriority,
  classify,
  extract,
  generateFareOptions,
  rfqIdFor,
  routeToDesk,
  validateInput,
  verifyQuoteNumbers,
} from "./rules";
import { customScenario, presetScenarios } from "./scenarios";
import { simulatedAutomationRunner } from "./runner";
import { ALLOWED_TRANSITIONS, canTransition, IllegalTransitionError } from "./transitions";
import { RFQ_STATUSES } from "./types";
import type { ScenarioInput } from "./types";

const [businessTravel, corporateTravel] = presetScenarios;

const customInput = (overrides: Partial<ScenarioInput> = {}): ScenarioInput => ({
  origin: "Lisbon",
  destination: "Nairobi",
  passengers: 4,
  cabin: "FIRST",
  departureDate: "2027-05-04",
  daysToDeparture: 0,
  vipAgency: false,
  urgent: false,
  ...overrides,
});

describe("preset scenarios", () => {
  it("ships the two documented presets with a version", () => {
    expect(presetScenarios.map((scenario) => scenario.id)).toEqual(["business-travel", "corporate-travel"]);
    expect(presetScenarios.every((scenario) => scenario.version.length > 0)).toBe(true);
    expect(businessTravel.input).toMatchObject({ origin: "Mumbai", destination: "London", passengers: 3, cabin: "BUSINESS" });
    expect(corporateTravel.input).toMatchObject({ origin: "Delhi", destination: "New York", passengers: 2, cabin: "BUSINESS" });
  });

  it("reproduces the documented Offshore Fares priority example: 55 HIGH", () => {
    const run = runUntilGate(startRun(businessTravel));
    expect(run.priority).toEqual({
      score: 55,
      level: "HIGH",
      breakdown: [
        { rule: "BUSINESS", points: 20 },
        { rule: "MULTI_PAX_PREMIUM", points: 10 },
        { rule: "VIP_AGENCY", points: 15 },
        { rule: "EXPLICIT_URGENT", points: 10 },
      ],
    });
  });

  it("scores the short-notice corporate preset as NORMAL", () => {
    const run = runUntilGate(startRun(corporateTravel));
    expect(run.priority?.score).toBe(45);
    expect(run.priority?.level).toBe("NORMAL");
  });
});

describe("input validation", () => {
  it("accepts a well-formed custom request", () => {
    expect(validateInput(customInput())).toEqual([]);
  });

  it.each([
    [{ origin: "" }, "origin", "place_invalid"],
    [{ origin: "BOM123" }, "origin", "place_invalid"],
    [{ destination: "<script>" }, "destination", "place_invalid"],
    [{ destination: "lisbon" }, "destination", "same_place"],
    [{ passengers: 0 }, "passengers", "passengers_range"],
    [{ passengers: 13 }, "passengers", "passengers_range"],
    [{ passengers: 2.5 }, "passengers", "passengers_range"],
    [{ cabin: "COACH" as never }, "cabin", "cabin_invalid"],
    [{ departureDate: "2027-02-31" }, "departureDate", "departure_invalid"],
    [{ departureDate: "soon" }, "departureDate", "departure_invalid"],
    [{ daysToDeparture: -1 }, "daysToDeparture", "days_range"],
    [{ daysToDeparture: 400 }, "daysToDeparture", "days_range"],
    [{ returnDate: "2027-05-01" }, "returnDate", "return_before_departure"],
    [{ note: "x".repeat(141) }, "note", "note_too_long"],
  ] as const)("rejects %j", (overrides, field, code) => {
    expect(validateInput(customInput(overrides as Partial<ScenarioInput>))).toContainEqual({ field, code });
  });

  it("refuses to start a run with invalid input", () => {
    expect(() => startRun(customScenario(customInput({ passengers: 0 })))).toThrow(AutomationValidationError);
  });

  it("accepts accented city names and trims spacing", () => {
    expect(validateInput(customInput({ origin: "  São   Paulo ", destination: "Zürich" }))).toEqual([]);
    expect(startRun(customScenario(customInput({ origin: "  São   Paulo " }))).input.origin).toBe("São Paulo");
  });
});

describe("deterministic business rules", () => {
  it("creates the same RFQ id and fares for the same input", () => {
    const a = runUntilGate(startRun(customScenario(customInput())));
    const b = runUntilGate(startRun(customScenario(customInput())));
    expect(a.rfqId).toBe(b.rfqId);
    expect(a.rfqId).toMatch(/^DEMO-RFQ-\d{6}$/);
    expect(a.quotes).toEqual(b.quotes);
    expect(rfqIdFor(customInput({ passengers: 5 }))).not.toBe(a.rfqId);
  });

  it("uses fictional carriers and internally consistent totals", () => {
    const options = generateFareOptions(businessTravel.input);
    expect(options.map((option) => option.carrier)).toEqual(["Aurora Airways", "Meridian Air", "Nimbus Airlines"]);
    expect(options.every((option) => option.totalUsd === option.perPassengerUsd * 3)).toBe(true);
    expect(verifyQuoteNumbers(options, 3)).toBe(true);
    expect(verifyQuoteNumbers([{ ...options[0], totalUsd: options[0].totalUsd + 1 }], 3)).toBe(false);
  });

  it("detects urgency evidence from the free-text note, not from a model", () => {
    const classification = classify(customInput({ note: "Need this ASAP, urgent" }));
    expect(classification.urgencyEvidence.sort()).toEqual(["asap", "urgent"]);
    expect(extract(customInput({ note: "asap" }), classify(customInput({ note: "asap" }))).urgent).toBe(true);
    expect(classify(customInput({ note: "flexible dates" })).urgencyEvidence).toEqual([]);
  });

  it("applies the travel-time, group, and routing rules", () => {
    const urgentDeparture = extract(customInput(), classify(customInput()));
    expect(calculatePriority(urgentDeparture, 0, false).breakdown.map((hit) => hit.rule)).toEqual([
      "TRAVEL_UNDER_24H",
      "FIRST",
      "MULTI_PAX_PREMIUM",
    ]);
    expect(calculatePriority(urgentDeparture, 0, false)).toMatchObject({ score: 75, level: "CRITICAL" });

    const group = extract(customInput({ passengers: 10, cabin: "ECONOMY" }), classify(customInput()));
    expect(routeToDesk(group)).toBe("GROUP_DESK");
    expect(calculatePriority(group, 30, false)).toMatchObject({ score: 20, level: "LOW" });
    expect(routeToDesk(extract(customInput({ cabin: "ECONOMY", passengers: 1 }), classify(customInput())))).toBe("GENERAL_DESK");
    expect(routeToDesk(urgentDeparture)).toBe("PREMIUM_DESK");
  });

  it("caps priority at 100", () => {
    const extraction = { ...extract(customInput(), classify(customInput())), urgent: true, passengers: 12 };
    expect(calculatePriority(extraction, 0, true).score).toBeLessThanOrEqual(100);
  });
});

describe("transition table", () => {
  it("mirrors the Offshore Fares table: known statuses only, and NEW cannot reach TICKETED", () => {
    for (const [from, targets] of ALLOWED_TRANSITIONS) {
      expect(RFQ_STATUSES).toContain(from);
      for (const to of targets) expect(RFQ_STATUSES).toContain(to);
    }
    expect(canTransition("NEW", "TICKETED")).toBe(false);
    expect(canTransition("PENDING_APPROVAL", "QUOTED")).toBe(false);
    expect(canTransition("PENDING_APPROVAL", "APPROVED")).toBe(true);
  });
});

describe("automatic path", () => {
  it("executes the pipeline in order and pauses at the approval gate", () => {
    let run = startRun(businessTravel);
    expect(run.status).toBe("NEW");
    const seen: string[] = [];
    while (!run.awaitingApproval) {
      run = advance(run);
      seen.push(run.trace[run.trace.length - 1].step);
    }
    expect(run.status).toBe("PENDING_APPROVAL");
    expect(run.steps.find((step) => step.id === "human_approval")?.state).toBe("waiting");
    expect(run.steps.filter((step) => step.state === "done").map((step) => step.id)).toEqual(STEP_ORDER.slice(0, 8));
    expect(run.outcome).toBeNull();
    expect(seen[0]).toBe("message_received");
  });

  it("cannot skip the human approval step", () => {
    const gated = runUntilGate(startRun(businessTravel));
    expect(() => advance(gated)).toThrow(ApprovalRequiredError);
    expect(gated.status).toBe("PENDING_APPROVAL");
    expect(() => decide(startRun(businessTravel), "approve")).toThrow(NoPendingApprovalError);
  });

  it("never sends, ticketing, or pays: the run stops at BOOKING_REQUESTED", () => {
    const done = runToEnd(startRun(businessTravel), "approve");
    expect(done.status).toBe("BOOKING_REQUESTED");
    expect(done.outcome).toBe("completed");
    expect(done.trace.map((event) => event.to)).not.toContain("TICKETING");
    expect(done.trace.map((event) => event.to)).not.toContain("TICKETED");
    expect(done.steps.find((step) => step.id === "quote_sent")?.payload).toMatchObject({ actually_sent: false });
    expect(done.steps.find((step) => step.id === "booking_requested")?.payload).toMatchObject({
      automatic_ticketing: false,
      payment: "none",
      reservation: "none",
    });
  });
});

describe("human-in-the-loop decisions", () => {
  it("APPROVE continues through the simulated outcome", () => {
    const done = runToEnd(startRun(businessTravel), "approve");
    expect(done.trace.filter((event) => event.to).map((event) => event.to)).toEqual([
      "READY_FOR_SEARCH",
      "ASSIGNED",
      "SEARCHING",
      "FARES_FOUND",
      "PENDING_APPROVAL",
      "APPROVED",
      "QUOTED",
      "AWAITING_CLIENT",
      "BOOKING_REQUESTED",
    ]);
    expect(done.selectedOptionId).toBe("OPT-002");
    expect(done.decisions).toHaveLength(1);
    expect(done.decisions[0]).toMatchObject({ decision: "approve", quoteVersion: 1 });
  });

  it("REJECT returns the RFQ to the fare desk and ends the run with nothing sent", () => {
    const rejected = decide(runUntilGate(startRun(businessTravel)), "reject");
    expect(rejected.status).toBe("SEARCHING");
    expect(rejected.outcome).toBe("rejected");
    expect(rejected.steps.find((step) => step.id === "human_approval")?.state).toBe("rejected");
    expect(rejected.steps.find((step) => step.id === "quote_sent")?.state).toBe("pending");
    expect(rejected.steps.find((step) => step.id === "booking_requested")?.state).toBe("pending");
    expect(rejected.trace.map((event) => event.code)).toContain("run_rejected");
    expect(rejected.trace.map((event) => event.code)).not.toContain("quote_sent_simulated");
  });

  it("cannot take any final action after a rejection", () => {
    const rejected = decide(runUntilGate(startRun(businessTravel)), "reject");
    expect(() => advance(rejected)).toThrow(RunFinishedError);
    expect(() => decide(rejected, "approve")).toThrow(RunFinishedError);
    expect(rejected.trace.map((event) => event.to)).not.toContain("BOOKING_REQUESTED");
  });

  it("cannot decide twice on the same quote", () => {
    const approved = decide(runUntilGate(startRun(businessTravel)), "approve");
    expect(() => decide(approved, "approve")).toThrow(NoPendingApprovalError);
  });

  it("REVISE produces version 2, explains the change, and returns to the approval gate", () => {
    const gated = runUntilGate(startRun(businessTravel));
    const revised = decide(gated, "revise");
    expect(revised.awaitingApproval).toBe(true);
    expect(revised.status).toBe("PENDING_APPROVAL");
    expect(revised.outcome).toBeNull();
    expect(revised.quotes).toHaveLength(2);
    const v1 = revised.quotes[0];
    const v2 = latestQuote(revised);
    expect(v2?.version).toBe(2);
    expect(v2?.revisionNote).toEqual({ optionId: "OPT-001", deltaPerPassengerUsd: -60 });
    expect(v2?.options[0].perPassengerUsd).toBe(v1.options[0].perPassengerUsd - 60);
    expect(v2?.options[0].totalUsd).toBe((v1.options[0].perPassengerUsd - 60) * 3);
    expect(v2?.options[1]).toEqual(v1.options[1]);
    expect(v2?.numbersVerified).toBe(true);
    expect(revised.trace.filter((event) => event.to).slice(-2).map((event) => event.to)).toEqual(["FARES_FOUND", "PENDING_APPROVAL"]);
    expect(() => advance(revised)).toThrow(ApprovalRequiredError);
  });

  it("can revise, then approve version 2 and complete", () => {
    const done = runToEnd(decide(runUntilGate(startRun(businessTravel)), "revise"), "approve");
    expect(done.outcome).toBe("completed");
    expect(done.decisions.map((decision) => [decision.decision, decision.quoteVersion])).toEqual([
      ["revise", 1],
      ["approve", 2],
    ]);
  });

  it("limits the demo to two revisions", () => {
    let run = runUntilGate(startRun(businessTravel));
    run = decide(decide(run, "revise"), "revise");
    expect(latestQuote(run)?.version).toBe(3);
    expect(canRevise(run)).toBe(false);
    expect(() => decide(run, "revise")).toThrow(RevisionLimitError);
    expect(latestQuote(run)?.revisionNote).toEqual({ optionId: "OPT-002", deltaPerPassengerUsd: -40 });
    expect(decide(run, "approve").status).toBe("APPROVED");
  });

  it("buildQuote keeps totals consistent across revisions", () => {
    const v1 = buildQuote(corporateTravel.input, 1);
    const v2 = buildQuote(corporateTravel.input, 2, v1);
    expect(verifyQuoteNumbers(v2.options, corporateTravel.input.passengers)).toBe(true);
  });
});

describe("trace and state integrity", () => {
  it("records only legal transitions and a gapless sequence for every path", () => {
    const paths = [
      runToEnd(startRun(businessTravel), "approve"),
      decide(runUntilGate(startRun(corporateTravel)), "reject"),
      runToEnd(decide(runUntilGate(startRun(customScenario(customInput()))), "revise"), "approve"),
    ];
    for (const run of paths) {
      run.trace.forEach((event, index) => {
        expect(event.seq).toBe(index + 1);
        if (event.from && event.to) expect(canTransition(event.from, event.to)).toBe(true);
      });
      const moves = run.trace.filter((event) => event.from && event.to);
      moves.reduce((previous, event) => {
        expect(event.from).toBe(previous);
        return event.to!;
      }, "NEW" as ScenarioStatus);
      expect(moves[moves.length - 1].to).toBe(run.status);
    }
  });

  it("does not mutate previous runs (immutable states enable restart and history)", () => {
    const first = startRun(businessTravel);
    const snapshot = JSON.stringify(first);
    advance(first);
    expect(JSON.stringify(first)).toBe(snapshot);
    expect(startRun(businessTravel)).toEqual(first);
  });

  it("throws on an illegal transition instead of silently continuing", () => {
    expect(new IllegalTransitionError("NEW", "TICKETED").message).toContain("NEW -> TICKETED");
  });

  it("never touches the network", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    runToEnd(startRun(businessTravel), "approve");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("restarting a scenario yields an identical fresh run", () => {
    const first = runToEnd(simulatedAutomationRunner.start(businessTravel), "approve");
    const restarted = simulatedAutomationRunner.start(businessTravel);
    expect(restarted.status).toBe("NEW");
    expect(restarted.trace).toEqual([]);
    expect(runToEnd(restarted, "approve")).toEqual(first);
    expect(simulatedAutomationRunner.kind).toBe("simulated");
  });
});

type ScenarioStatus = (typeof RFQ_STATUSES)[number];
