import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LabPage from "./LabPage";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { featuredProjects } from "@/data/projects";

const renderLab = () =>
  render(
    <MemoryRouter initialEntries={["/lab"]}>
      <ThemeProvider>
        <I18nProvider>
          <LabPage />
        </I18nProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );

describe("AI Engineering Lab", () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = () => undefined;
  });

  it("renders five evidence-backed capabilities and project links", () => {
    renderLab();

    expect(screen.getByRole("heading", { level: 1, name: "AI Engineering Lab" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "RAG Engineering" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Agentic AI" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AI Automation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Production Engineering" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AI-Assisted Development" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /SIHIA/i })[0]).toHaveAttribute("href", "/work/sihia");
  });

  it("provides complete French lab copy", async () => {
    renderLab();
    await userEvent.click(screen.getByRole("button", { name: "Switch to French" }));

    expect(screen.getByRole("heading", { name: "Ingénierie RAG" })).toBeInTheDocument();
    expect(screen.getAllByText("Pratiques d’ingénierie implémentées", { selector: "h3" })).toHaveLength(5);
  });
});

describe("priority case-study evidence", () => {
  it("publishes evaluation and limitations for SIHIA, AI BOS, and Arcwell", () => {
    for (const slug of ["sihia", "ai-business-os", "arcwell-agentic-crm"]) {
      const project = featuredProjects.find((item) => item.slug === slug);
      expect(project?.evaluation?.length).toBeGreaterThan(0);
      expect(project?.limitations?.length).toBeGreaterThan(0);
    }
  });
});
