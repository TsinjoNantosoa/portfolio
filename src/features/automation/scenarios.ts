import { addDaysIso } from "./dates";
import type { Scenario, ScenarioInput } from "./types";

/** Bump when presets, rules, or fare generation change so traces stay comparable. */
export const SCENARIO_VERSION = "2026.10-demo.2";

/**
 * Simulation clock for the presets: the day the fictional request is received. It is a fixed,
 * explicit date (not the visitor's clock) so scores and displayed dates are reproducible.
 */
export const SCENARIO_REFERENCE_DATE = "2027-03-10";

interface PresetSpec {
  id: Extract<Scenario["id"], "business-travel" | "corporate-travel">;
  /** Days between the request and the outbound flight; this drives the travel-time priority rules. */
  leadDays: number;
  /** Days between the outbound and return flights. */
  stayDays: number;
  input: Pick<ScenarioInput, "origin" | "destination" | "passengers" | "cabin" | "vipAgency" | "urgent">;
}

const PRESET_SPECS: readonly PresetSpec[] = [
  {
    id: "business-travel",
    leadDays: 7,
    stayDays: 8,
    input: { origin: "Mumbai", destination: "London", passengers: 3, cabin: "BUSINESS", vipAgency: true, urgent: true },
  },
  {
    id: "corporate-travel",
    leadDays: 2,
    stayDays: 7,
    input: { origin: "Delhi", destination: "New York", passengers: 2, cabin: "BUSINESS", vipAgency: false, urgent: false },
  },
];

/**
 * Builds the preset scenarios from a reference date. Every date is derived from it, so the
 * displayed dates and the lead time used for scoring cannot disagree. Injectable for tests.
 */
export const createPresetScenarios = (referenceDate: string = SCENARIO_REFERENCE_DATE): Scenario[] =>
  PRESET_SPECS.map((spec) => ({
    id: spec.id,
    version: SCENARIO_VERSION,
    input: {
      ...spec.input,
      requestDate: referenceDate,
      departureDate: addDaysIso(referenceDate, spec.leadDays),
      returnDate: addDaysIso(referenceDate, spec.leadDays + spec.stayDays),
    },
  }));

export const presetScenarios: Scenario[] = createPresetScenarios();

export const customScenario = (input: ScenarioInput): Scenario => ({
  id: "custom",
  version: SCENARIO_VERSION,
  input,
});
