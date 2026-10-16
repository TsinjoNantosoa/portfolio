import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import OperationsPage from "./OperationsPage";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { getOperationsSummary } from "@/features/operations/api";
import type { OperationsSummary } from "@/features/operations/types";

vi.mock("@/features/operations/api", () => ({ getOperationsSummary: vi.fn() }));

const available: OperationsSummary = {
  status: "available",
  period: "24h",
  period_start: "2026-10-15T08:00:00Z",
  period_end: "2026-10-16T08:00:00Z",
  metrics: {
    requests: 12,
    successful_requests: 11,
    errors: 1,
    success_rate: 91.67,
    error_rate: 8.33,
    refusals: 2,
    p50_latency_ms: 240,
    p95_latency_ms: 780,
    retrieval_p95_ms: 120,
    generation_p95_ms: 610,
    input_tokens: null,
    output_tokens: null,
  },
  request_distribution: { assistant: 8, playground: 3, test: 1, demo: 0 },
  error_distribution: { timeout: 1 },
  last_event_at: "2026-10-16T07:59:00Z",
  last_updated: "2026-10-16T08:00:00Z",
  measurement_note: "Process-local accepted AI operations; not uptime or billing data.",
};

const renderPage = () => render(
  <MemoryRouter initialEntries={["/lab/operations"]}>
    <ThemeProvider>
      <I18nProvider>
        <OperationsPage />
      </I18nProvider>
    </ThemeProvider>
  </MemoryRouter>,
);

describe("AI Operations Monitor", () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
    vi.mocked(getOperationsSummary).mockReset();
  });

  it("renders real aggregate values without claiming uptime or billed cost", async () => {
    vi.mocked(getOperationsSummary).mockResolvedValue(available);
    renderPage();

    expect(await screen.findByText("Recent operational data available")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("border-neon");
    expect(screen.getByText(/91[.,]67%/)).toBeInTheDocument();
    expect(screen.getByText("780 ms")).toBeInTheDocument();
    expect(screen.getByText(/not an uptime measurement/i)).toBeInTheDocument();
    expect(screen.getByText(/not presented as billed cost/i)).toBeInTheDocument();
    expect(screen.queryByText(/visitor question/i)).not.toBeInTheDocument();
  });

  it("renders disabled values honestly and supports French", async () => {
    vi.mocked(getOperationsSummary).mockResolvedValue({
      ...available,
      status: "disabled",
      metrics: Object.fromEntries(Object.keys(available.metrics).map((key) => [key, null])) as unknown as OperationsSummary["metrics"],
      request_distribution: { assistant: 0, playground: 0, test: 0, demo: 0 },
      error_distribution: {},
      last_event_at: null,
    });
    renderPage();
    await userEvent.click(screen.getByRole("button", { name: "Switch to French" }));

    expect(await screen.findByText("Le monitoring public des opérations est désactivé par configuration. Aucun événement n’est collecté.")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("border-white/25");
    expect(screen.getByRole("heading", { level: 1, name: "Moniteur d’opérations IA" })).toBeInTheDocument();
    expect(screen.getByText(/Aucune question, réponse, adresse IP/i)).toBeInTheDocument();
  });

  it("uses distinct visual states for no-data and stale summaries", async () => {
    const noData: OperationsSummary = {
      ...available,
      status: "no_data",
      metrics: Object.fromEntries(Object.keys(available.metrics).map((key) => [key, null])) as unknown as OperationsSummary["metrics"],
      request_distribution: { assistant: 0, playground: 0, test: 0, demo: 0 },
      error_distribution: {},
      last_event_at: null,
    };
    vi.mocked(getOperationsSummary).mockResolvedValueOnce(noData).mockResolvedValueOnce({ ...available, status: "stale" });
    renderPage();

    expect(await screen.findByText("No operation has been recorded in this process window")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("border-sky-400");
    await userEvent.click(screen.getByRole("button", { name: "Refresh metrics" }));
    expect(await screen.findByText("The latest operation is older than the freshness threshold")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("border-amber-400");
  });

  it("exposes a retry action after a safe loading error", async () => {
    vi.mocked(getOperationsSummary)
      .mockRejectedValueOnce(new Error("private backend detail"))
      .mockResolvedValueOnce(available);
    renderPage();

    expect(await screen.findByText("Operational metrics are temporarily unavailable.")).toBeInTheDocument();
    expect(screen.queryByText("private backend detail")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("border-red-400");
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() => expect(screen.getByText("Recent operational data available")).toBeInTheDocument());
  });
});
