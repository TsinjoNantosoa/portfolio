import type { SessionResponse, StreamEvent } from "./assistant-types";

export class AssistantApiError extends Error {
  constructor(message: string, public status: number, public code = "REQUEST_FAILED", public requestId?: string) { super(message); }
}

async function apiError(response: Response): Promise<AssistantApiError> {
  try {
    const payload = await response.json();
    return new AssistantApiError(payload?.error?.message || "The assistant request failed.", response.status, payload?.error?.code, payload?.error?.request_id);
  } catch { return new AssistantApiError("The assistant request failed.", response.status); }
}

export async function getHealth(apiBaseUrl: string, signal?: AbortSignal): Promise<boolean> {
  const response = await fetch(`${apiBaseUrl}/health`, { signal });
  return response.ok;
}

export async function createPublicSession(apiBaseUrl: string, signal?: AbortSignal): Promise<SessionResponse> {
  const response = await fetch(`${apiBaseUrl}/api/public/session`, { method: "POST", signal });
  if (!response.ok) throw await apiError(response);
  return response.json();
}

export async function streamChat(apiBaseUrl: string, session: SessionResponse, message: string, onEvent: (event: StreamEvent) => void, signal?: AbortSignal): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/public/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
    body: JSON.stringify({ message, conversation_id: session.session_id }),
    signal,
  });
  if (!response.ok) throw await apiError(response);
  if (!response.body) throw new AssistantApiError("Streaming is unavailable in this browser.", 0);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const parseBlock = (block: string) => {
    const data = block.split(/\r?\n/).filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trimStart()).join("\n");
    if (!data) return;
    try { onEvent(JSON.parse(data) as StreamEvent); }
    catch { throw new AssistantApiError("The assistant returned an invalid stream event.", 0, "INVALID_STREAM"); }
  };

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
    const blocks = buffer.split(/\r?\n\r?\n/);
    buffer = blocks.pop() || "";
    blocks.forEach(parseBlock);
    if (done) break;
  }
  if (buffer.trim()) parseBlock(buffer);
}
