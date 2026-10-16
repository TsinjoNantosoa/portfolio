import { daysBetween } from "./dates";
import type {
  Cabin,
  Classification,
  DeskCode,
  Extraction,
  FareOption,
  PriorityLevel,
  PriorityResult,
  PriorityRuleHit,
  Quote,
  ScenarioInput,
  ValidationIssue,
} from "./types";

export const CABINS: readonly Cabin[] = ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"];
export const MAX_PASSENGERS = 12;
export const MAX_NOTE_LENGTH = 140;
export const MAX_DAYS_TO_DEPARTURE = 330;
export const MAX_REVISIONS = 2;

/** Offshore Fares `lib/priority.js` default weights (documented in docs/business-process.md). */
export const PRIORITY_WEIGHTS = {
  TRAVEL_UNDER_24H: 40,
  TRAVEL_UNDER_72H: 25,
  FIRST: 25,
  BUSINESS: 20,
  GROUP: 20,
  MULTI_PAX_PREMIUM: 10,
  VIP_AGENCY: 15,
  EXPLICIT_URGENT: 10,
} as const;

export const GROUP_MIN_PASSENGERS = 10;

const PLACE_PATTERN = /^[\p{L}][\p{L} .'-]{1,38}$/u;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const URGENCY_SOURCE = "\\b(urgent|urgently|asap|immediately|urgence|rapidement)\\b";

/** Stateless on purpose: a shared global RegExp would carry `lastIndex` between calls. */
const urgencyMatches = (text: string | undefined): string[] =>
  [...new Set((text?.match(new RegExp(URGENCY_SOURCE, "gi")) ?? []).map((match) => match.toLowerCase()))];

const normalizePlace = (value: string) => value.trim().replace(/\s+/g, " ");

const isRealDate = (value: string) => {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
};

export const normalizeInput = (input: ScenarioInput): ScenarioInput => ({
  ...input,
  origin: normalizePlace(input.origin),
  destination: normalizePlace(input.destination),
  note: input.note?.trim() || undefined,
  returnDate: input.returnDate || undefined,
});

/** Lead time in whole days, derived so it can never disagree with the displayed dates. */
export const daysToDeparture = (input: Pick<ScenarioInput, "requestDate" | "departureDate">): number =>
  daysBetween(input.requestDate, input.departureDate);

export const validateInput = (raw: ScenarioInput): ValidationIssue[] => {
  const input = normalizeInput(raw);
  const issues: ValidationIssue[] = [];
  if (!PLACE_PATTERN.test(input.origin)) issues.push({ field: "origin", code: "place_invalid" });
  if (!PLACE_PATTERN.test(input.destination)) issues.push({ field: "destination", code: "place_invalid" });
  if (
    PLACE_PATTERN.test(input.origin) &&
    PLACE_PATTERN.test(input.destination) &&
    input.origin.toLowerCase() === input.destination.toLowerCase()
  ) {
    issues.push({ field: "destination", code: "same_place" });
  }
  if (!Number.isInteger(input.passengers) || input.passengers < 1 || input.passengers > MAX_PASSENGERS) {
    issues.push({ field: "passengers", code: "passengers_range" });
  }
  if (!CABINS.includes(input.cabin)) issues.push({ field: "cabin", code: "cabin_invalid" });
  const requestValid = isRealDate(input.requestDate);
  const departureValid = isRealDate(input.departureDate);
  if (!requestValid) issues.push({ field: "requestDate", code: "request_invalid" });
  if (!departureValid) issues.push({ field: "departureDate", code: "departure_invalid" });
  if (requestValid && departureValid) {
    const lead = daysToDeparture(input);
    if (lead < 0 || lead > MAX_DAYS_TO_DEPARTURE) issues.push({ field: "departureDate", code: "days_range" });
  }
  if (input.returnDate && (!isRealDate(input.returnDate) || input.returnDate < input.departureDate)) {
    issues.push({ field: "returnDate", code: "return_before_departure" });
  }
  if (input.note && input.note.length > MAX_NOTE_LENGTH) issues.push({ field: "note", code: "note_too_long" });
  return issues;
};

/** 32-bit FNV-1a: tiny, dependency-free, deterministic. */
export const hashString = (value: string): number => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
};

export const rfqIdFor = (input: ScenarioInput): string => {
  const seed = hashString(JSON.stringify(normalizeInput(input)));
  return `DEMO-RFQ-${String(100000 + (seed % 900000))}`;
};

const CABIN_PHRASE: Record<Cabin, string> = {
  ECONOMY: "economy",
  PREMIUM_ECONOMY: "premium economy",
  BUSINESS: "business class",
  FIRST: "first class",
};

/** The fictional inbound email the visitor sees (always English, like the source business). */
export const buildRequestMessage = (raw: ScenarioInput): string => {
  const input = normalizeInput(raw);
  const trip = input.returnDate ? `, returning ${input.returnDate}` : "";
  const seats = input.passengers === 1 ? "seat" : "seats";
  const note = input.note ? ` ${input.note}` : "";
  const urgent = input.urgent && urgencyMatches(input.note).length === 0 ? " Urgent, please." : "";
  return `Need ${input.passengers} ${CABIN_PHRASE[input.cabin]} ${seats} from ${input.origin} to ${input.destination} on ${input.departureDate}${trip}.${note}${urgent}`.replace(
    /\s+/g,
    " ",
  );
};

export const classify = (raw: ScenarioInput): Classification => {
  const input = normalizeInput(raw);
  return { intent: "NEW_QUOTE", urgencyEvidence: urgencyMatches(input.note) };
};

export const extract = (raw: ScenarioInput, classification: Classification): Extraction => {
  const input = normalizeInput(raw);
  const missingFields: string[] = [];
  if (!input.origin) missingFields.push("origin");
  if (!input.destination) missingFields.push("destination");
  if (!input.departureDate) missingFields.push("departureDate");
  return {
    intent: classification.intent,
    origin: input.origin,
    destination: input.destination,
    tripType: input.returnDate ? "ROUND_TRIP" : "ONE_WAY",
    departureDate: input.departureDate,
    returnDate: input.returnDate,
    passengers: input.passengers,
    cabin: input.cabin,
    urgent: input.urgent || classification.urgencyEvidence.length > 0,
    missingFields,
  };
};

export const levelForScore = (score: number): PriorityLevel => {
  if (score >= 70) return "CRITICAL";
  if (score >= 50) return "HIGH";
  if (score >= 30) return "NORMAL";
  return "LOW";
};

export const calculatePriority = (
  extraction: Extraction,
  leadDays: number,
  vipAgency: boolean,
): PriorityResult => {
  const breakdown: PriorityRuleHit[] = [];
  const hit = (rule: PriorityRuleHit["rule"]) => breakdown.push({ rule, points: PRIORITY_WEIGHTS[rule] });
  if (leadDays === 0) hit("TRAVEL_UNDER_24H");
  else if (leadDays <= 2) hit("TRAVEL_UNDER_72H");
  if (extraction.cabin === "FIRST") hit("FIRST");
  if (extraction.cabin === "BUSINESS") hit("BUSINESS");
  // Mutually exclusive in lib/priority.js (`GROUP` … `else if` `MULTI_PAX_PREMIUM`).
  if (extraction.passengers >= GROUP_MIN_PASSENGERS) hit("GROUP");
  else if (extraction.passengers >= 3 && (extraction.cabin === "BUSINESS" || extraction.cabin === "FIRST")) {
    hit("MULTI_PAX_PREMIUM");
  }
  if (vipAgency) hit("VIP_AGENCY");
  if (extraction.urgent) hit("EXPLICIT_URGENT");
  const score = Math.min(
    100,
    breakdown.reduce((sum, item) => sum + item.points, 0),
  );
  return { score, level: levelForScore(score), breakdown };
};

/** First match wins, like `lib/routing.js` (new-quote subset: GROUP, PREMIUM_CABIN, CRITICAL_TO_PREMIUM, DEFAULT). */
export const routeToDesk = (extraction: Extraction, priorityLevel?: PriorityLevel): DeskCode => {
  if (extraction.passengers >= GROUP_MIN_PASSENGERS) return "GROUP_DESK";
  if (extraction.cabin !== "ECONOMY") return "PREMIUM_DESK";
  if (priorityLevel === "CRITICAL") return "PREMIUM_DESK";
  return "GENERAL_DESK";
};

const CABIN_BASE_USD: Record<Cabin, number> = {
  ECONOMY: 600,
  PREMIUM_ECONOMY: 1100,
  BUSINESS: 2400,
  FIRST: 4800,
};

const CABIN_FARE_CLASS: Record<Cabin, string> = {
  ECONOMY: "Y",
  PREMIUM_ECONOMY: "W",
  BUSINESS: "J",
  FIRST: "F",
};

/** Fictional carriers: no airline name is used, so no figure can be mistaken for a real fare. */
const CARRIERS = ["Aurora Airways", "Meridian Air", "Nimbus Airlines"] as const;
const OPTION_IDS = ["OPT-001", "OPT-002", "OPT-003"] as const;
const PRICE_FACTORS = [1, 1.07, 1.18] as const;
const REVISION_DELTAS_USD = [-60, -40] as const;

const roundToTen = (value: number) => Math.round(value / 10) * 10;

const clock = (minutes: number) => {
  const wrapped = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(wrapped / 60)).padStart(2, "0")}:${String(wrapped % 60).padStart(2, "0")}`;
};

export const generateFareOptions = (raw: ScenarioInput): FareOption[] => {
  const input = normalizeInput(raw);
  const seed = hashString(`${input.origin.toLowerCase()}|${input.destination.toLowerCase()}|${input.cabin}`);
  const base = CABIN_BASE_USD[input.cabin] * (1 + (seed % 60) / 100);
  return OPTION_IDS.map((id, index) => {
    const perPassengerUsd = roundToTen(base * PRICE_FACTORS[index]);
    const departureMinutes = (6 + ((seed >>> (index * 3)) % 14)) * 60 + index * 25;
    const durationMinutes = (8 + ((seed >>> 5) % 8) + (index === 0 ? 2 : 0)) * 60;
    const arrivalMinutes = departureMinutes + durationMinutes;
    return {
      id,
      carrier: CARRIERS[index],
      stops: index === 0 ? 1 : 0,
      departure: clock(departureMinutes),
      arrival: `${clock(arrivalMinutes)}${arrivalMinutes >= 1440 ? " +1" : ""}`,
      baggage: input.cabin === "ECONOMY" ? "1 × 23 kg" : "2 × 32 kg",
      fareClass: CABIN_FARE_CLASS[input.cabin],
      perPassengerUsd,
      totalUsd: perPassengerUsd * input.passengers,
      refundable: index === 2,
    };
  });
};

/**
 * Mirrors the real quote guard: every displayed total must equal the code-derived figure
 * (`perPassenger × passengers`). Returns false if any number was altered.
 */
export const verifyQuoteNumbers = (options: FareOption[], passengers: number): boolean =>
  options.every((option) => option.totalUsd === option.perPassengerUsd * passengers && option.perPassengerUsd > 0);

export const buildQuote = (input: ScenarioInput, version: number, previous?: Quote): Quote => {
  if (!previous) {
    const options = generateFareOptions(input);
    return {
      version,
      currency: "USD",
      options,
      validityHours: 24,
      numbersVerified: verifyQuoteNumbers(options, input.passengers),
    };
  }
  const revisionIndex = Math.min(version - 2, REVISION_DELTAS_USD.length - 1);
  const delta = REVISION_DELTAS_USD[revisionIndex];
  const target = previous.options[revisionIndex % previous.options.length];
  const options = previous.options.map((option) =>
    option.id === target.id
      ? {
          ...option,
          perPassengerUsd: option.perPassengerUsd + delta,
          totalUsd: (option.perPassengerUsd + delta) * input.passengers,
        }
      : option,
  );
  return {
    version,
    currency: "USD",
    options,
    validityHours: previous.validityHours,
    revisionNote: { optionId: target.id, deltaPerPassengerUsd: delta },
    numbersVerified: verifyQuoteNumbers(options, input.passengers),
  };
};

/** The simulated client always replies to the same option so runs stay deterministic. */
export const RECOMMENDED_OPTION_ID: FareOption["id"] = "OPT-002";
