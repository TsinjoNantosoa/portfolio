import { describe, expect, it } from "vitest";
import { resolveApiConfiguration } from "./assistant-config";

describe("assistant API configuration", () => {
  it("allows localhost only in development", () => {
    expect(resolveApiConfiguration(undefined, true)).toEqual({ apiBaseUrl: "http://localhost:8000", available: true });
  });

  it("disables the assistant when production configuration is missing", () => {
    expect(resolveApiConfiguration(undefined, false)).toEqual({ apiBaseUrl: "", available: false });
  });

  it("normalizes the configured Render URL", () => {
    expect(resolveApiConfiguration("https://tsinjo-ai.onrender.com/", false)).toEqual({ apiBaseUrl: "https://tsinjo-ai.onrender.com", available: true });
  });
});
