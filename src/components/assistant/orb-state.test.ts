import { describe, expect, it } from "vitest";
import type { AssistantStatus } from "./assistant-types";
import { toOrbState } from "./orb-state";

describe("toOrbState", () => {
  it.each<[AssistantStatus, string]>([
    ["idle", "idle"],
    ["connecting", "processing"],
    ["thinking", "processing"],
    ["streaming", "streaming"],
    ["complete", "success"],
    ["error", "error"],
    ["rate_limited", "error"],
    ["unavailable", "error"],
  ])("maps %s to %s", (status, expected) => {
    expect(toOrbState(status)).toBe(expected);
  });

  it("never reports success for a failed status", () => {
    for (const status of ["error", "rate_limited", "unavailable"] as AssistantStatus[]) {
      expect(toOrbState(status)).not.toBe("success");
    }
  });
});
