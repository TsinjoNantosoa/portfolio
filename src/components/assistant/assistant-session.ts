import type { ChatMessage, SessionResponse } from "./assistant-types";

const STORAGE_KEY = "tsinjo-ai:conversation";
const TOKEN_KEY = "tsinjo-ai:session";

export function isSessionExpired(session: SessionResponse, skewMs = 15_000): boolean {
  return !session.token || !session.session_id || !Number.isFinite(Date.parse(session.expires_at)) || Date.parse(session.expires_at) <= Date.now() + skewMs;
}

export function getSession(): SessionResponse | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(TOKEN_KEY) || "null") as SessionResponse | null;
    return value && !isSessionExpired(value) ? value : null;
  } catch { return null; }
}

export function saveSession(session: SessionResponse): void {
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function readMessages(): ChatMessage[] {
  try {
    const value = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.slice(-20) : [];
  } catch { return []; }
}

export function saveMessages(messages: ChatMessage[]): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
}

export function clearMessages(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
