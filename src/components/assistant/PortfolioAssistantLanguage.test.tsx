import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PortfolioAssistant from "./PortfolioAssistant";
import { createPublicSession, streamChat } from "./assistant-api";

vi.mock("./assistant-api", async () => {
  const actual = await vi.importActual<typeof import("./assistant-api")>("./assistant-api");
  return { ...actual, createPublicSession: vi.fn(), streamChat: vi.fn() };
});

const mockedCreateSession = vi.mocked(createPublicSession);
const mockedStreamChat = vi.mocked(streamChat);
const session = { token: "token", session_id: "session-1", expires_at: "2099-01-01T00:00:00Z" };

describe("PortfolioAssistant language of the conversation", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    mockedCreateSession.mockResolvedValue(session);
    mockedStreamChat.mockReset();
  });

  it("answers in French, with French labels, to a French question on the English site", async () => {
    mockedStreamChat.mockImplementation(async (_url, _session, _message, onEvent) => {
      onEvent({ type: "delta", text: "Bonjour !" });
      onEvent({
        type: "done",
        sources: [{ title: "Contact and public profiles", section: "Public links", url: "/work/offshore-fares" }],
        suggested_links: [{ label: "View GitHub", url: "https://github.com/TsinjoNantosoa" }],
        suggested_questions: ["Which projects should I review first?"],
      });
    });
    render(<PortfolioAssistant onClose={() => undefined} />);
    await waitFor(() => expect(mockedCreateSession).toHaveBeenCalled());
    await userEvent.type(screen.getByLabelText("Message Tsinjo AI"), "salut comment ca va");
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText("Bonjour !")).toBeInTheDocument();
    expect(mockedStreamChat.mock.calls[0][2]).toBe("[Répondez en français.]\n\nsalut comment ca va");
    expect(screen.getByRole("link", { name: /Contact et profils publics · Liens publics/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Voir GitHub/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Quels projets dois-je consulter en premier ?" })).toBeInTheDocument();
    expect(screen.getByText("Explorer")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copier la réponse" })).toBeInTheDocument();
  });

  it("keeps English labels for an English question", async () => {
    mockedStreamChat.mockImplementation(async (_url, _session, _message, onEvent) => {
      onEvent({ type: "delta", text: "Hello!" });
      onEvent({
        type: "done",
        sources: [],
        suggested_links: [{ label: "View GitHub", url: "https://github.com/TsinjoNantosoa" }],
        suggested_questions: ["Which projects should I review first?"],
      });
    });
    render(<PortfolioAssistant onClose={() => undefined} />);
    await waitFor(() => expect(mockedCreateSession).toHaveBeenCalled());
    await userEvent.type(screen.getByLabelText("Message Tsinjo AI"), "hi how are you");
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText("Hello!")).toBeInTheDocument();
    expect(mockedStreamChat.mock.calls[0][2]).toBe("[Answer in English.]\n\nhi how are you");
    expect(screen.getByRole("link", { name: /View GitHub/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy answer" })).toBeInTheDocument();
  });
});
