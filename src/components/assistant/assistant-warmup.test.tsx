import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PortfolioAssistant from "./PortfolioAssistant";
import { AssistantApiError, createPublicSession } from "./assistant-api";
import { assistantConfig } from "./assistant-config";
import { createSessionWithRetry, isColdStartError, sessionRetryBudgetMs, warmAssistantService } from "./assistant-warmup";

vi.mock("./assistant-api", async () => {
  const actual = await vi.importActual<typeof import("./assistant-api")>("./assistant-api");
  return { ...actual, createPublicSession: vi.fn(), streamChat: vi.fn() };
});

const mockedCreateSession = vi.mocked(createPublicSession);
const session = { token: "token", session_id: "session-1", expires_at: "2099-01-01T00:00:00Z" };

describe("warmAssistantService", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({}));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends one opaque health check per session and nothing else", () => {
    warmAssistantService("https://api.example.test");
    warmAssistantService("https://api.example.test");
    const calls = vi.mocked(fetch).mock.calls;
    expect(calls).toHaveLength(1);
    expect(calls[0][0]).toBe("https://api.example.test/health");
    expect(calls[0][1]).toMatchObject({ mode: "no-cors", cache: "no-store" });
    expect(calls[0][1]).not.toHaveProperty("body");
    expect(calls[0][1]).not.toHaveProperty("headers");
  });

  it.each(["doNotTrack", "globalPrivacyControl"])("is skipped when the browser signals %s", (signal) => {
    Object.defineProperty(navigator, signal, { value: signal === "doNotTrack" ? "1" : true, configurable: true });
    try {
      warmAssistantService("https://api.example.test");
      expect(fetch).not.toHaveBeenCalled();
    } finally {
      Reflect.deleteProperty(navigator, signal);
    }
    warmAssistantService("https://api.example.test");
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("ignores a failing request", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    expect(() => warmAssistantService("https://api.example.test")).not.toThrow();
    await Promise.resolve();
  });
});

describe("session timeout", () => {
  it("covers all retry attempts and their pauses, with room for slow attempts", () => {
    // pauses 4 + 8 + 12 s = 24 s; four attempts that each take 10 s must still fit
    expect(sessionRetryBudgetMs(0)).toBe(24_000);
    expect(sessionRetryBudgetMs(10_000)).toBe(64_000);
    expect(assistantConfig.sessionTimeoutMs).toBeGreaterThanOrEqual(sessionRetryBudgetMs(10_000));
  });
});

describe("isColdStartError", () => {
  it("recognises a host that is still starting, not a refusal", () => {
    expect(isColdStartError(new AssistantApiError("x", 503))).toBe(true);
    expect(isColdStartError(new AssistantApiError("x", 502))).toBe(true);
    expect(isColdStartError(new AssistantApiError("x", 504))).toBe(true);
    expect(isColdStartError(new TypeError("Failed to fetch"))).toBe(true);
    expect(isColdStartError(new AssistantApiError("x", 429))).toBe(false);
    expect(isColdStartError(new AssistantApiError("x", 403))).toBe(false);
    expect(isColdStartError(new Error("other"))).toBe(false);
  });
});

describe("createSessionWithRetry", () => {
  beforeEach(() => {
    mockedCreateSession.mockReset();
  });

  it("retries while the service wakes up, then succeeds", async () => {
    mockedCreateSession
      .mockRejectedValueOnce(new AssistantApiError("x", 503))
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(session);
    await expect(createSessionWithRetry("https://api.example.test", undefined, { delayMs: 1 })).resolves.toEqual(session);
    expect(mockedCreateSession).toHaveBeenCalledTimes(3);
  });

  it("gives up after the configured number of attempts", async () => {
    mockedCreateSession.mockRejectedValue(new AssistantApiError("x", 503));
    const error = await createSessionWithRetry("https://api.example.test", undefined, { attempts: 3, delayMs: 1 }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(AssistantApiError);
    expect((error as AssistantApiError).status).toBe(503);
    expect(mockedCreateSession).toHaveBeenCalledTimes(3);
  });

  it("does not retry a refusal such as rate limiting", async () => {
    mockedCreateSession.mockRejectedValue(new AssistantApiError("x", 429));
    const error = await createSessionWithRetry("https://api.example.test", undefined, { delayMs: 1 }).catch((e: unknown) => e);
    expect((error as AssistantApiError).status).toBe(429);
    expect(mockedCreateSession).toHaveBeenCalledTimes(1);
  });

  it("stops waiting when the caller aborts", async () => {
    mockedCreateSession.mockRejectedValue(new AssistantApiError("x", 503));
    const controller = new AbortController();
    const result = createSessionWithRetry("https://api.example.test", controller.signal, { delayMs: 60_000 });
    await Promise.resolve();
    controller.abort();
    const error = await result.catch((e: unknown) => e);
    expect((error as DOMException).name).toBe("AbortError");
  });
});

describe("assistant connecting state", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    mockedCreateSession.mockReset();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("explains the wait when the service is slow to answer", () => {
    mockedCreateSession.mockReturnValue(new Promise(() => undefined));
    render(<PortfolioAssistant onClose={() => undefined} />);
    expect(screen.getByRole("status")).toHaveTextContent("Connecting to Tsinjo AI");
    act(() => {
      vi.advanceTimersByTime(4200);
    });
    expect(screen.getByRole("status")).toHaveTextContent("Waking up the service");
  });
});
