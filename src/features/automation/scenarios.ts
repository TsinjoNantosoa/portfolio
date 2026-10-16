import type { Scenario, ScenarioInput } from "./types";

/** Bump when presets, rules, or fare generation change so traces stay comparable. */
export const SCENARIO_VERSION = "2026.10-demo.1";

/**
 * All values are fictional. Dates are display-only; `daysToDeparture` is fixed per preset
 * so the priority score never depends on the visitor's clock.
 */
export const presetScenarios: Scenario[] = [
  {
    id: "business-travel",
    version: SCENARIO_VERSION,
    input: {
      origin: "Mumbai",
      destination: "London",
      passengers: 3,
      cabin: "BUSINESS",
      departureDate: "2027-03-17",
      returnDate: "2027-03-25",
      daysToDeparture: 7,
      vipAgency: true,
      urgent: true,
    },
  },
  {
    id: "corporate-travel",
    version: SCENARIO_VERSION,
    input: {
      origin: "Delhi",
      destination: "New York",
      passengers: 2,
      cabin: "BUSINESS",
      departureDate: "2027-03-15",
      returnDate: "2027-03-22",
      daysToDeparture: 2,
      vipAgency: false,
      urgent: false,
    },
  },
];

export const customScenario = (input: ScenarioInput): Scenario => ({
  id: "custom",
  version: SCENARIO_VERSION,
  input,
});
