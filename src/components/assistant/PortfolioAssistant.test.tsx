import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PortfolioAssistant from "./PortfolioAssistant";
import { AssistantApiError, createPublicSession, streamChat } from "./assistant-api";

vi.mock("./assistant-api", async () => {
  const actual = await vi.importActual<typeof import("./assistant-api")>("./assistant-api");
  return { ...actual, createPublicSession: vi.fn(), streamChat: vi.fn() };
});

const mockedCreateSession = vi.mocked(createPublicSession);
const mockedStreamChat = vi.mocked(streamChat);
const session = { token: "token", session_id: "session-1", expires_at: "2099-01-01T00:00:00Z" };

describe("PortfolioAssistant", () => {
  beforeEach(() => { sessionStorage.clear(); mockedCreateSession.mockResolvedValue(session); mockedStreamChat.mockReset(); });

  it("starts in English, creates a session, and exposes privacy", async () => {
    render(<PortfolioAssistant onClose={() => undefined} />);
    expect(screen.getByText("Ask Tsinjo AI")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy.html");
    await waitFor(() => expect(mockedCreateSession).toHaveBeenCalledOnce());
  });

  it("retries initial session creation without requiring a previous question", async () => {
    mockedCreateSession
      .mockRejectedValueOnce(new Error("cold start"))
      .mockResolvedValueOnce(session);
    render(<PortfolioAssistant onClose={() => undefined} />);
    await userEvent.click(
      await screen.findByRole("button", { name: "Retry connection" }),
    );
    await waitFor(() => expect(mockedCreateSession).toHaveBeenCalledTimes(2));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Public portfolio knowledge",
    );
  });

  it("submits a message, renders stream output, sources, CTAs and follow-ups", async () => {
    mockedStreamChat.mockImplementation(async (_url, _session, _message, onEvent) => {
      onEvent({ type: "status", status: "thinking" });
      onEvent({ type: "delta", text: "**Arcwell** uses " });
      onEvent({ type: "delta", text: "`LangGraph`." });
      onEvent({ type: "done", sources: [{ title: "Arcwell", section: "Architecture", url: "/work/arcwell-agentic-crm" }], suggested_links: [{ label: "View GitHub", url: "https://github.com/TsinjoNantosoa/arcwell-agentic-crm" }, { label: "Unsafe", url: "javascript:alert(1)" }], suggested_questions: ["How does HITL work?"] });
    });
    render(<PortfolioAssistant onClose={() => undefined} />);
    await waitFor(() => expect(mockedCreateSession).toHaveBeenCalled());
    await userEvent.click(screen.getByRole("button", { name: "AI Agents" }));
    expect(await screen.findByText("Arcwell", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("LangGraph", { selector: "code" })).toBeInTheDocument();
    const internal = screen.getByRole("link", { name: /Arcwell · Architecture/ });
    expect(internal).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: "View GitHub" })).toHaveAttribute("target", "_blank");
    expect(screen.queryByRole("link", { name: "Unsafe" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "How does HITL work?" })).toBeInTheDocument();
  });

  it("shows rate limiting and supports Escape", async () => {
    const onClose = vi.fn();
    mockedStreamChat.mockRejectedValue(new AssistantApiError("Wait", 429, "RATE_LIMITED"));
    render(<PortfolioAssistant onClose={onClose} />);
    await waitFor(() => expect(mockedCreateSession).toHaveBeenCalled());
    await userEvent.type(screen.getByLabelText("Message Tsinjo AI"), "Tell me about RAG");
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(
      await screen.findAllByText("Too many requests. Please try again shortly."),
    ).toHaveLength(2);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("refreshes an expired session once and retries the stream", async () => {
    mockedCreateSession
      .mockResolvedValueOnce(session)
      .mockResolvedValueOnce({ ...session, token: "refreshed-token", session_id: "session-2" });
    mockedStreamChat
      .mockRejectedValueOnce(new AssistantApiError("Expired", 401, "SESSION_INVALID"))
      .mockImplementationOnce(async (_url, activeSession, _message, onEvent) => {
        expect(activeSession.token).toBe("refreshed-token");
        onEvent({ type: "delta", text: "Recovered after refresh." });
        onEvent({ type: "done", sources: [], suggested_links: [], suggested_questions: [] });
      });
    render(<PortfolioAssistant onClose={() => undefined} />);
    await waitFor(() => expect(mockedCreateSession).toHaveBeenCalledOnce());
    await userEvent.click(screen.getByRole("button", { name: "Backend Engineering" }));
    expect(await screen.findByText("Recovered after refresh.")).toBeInTheDocument();
    expect(mockedCreateSession).toHaveBeenCalledTimes(2);
    expect(mockedStreamChat).toHaveBeenCalledTimes(2);
  });

  it("restores retry after reload without duplicating the failed question", async () => {
    sessionStorage.setItem("tsinjo-ai:conversation", JSON.stringify([
      { id: "u-old", role: "user", text: "Tell me about Arcwell" },
      { id: "a-old", role: "assistant", text: "Temporary failure", failed: true },
    ]));
    mockedStreamChat.mockImplementation(async (_url, _session, _message, onEvent) => {
      onEvent({ type: "delta", text: "Arcwell is a governed AI CRM." });
      onEvent({ type: "done", sources: [], suggested_links: [], suggested_questions: [] });
    });
    render(<PortfolioAssistant onClose={() => undefined} />);
    await userEvent.click(screen.getByRole("button", { name: "Retry answer" }));
    expect(await screen.findByText("Arcwell is a governed AI CRM.")).toBeInTheDocument();
    expect(screen.getAllByText("Tell me about Arcwell")).toHaveLength(1);
    expect(screen.queryByText("Temporary failure")).not.toBeInTheDocument();
  });

  it("preserves partial text when the user stops a stream", async () => {
    mockedStreamChat.mockImplementation(async (_url, _session, _message, onEvent, signal) => {
      onEvent({ type: "delta", text: "Partial answer" });
      await new Promise<void>((_resolve, reject) => signal?.addEventListener("abort", () => reject(new DOMException("Stopped", "AbortError")), { once: true }));
    });
    render(<PortfolioAssistant onClose={() => undefined} />);
    await waitFor(() => expect(mockedCreateSession).toHaveBeenCalled());
    await userEvent.click(screen.getByRole("button", { name: "RAG Systems" }));
    expect(await screen.findByText("Partial answer")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Stop response" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Public portfolio knowledge"));
    expect(screen.getByText("Partial answer")).toBeInTheDocument();
  });

  it("shows a safe generic message for unexpected failures", async () => {
    mockedStreamChat.mockRejectedValue(new Error("provider-secret-details"));
    render(<PortfolioAssistant onClose={() => undefined} />);
    await waitFor(() => expect(mockedCreateSession).toHaveBeenCalled());
    await userEvent.click(screen.getByRole("button", { name: "Professional Experience" }));
    expect(await screen.findByText("Tsinjo AI is temporarily unavailable. Please try again.")).toBeInTheDocument();
    expect(screen.queryByText(/provider-secret-details/)).not.toBeInTheDocument();
  });
});

describe("PortfolioAssistant orb", () => {
  beforeEach(() => { sessionStorage.clear(); mockedCreateSession.mockResolvedValue(session); mockedStreamChat.mockReset(); });

  const orbState = () => document.querySelector(".tsinjo-ai__header .ai-orb")?.getAttribute("data-state");

  it("follows processing, streaming and success, and changes only on a transition, not on every token", async () => {
    let finish: () => void = () => undefined;
    let sendDelta: (text: string) => void = () => undefined;
    mockedStreamChat.mockImplementation((_url, _session, _message, onEvent) => new Promise<void>((resolve) => {
      onEvent({ type: "status", status: "thinking" });
      sendDelta = (text) => onEvent({ type: "delta", text });
      finish = () => { onEvent({ type: "done", sources: [], suggested_links: [], suggested_questions: [] }); resolve(); };
    }));
    render(<PortfolioAssistant onClose={() => undefined} />);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Public portfolio knowledge"));
    expect(orbState()).toBe("idle");
    const changes: string[] = [];
    const orb = document.querySelector(".tsinjo-ai__header .ai-orb") as Element;
    const observer = new MutationObserver((records) => records.forEach(() => changes.push(orb.getAttribute("data-state") || "")));
    observer.observe(orb, { attributes: true });
    await userEvent.click(screen.getByRole("button", { name: "AI Agents" }));
    await waitFor(() => expect(orbState()).toBe("processing"));
    await act(async () => { sendDelta("Hello "); });
    await waitFor(() => expect(orbState()).toBe("streaming"));
    await act(async () => { for (let index = 0; index < 25; index += 1) sendDelta("word "); });
    expect(orbState()).toBe("streaming");
    await act(async () => { finish(); });
    await waitFor(() => expect(orbState()).toBe("success"));
    await Promise.resolve();
    observer.disconnect();
    expect(changes).toEqual(["processing", "streaming", "success"]);
  });

  it("shows the error state when the stream fails, never success", async () => {
    mockedStreamChat.mockRejectedValue(new Error("network"));
    render(<PortfolioAssistant onClose={() => undefined} />);
    await waitFor(() => expect(mockedCreateSession).toHaveBeenCalled());
    await userEvent.type(screen.getByLabelText("Message Tsinjo AI"), "Tell me about RAG");
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));
    await waitFor(() => expect(orbState()).toBe("error"));
    expect(screen.getByRole("status")).toHaveTextContent("Connection interrupted");
  });

  it("shows an error orb when the assistant cannot connect, then recovers on retry", async () => {
    mockedCreateSession.mockRejectedValueOnce(new Error("down")).mockResolvedValueOnce(session);
    render(<PortfolioAssistant onClose={() => undefined} />);
    await screen.findByRole("button", { name: "Retry connection" });
    expect(orbState()).toBe("error");
    await userEvent.click(screen.getByRole("button", { name: "Retry connection" }));
    await waitFor(() => expect(orbState()).toBe("idle"));
  });

  it("keeps the conversation and its answer when the orb changes state", async () => {
    mockedStreamChat.mockImplementation(async (_url, _session, _message, onEvent) => {
      onEvent({ type: "delta", text: "Kept answer" });
      onEvent({ type: "done", sources: [], suggested_links: [], suggested_questions: [] });
    });
    render(<PortfolioAssistant onClose={() => undefined} />);
    await waitFor(() => expect(mockedCreateSession).toHaveBeenCalled());
    await userEvent.click(screen.getByRole("button", { name: "AI Agents" }));
    expect(await screen.findByText("Kept answer")).toBeInTheDocument();
    expect(orbState()).toBe("success");
  });
});
