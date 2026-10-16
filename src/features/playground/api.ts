import {
  AssistantApiError,
  createPublicSession,
} from "@/components/assistant/assistant-api";
import type { SessionResponse } from "@/components/assistant/assistant-types";
import type { PlaygroundCorpus, PlaygroundResponse } from "./types";

export async function queryPlayground(
  apiBaseUrl: string,
  session: SessionResponse,
  message: string,
  corpus: PlaygroundCorpus,
  signal?: AbortSignal,
): Promise<PlaygroundResponse> {
  const response = await fetch(`${apiBaseUrl}/api/public/playground/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({
      message,
      corpus,
      conversation_id: session.session_id,
    }),
    signal,
  });

  if (!response.ok) {
    let payload: { error?: { message?: string; code?: string; request_id?: string } } = {};
    try {
      payload = await response.json();
    } catch {
      // The public error remains generic when the server returns no JSON body.
    }
    throw new AssistantApiError(
      payload.error?.message || "The RAG Playground request failed.",
      response.status,
      payload.error?.code,
      payload.error?.request_id,
    );
  }
  return response.json() as Promise<PlaygroundResponse>;
}

export { createPublicSession };
