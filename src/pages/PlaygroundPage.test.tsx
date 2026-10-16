import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import PlaygroundPage from "./PlaygroundPage";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";

const session = {
  token: "test-token",
  expires_at: "2099-01-01T00:00:00Z",
  session_id: "session-1",
};

const response = {
  answer: "SIHIA combines dense retrieval with BM25.",
  corpus: "projects",
  execution_mode: "live",
  grounded: true,
  refusal_reason: null,
  evidence: [
    {
      id: "project:sihia:architecture",
      rank: 1,
      title: "SIHIA",
      section: "Architecture",
      url: "/work/sihia",
      excerpt: "Dense search and BM25 are fused before reranking.",
      score: 0.91,
    },
  ],
  trace: [
    { id: "query", status: "completed", detail: "Accepted.", duration_ms: 0.1 },
    { id: "processing", status: "completed", detail: "Validated.", duration_ms: 0.2 },
    { id: "retrieval", status: "completed", detail: "Retrieved.", duration_ms: 8.4 },
    { id: "context", status: "completed", detail: "Selected.", duration_ms: 0.1 },
    { id: "generation", status: "completed", detail: "Generated.", duration_ms: 30 },
    { id: "answer", status: "completed", detail: "Grounded.", duration_ms: 0.1 },
    { id: "citations", status: "completed", detail: "Attached.", duration_ms: 0.1 },
  ],
  retrieval_strategy: "Dense retrieval + lexical reranking",
  selected_passages: 1,
  response_time_ms: 39.2,
  limitations: ["Public corpus only."],
  request_id: "request-1",
};

const renderPage = () => render(
  <MemoryRouter initialEntries={["/lab/playground"]}>
    <ThemeProvider>
      <I18nProvider>
        <PlaygroundPage />
      </I18nProvider>
    </ThemeProvider>
  </MemoryRouter>,
);

describe("Public RAG Playground", () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
    vi.restoreAllMocks();
  });

  it("runs a preset question and renders matching evidence and real trace", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify(session), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    renderPage();

    await userEvent.click(screen.getByRole("button", { name: "How does SIHIA combine dense and lexical retrieval?" }));
    await userEvent.click(screen.getByRole("button", { name: "Run retrieval" }));

    expect(await screen.findByText(response.answer)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open public source" })).toHaveAttribute("href", "/work/sihia");
    expect(screen.getByText("0.910")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "LLM Generation" })).toBeInTheDocument();
    const request = JSON.parse(String(fetchMock.mock.calls[1][1]?.body));
    expect(request.corpus).toBe("projects");
    expect(request.conversation_id).toBe("session-1");
  });

  it("switches corpus without automatically triggering a paid request", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    renderPage();

    await userEvent.click(screen.getByRole("button", { name: /AI Engineering Lab/ }));
    await userEvent.click(screen.getByRole("button", { name: "Which controls are used for governed AI agents?" }));

    expect(screen.getByLabelText("3. Ask the corpus")).toHaveValue("Which controls are used for governed AI agents?");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("preserves complete French controls and handles a safe API error", async () => {
    localStorage.setItem("tsinjo:language", "fr");
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify(session), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: { code: "ASSISTANT_UNAVAILABLE", message: "Unavailable" } }), { status: 503 }));
    renderPage();

    expect(screen.getByRole("heading", { level: 1, name: "Playground RAG public" })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("3. Interroger le corpus"), "Comment fonctionne SIHIA ?");
    await userEvent.click(screen.getByRole("button", { name: "Lancer la recherche" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("attend une validation de production");
    await waitFor(() => expect(screen.getByLabelText("3. Interroger le corpus")).toHaveValue("Comment fonctionne SIHIA ?"));
  });
});
