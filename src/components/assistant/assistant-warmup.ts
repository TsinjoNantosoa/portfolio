import { AssistantApiError, createPublicSession } from "./assistant-api";
import type { SessionResponse } from "./assistant-types";

/**
 * The assistant API runs on a host that puts idle services to sleep. The first request after a pause can
 * take up to a minute, and the host answers 502/503/504 or drops the connection until the service is back.
 * Two things make that wait invisible or at least understandable: waking the service early, and retrying
 * the session request instead of showing an error straight away.
 */

const WARMED_KEY = "tsinjo:assistant-warmed";

function privacySignalsOptOut(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; doNotTrack?: string | null };
  return nav.globalPrivacyControl === true || nav.doNotTrack === "1" || (window as Window & { doNotTrack?: string }).doNotTrack === "1";
}

/** Wakes the service once per browser session. Sends no message and no identifier; the answer is ignored. */
export function warmAssistantService(apiBaseUrl: string): void {
  // The early request is optional, so it is skipped when the browser asks not to be tracked.
  if (privacySignalsOptOut()) return;
  try {
    if (window.sessionStorage.getItem(WARMED_KEY) === "1") return;
    window.sessionStorage.setItem(WARMED_KEY, "1");
  } catch {
    /* storage unavailable: at worst the request is sent again on the next page load */
  }
  void fetch(`${apiBaseUrl}/health`, { mode: "no-cors", cache: "no-store" }).catch(() => undefined);
}

/** A failure that usually means "the service is still starting", as opposed to a refusal or a timeout we set. */
export function isColdStartError(error: unknown): boolean {
  if (error instanceof AssistantApiError) return error.status === 502 || error.status === 503 || error.status === 504;
  // fetch rejects with a TypeError when the connection is dropped or refused while the host boots
  return error instanceof TypeError;
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const timer = window.setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });

export const SESSION_RETRY_ATTEMPTS = 4;
export const SESSION_RETRY_DELAY_MS = 4000;

/**
 * Longest time the retries can take: every attempt at its slowest plus the pauses between them
 * (4 s, 8 s, 12 s). The session timeout in `assistant-config.ts` must stay above this.
 */
export const sessionRetryBudgetMs = (perAttemptMs: number): number => {
  let total = SESSION_RETRY_ATTEMPTS * perAttemptMs;
  for (let attempt = 1; attempt < SESSION_RETRY_ATTEMPTS; attempt += 1) total += SESSION_RETRY_DELAY_MS * attempt;
  return total;
};

export async function createSessionWithRetry(
  apiBaseUrl: string,
  signal?: AbortSignal,
  options: { attempts?: number; delayMs?: number } = {},
): Promise<SessionResponse> {
  const attempts = options.attempts ?? SESSION_RETRY_ATTEMPTS;
  const delayMs = options.delayMs ?? SESSION_RETRY_DELAY_MS;
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await createPublicSession(apiBaseUrl, signal);
    } catch (error) {
      if (attempt >= attempts || !isColdStartError(error)) throw error;
      await wait(delayMs * attempt, signal);
    }
  }
}
