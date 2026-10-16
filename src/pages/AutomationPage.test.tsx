import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AutomationPage from "./AutomationPage";
import CaseStudyPage from "./CaseStudyPage";
import LabPage from "./LabPage";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { featuredProjects } from "@/data/projects";

const renderAt = (path: string, extra?: React.ReactNode) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <I18nProvider>
          <Routes>
            <Route path="/lab" element={<LabPage />} />
            <Route path="/lab/automation" element={<AutomationPage />} />
            <Route path="/work/:slug" element={<CaseStudyPage />} />
          </Routes>
          {extra}
        </I18nProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );

/** Starts a preset run, switches autoplay off, and jumps to the human approval gate. */
const startAndReachApproval = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: "Run Automation Demo" }));
  await user.click(screen.getByRole("checkbox", { name: "Play automatically" }));
  await user.click(screen.getByRole("button", { name: "Skip to approval" }));
  return screen.getByRole("heading", { name: /Human approval required/ });
};

describe("Business Automation Showcase", () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = () => undefined;
  });

  it("explains that the demo is simulated and uses fictional data", () => {
    renderAt("/lab/automation");

    expect(screen.getByRole("heading", { level: 1, name: "Business Automation Showcase" })).toBeInTheDocument();
    expect(screen.getByText("From Customer Request to Controlled AI Workflow")).toBeInTheDocument();
    expect(screen.getByText("Demo data only — no live fare availability, reservation or payment.")).toBeInTheDocument();
    expect(screen.getByText(/does not call n8n, OpenAI, or any server/)).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    for (const link of screen.getAllByRole("link", { name: "Explore GitHub Project" })) {
      expect(link).toHaveAttribute("href", "https://github.com/TsinjoNantosoa/offshore-fares-ai-automation");
    }
  });

  it("shows preset dates that agree with the displayed lead time", async () => {
    const user = userEvent.setup();
    renderAt("/lab/automation");

    expect(screen.getByText("Request received (simulated date)")).toBeInTheDocument();
    expect(screen.getByText("2027-03-10")).toBeInTheDocument();
    expect(screen.getByText("2027-03-17 · 7 days ahead")).toBeInTheDocument();
    expect(screen.getByText("2027-03-25")).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: /Corporate Travel/ }));
    expect(screen.getByText("2027-03-12 · 2 days ahead")).toBeInTheDocument();
    expect(screen.getByText("2027-03-19")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Switch to French" }));
    expect(screen.getByText("Demande reçue (date simulée)")).toBeInTheDocument();
    expect(screen.getByText("2027-03-12 · dans 2 jours")).toBeInTheDocument();
  });

  it("implements the radio group keyboard pattern with a single tab stop", async () => {
    const user = userEvent.setup();
    renderAt("/lab/automation");
    const radios = screen.getAllByRole("radio");
    const tabindexes = () => radios.map((radio) => radio.getAttribute("tabindex"));
    const checked = () => radios.map((radio) => radio.getAttribute("aria-checked"));

    expect(tabindexes()).toEqual(["0", "-1", "-1"]);
    radios[0].focus();

    await user.keyboard("{ArrowRight}");
    expect(radios[1]).toHaveFocus();
    expect(checked()).toEqual(["false", "true", "false"]);
    expect(tabindexes()).toEqual(["-1", "0", "-1"]);

    await user.keyboard("{ArrowDown}");
    expect(radios[2]).toHaveFocus();
    expect(screen.getByLabelText("Departure city or airport")).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(radios[0]).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(radios[2]).toHaveFocus();
    await user.keyboard("{Home}");
    expect(radios[0]).toHaveFocus();
    await user.keyboard("{End}");
    expect(radios[2]).toHaveFocus();
    expect(checked()).toEqual(["false", "false", "true"]);

    await user.tab();
    expect(radios).not.toContain(document.activeElement);
  });

  it("is reachable from the AI Engineering Lab and from the Offshore Fares case study", () => {
    const lab = renderAt("/lab");
    expect(screen.getByRole("link", { name: "Try the Business Automation Showcase" })).toHaveAttribute("href", "/lab/automation");
    lab.unmount();

    expect(featuredProjects.find((project) => project.slug === "offshore-fares")?.labDemoLink).toBe("/lab/automation");
    renderAt("/work/offshore-fares");
    expect(screen.getByRole("link", { name: "Try the interactive automation demo" })).toHaveAttribute("href", "/lab/automation");
  });

  it("runs the approve path to a simulated booking request without any network call", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    renderAt("/lab/automation");

    const heading = await startAndReachApproval(user);
    expect(heading).toHaveFocus();
    expect(screen.getByTestId("rfq-status")).toHaveTextContent("PENDING_APPROVAL");
    expect(screen.getAllByText(/DEMO-RFQ-\d{6}/).length).toBeGreaterThan(0);
    expect(screen.getByText("Aurora Airways")).toBeInTheDocument();
    expect(screen.queryByTestId("outcome")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Approve" }));
    expect(screen.getByTestId("rfq-status")).toHaveTextContent("APPROVED");

    for (let i = 0; i < 3; i += 1) await user.click(screen.getByRole("button", { name: "Run next step" }));
    expect(screen.getByTestId("outcome")).toHaveTextContent("Simulation completed");
    expect(screen.getByTestId("rfq-status")).toHaveTextContent("BOOKING_REQUESTED");
    expect(screen.getByTestId("transition-history")).toHaveTextContent("QUOTED");
    expect(screen.getByText(/No email, reservation, payment or ticket exists/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "View Execution Trace" }));
    expect(screen.getByRole("heading", { name: "Execution trace" })).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("stops after a rejection and offers no further action except restarting", async () => {
    const user = userEvent.setup();
    renderAt("/lab/automation");
    await startAndReachApproval(user);

    await user.click(screen.getByRole("button", { name: "Reject" }));

    expect(screen.getByTestId("outcome")).toHaveTextContent("Workflow stopped: quote rejected");
    expect(screen.getByTestId("rfq-status")).toHaveTextContent("SEARCHING");
    expect(screen.queryByRole("button", { name: "Run next step" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Approve" })).not.toBeInTheDocument();
    expect(screen.getByTestId("transition-history")).not.toHaveTextContent("BOOKING_REQUESTED");
    expect(screen.getByText("Rejected", { selector: "li" })).toHaveTextContent("Rejected · v1");

    await user.click(screen.getByRole("button", { name: "Restart Demo" }));
    expect(screen.getByRole("button", { name: "Run Automation Demo" })).toBeInTheDocument();
  });

  it("creates a new quote version on revision and limits revisions to two", async () => {
    const user = userEvent.setup();
    renderAt("/lab/automation");
    await startAndReachApproval(user);

    await user.click(screen.getByRole("button", { name: "Request Revision" }));
    expect(screen.getByRole("heading", { name: "Quote v2" })).toBeInTheDocument();
    expect(screen.getByText(/Revision: the fare desk rechecked OPT-001/)).toBeInTheDocument();
    expect(screen.getByTestId("rfq-status")).toHaveTextContent("PENDING_APPROVAL");

    await user.click(screen.getByRole("button", { name: "Request Revision" }));
    expect(screen.getByRole("heading", { name: "Quote v3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Request Revision" })).toBeDisabled();
    expect(screen.getByText(/Revision limit reached for this demo/)).toBeInTheDocument();
  });

  it("validates a custom request and never starts with inconsistent input", async () => {
    const user = userEvent.setup();
    renderAt("/lab/automation");
    await user.click(screen.getByRole("radio", { name: /Custom Request/ }));

    const origin = screen.getByLabelText("Departure city or airport");
    await user.clear(origin);
    await user.type(origin, "BOM123");
    const destination = screen.getByLabelText("Destination");
    await user.clear(destination);
    await user.type(destination, "BOM123x");
    await user.click(screen.getByRole("button", { name: "Run Automation Demo" }));

    expect(screen.getAllByText(/Use letters only/).length).toBeGreaterThan(0);
    expect(origin).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Please fix the highlighted fields.")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

    await user.clear(origin);
    await user.type(origin, "Oslo");
    await user.clear(destination);
    await user.type(destination, "oslo");
    await user.click(screen.getByRole("button", { name: "Run Automation Demo" }));
    expect(screen.getByText("Destination must differ from the departure city.")).toBeInTheDocument();

    await user.clear(destination);
    await user.type(destination, "Lima");
    await user.click(screen.getByRole("button", { name: "Run Automation Demo" }));
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByTestId("rfq-status")).toHaveTextContent("NEW");
  });

  it("is operable by keyboard at the approval gate", async () => {
    const user = userEvent.setup();
    renderAt("/lab/automation");
    const heading = await startAndReachApproval(user);
    expect(heading).toHaveFocus();

    await user.tab();
    const approve = screen.getByRole("button", { name: "Approve" });
    expect(approve).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByTestId("rfq-status")).toHaveTextContent("APPROVED");
  });

  it("shows engineering detail: transitions, allowed next statuses and synthetic payloads", async () => {
    const user = userEvent.setup();
    renderAt("/lab/automation");
    await startAndReachApproval(user);

    expect(screen.queryByText("Allowed next statuses:", { exact: false })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Engineering view" }));

    expect(screen.getByText("Allowed next statuses:", { exact: false })).toBeInTheDocument();
    expect(screen.getAllByText("Synthetic payload").length).toBeGreaterThan(0);
    const aiStep = screen.getByText("Intent classification").closest("li") as HTMLElement;
    expect(within(aiStep).getByText("Simulated AI classification")).toBeInTheDocument();
  });

  it("provides complete French copy and a translated demo-data warning", async () => {
    const user = userEvent.setup();
    renderAt("/lab/automation");
    await user.click(screen.getByRole("button", { name: "Switch to French" }));

    expect(screen.getByText("De la demande client à l’automatisation métier contrôlée")).toBeInTheDocument();
    expect(
      screen.getByText("Données de démonstration uniquement — aucune disponibilité tarifaire réelle, réservation ni paiement."),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Lancer la simulation" }));
    await user.click(screen.getByRole("checkbox", { name: "Lecture automatique" }));
    await user.click(screen.getByRole("button", { name: "Aller à la validation" }));
    expect(screen.getByRole("heading", { name: /Validation humaine requise/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Demander une révision" })).toBeInTheDocument();
  });
});
