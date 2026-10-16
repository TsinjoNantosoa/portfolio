import { describe, expect, it } from "vitest";
import { GROUP_MIN_PASSENGERS, levelForScore, PRIORITY_WEIGHTS } from "./rules";
import { OFFSHORE_REPOSITORY, OFFSHORE_REVIEWED_COMMIT, OFFSHORE_SOURCES } from "./reference";
import { ALLOWED_TRANSITIONS } from "./transitions";
import { RFQ_STATUSES } from "./types";

/**
 * Drift check against the Offshore Fares reference repository.
 *
 * Skipped by default so the normal test run never needs the network. Run it with
 * `npm run check:offshore` (optionally `OFFSHORE_REF=<branch|sha>`, default `main`).
 * A failure means the reference changed (or this mirror is wrong): read the message, review
 * the upstream change, update the mirrored data, then bump OFFSHORE_REVIEWED_COMMIT.
 */
const enabled = process.env.OFFSHORE_SYNC === "1";
const ref = process.env.OFFSHORE_REF || "main";

const fetchSource = async (path: string): Promise<string> => {
  const url = `https://raw.githubusercontent.com/${OFFSHORE_REPOSITORY}/${ref}/${path}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Cannot read ${url}: HTTP ${response.status}`);
  return response.text();
};

const squash = (source: string) => source.replace(/\s+/g, " ");

describe.skipIf(!enabled)(`Offshore Fares reference (${OFFSHORE_REPOSITORY}@${ref}, reviewed at ${OFFSHORE_REVIEWED_COMMIT.slice(0, 7)})`, () => {
  it("has the same status list", async () => {
    const source = await fetchSource(OFFSHORE_SOURCES.statuses.path);
    const block = source.match(/const STATUSES = \[([\s\S]*?)\];/)?.[1] ?? "";
    const upstream = [...block.matchAll(/'([A-Z_]+)'/g)].map((match) => match[1]);
    expect(upstream.length).toBeGreaterThan(0);
    expect(upstream).toEqual([...RFQ_STATUSES]);
  });

  it("has the same transition table", async () => {
    const source = await fetchSource(OFFSHORE_SOURCES.transitions.path);
    const insert = source.match(/INSERT INTO rfq_status_transitions[\s\S]*?;/)?.[0] ?? "";
    const upstream = [...insert.matchAll(/\('([A-Z_]+)',\s*'([A-Z_]+)'\)/g)].map((match) => `${match[1]}>${match[2]}`).sort();
    const mirrored = [...ALLOWED_TRANSITIONS].flatMap(([from, targets]) => [...targets].map((to) => `${from}>${to}`)).sort();
    expect(upstream.length).toBeGreaterThan(0);
    expect(mirrored).toEqual(upstream);
  });

  it("uses the same priority weights, levels and group threshold", async () => {
    const priority = await fetchSource(OFFSHORE_SOURCES.priority.path);
    const defaults = priority.match(/const DEFAULT_RULES = \{([\s\S]*?)\};/)?.[1] ?? "";
    const upstreamWeights = Object.fromEntries([...defaults.matchAll(/([A-Z_0-9]+):\s*(\d+)/g)].map((m) => [m[1], Number(m[2])]));
    for (const [rule, points] of Object.entries(PRIORITY_WEIGHTS)) expect(upstreamWeights[rule], rule).toBe(points);

    const levels = priority.match(/const LEVELS = \[([\s\S]*?)\];/)?.[1] ?? "";
    const upstreamLevels = [...levels.matchAll(/min:\s*(\d+),\s*level:\s*'([A-Z]+)'/g)].map((m) => ({ min: Number(m[1]), level: m[2] }));
    expect(upstreamLevels.length).toBeGreaterThan(0);
    for (const { min, level } of upstreamLevels) {
      expect(levelForScore(min), `score ${min}`).toBe(level);
      if (min > 0) expect(levelForScore(min - 1), `score ${min - 1}`).not.toBe(level);
    }

    const config = await fetchSource(OFFSHORE_SOURCES.config.path);
    expect(Number(config.match(/GROUP_MIN_PASSENGERS:\s*(\d+)/)?.[1])).toBe(GROUP_MIN_PASSENGERS);
  });

  it("keeps the rule logic the simulator relies on (canaries)", async () => {
    const priority = squash(await fetchSource(OFFSHORE_SOURCES.priority.path));
    // Travel-time rules are exclusive and use strict thresholds.
    expect(priority).toContain("if (hours !== null && hours < 24) add('TRAVEL_UNDER_24H'); else if (hours !== null && hours < 72) add('TRAVEL_UNDER_72H');");
    // Cabin rules are exclusive.
    expect(priority).toContain("if (req.cabin === 'FIRST') add('FIRST'); else if (req.cabin === 'BUSINESS') add('BUSINESS');");
    // GROUP and MULTI_PAX_PREMIUM are exclusive.
    expect(priority).toContain("add('GROUP'); else if (['BUSINESS', 'FIRST'].includes(req.cabin) && totalPassengers(req) >= 3) add('MULTI_PAX_PREMIUM');");
    // Scores are capped at 100.
    expect(priority).toContain("Math.min(100,");

    const routing = await fetchSource(OFFSHORE_SOURCES.routing.path);
    const ruleIds = [...routing.matchAll(/\{ id: '([A-Z_]+)'/g)].map((match) => match[1]);
    expect(ruleIds).toEqual([
      "BOOKING_TO_TICKETING",
      "CHANGE_TO_TICKETING",
      "REFUND_TO_REFUND_DESK",
      "PAYMENT_TO_GENERAL",
      "GROUP_TO_GROUP_DESK",
      "PREMIUM_CABIN",
      "CRITICAL_TO_PREMIUM",
      "DEFAULT",
    ]);
    expect(squash(routing)).toContain("['FIRST', 'BUSINESS', 'PREMIUM_ECONOMY'].includes((r.requirements || {}).cabin)");
  });
});
