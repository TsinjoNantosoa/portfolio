// Compares the Business Automation Showcase's mirrored rules with the Offshore Fares reference
// repository (read-only HTTP GET of public files). Never used at build or runtime.
//   npm run check:offshore
//   OFFSHORE_REF=<branch|sha> npm run check:offshore
import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["vitest", "run", "src/features/automation/offshore-sync.test.ts"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, OFFSHORE_SYNC: "1" },
});
process.exit(result.status ?? 1);
