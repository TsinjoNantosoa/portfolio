import { describe, expect, it } from "vitest";
import { enrichAssistantMetadata } from "./contextual-suggestions";

describe("enrichAssistantMetadata", () => {
  it("adds Arcwell follow-ups and case study from known routes only", () => {
    const result = enrichAssistantMetadata(
      [{ title: "Arcwell", section: "Architecture", url: "/work/arcwell-agentic-crm" }],
      [],
      [],
      "en",
    );

    expect(result.sources).toHaveLength(1);
    expect(result.suggestedLinks.some((l) => l.url === "/work/arcwell-agentic-crm")).toBe(
      true,
    );
    expect(
      result.suggestedQuestions.some((q) => q.includes("Human-in-the-Loop")),
    ).toBe(true);
    expect(result.suggestedLinks.every((l) => l.url.startsWith("/") || l.url.startsWith("https://"))).toBe(
      true,
    );
  });
});
