/**
 * Provenance of the rules this simulator mirrors. The simulator never contacts this repository
 * at runtime; `npm run check:offshore` compares the mirrored data with it on demand.
 */
export const OFFSHORE_REPOSITORY = "TsinjoNantosoa/offshore-fares-ai-automation";

/** Commit the mirrored rules were last reviewed against (2026-10-14). Bump after reviewing a divergence. */
export const OFFSHORE_REVIEWED_COMMIT = "e75a234818dcf43743e89788ef5ede44a1932dc5";

/** Source files and what is mirrored from each. */
export const OFFSHORE_SOURCES = {
  transitions: { path: "database/schema.sql", mirroredIn: "transitions.ts (ALLOWED_TRANSITIONS)" },
  statuses: { path: "lib/stateMachine.js", mirroredIn: "types.ts (RFQ_STATUSES)" },
  priority: { path: "lib/priority.js", mirroredIn: "rules.ts (PRIORITY_WEIGHTS, levelForScore, calculatePriority)" },
  routing: { path: "lib/routing.js", mirroredIn: "rules.ts (routeToDesk)" },
  config: { path: "lib/config.js", mirroredIn: "rules.ts (GROUP_MIN_PASSENGERS)" },
} as const;
