import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearMessages, clearSession, getSession, isSessionExpired, readMessages, saveMessages, saveSession } from "./assistant-session";

describe("assistant session storage", () => {
  beforeEach(() => sessionStorage.clear());

  it("stores a valid anonymous session in sessionStorage", () => {
    const session = { token: "public-token", session_id: "session-1", expires_at: new Date(Date.now() + 60_000).toISOString() };
    saveSession(session);
    expect(getSession()).toEqual(session);
    clearSession();
    expect(getSession()).toBeNull();
  });

  it("rejects expired sessions", () => {
    vi.setSystemTime(new Date("2026-09-08T12:00:00Z"));
    const expired = { token: "token", session_id: "session", expires_at: "2026-09-08T11:59:00Z" };
    expect(isSessionExpired(expired)).toBe(true);
    saveSession(expired);
    expect(getSession()).toBeNull();
    vi.useRealTimers();
  });

  it("keeps only the latest 20 messages", () => {
    saveMessages(Array.from({ length: 25 }, (_, index) => ({ id: String(index), role: "user" as const, text: String(index) })));
    expect(readMessages()).toHaveLength(20);
    expect(readMessages()[0].id).toBe("5");
    clearMessages();
    expect(readMessages()).toEqual([]);
  });
});
