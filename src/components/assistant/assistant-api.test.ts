import { describe, expect, it, vi } from "vitest";
import { AssistantApiError, createPublicSession, streamChat } from "./assistant-api";

const session = { token: "token", session_id: "session", expires_at: "2099-01-01T00:00:00Z" };

describe("assistant API client", () => {
  it("parses split and multiple SSE events including the final buffer", async () => {
    const encoder = new TextEncoder();
    const body = new ReadableStream({ start(controller) { controller.enqueue(encoder.encode('data: {"type":"delta","text":"Hel')); controller.enqueue(encoder.encode('lo"}\n\ndata: {"type":"done","sources":[]}')); controller.close(); } });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(body, { status: 200, headers: { "Content-Type": "text/event-stream" } }));
    const events = [];
    await streamChat("https://api.test", session, "question", (event) => events.push(event));
    expect(events).toEqual([{ type: "delta", text: "Hello" }, { type: "done", sources: [] }]);
  });

  it("normalizes backend error envelopes", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ error: { code: "RATE_LIMITED", message: "Wait", request_id: "req-1" } }), { status: 429 }));
    await expect(createPublicSession("https://api.test")).rejects.toMatchObject({ status: 429, code: "RATE_LIMITED", message: "Wait", requestId: "req-1" } satisfies Partial<AssistantApiError>);
  });

  it("rejects malformed SSE data", async () => {
    const body = new Response('data: {"type":broken}\n\n').body;
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(body, { status: 200 }));
    await expect(streamChat("https://api.test", session, "question", () => undefined)).rejects.toMatchObject({ code: "INVALID_STREAM" });
  });

  it("rejects a stream that ends without a done event", async () => {
    const body = new Response('data: {"type":"delta","text":"partial"}\n\n').body;
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(body, { status: 200 }));
    await expect(streamChat("https://api.test", session, "question", () => undefined)).rejects.toMatchObject({ code: "INCOMPLETE_STREAM" });
  });
});
