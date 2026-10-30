import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CaseStudyPage from "./CaseStudyPage";
import { featuredProjects } from "@/data/projects";
import { labCapabilities } from "@/data/lab";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";

const renderPage = () => render(
  <MemoryRouter initialEntries={["/work/retail-ai-multi-agent"]}>
    <ThemeProvider>
      <I18nProvider>
        <Routes><Route path="/work/:slug" element={<CaseStudyPage />} /></Routes>
      </I18nProvider>
    </ThemeProvider>
  </MemoryRouter>,
);

describe("Retail AI Multi-Agent Quality Assistant case study", () => {
  beforeEach(() => localStorage.clear());

  it("keeps one evidence-backed project record and internal references", () => {
    const matches = featuredProjects.filter((project) => project.slug === "retail-ai-multi-agent");
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ maturity: "Prototype", caseStudyLink: "/work/retail-ai-multi-agent" });
    expect(matches[0].featuredLayout).toBe("wide");
    expect(matches[0].demoLink).toBeUndefined();
    expect(matches[0].labDemoLink).toBeUndefined();
    expect(matches[0].gallery).toHaveLength(5);
    expect(matches[0].gallery?.every((image) => image.fit === "contain")).toBe(true);
    expect(matches[0].retailEvidence?.agents).toHaveLength(2);
    expect(matches[0].retailEvidence?.workflowGroups.flatMap((group) => group.items)).toHaveLength(16);
    expect(labCapabilities.filter((capability) => capability.references.some((reference) => reference.slug === "retail-ai-multi-agent"))).toHaveLength(3);
  });

  it("renders the architecture, verified KPI evidence, limitations, and French copy", async () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "Retail AI Multi-Agent Quality Assistant" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Multi-agent orchestration" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Deterministic KPI engine" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Demonstration walkthrough" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Evidence gallery" })).toBeInTheDocument();
    expect(screen.getByText("Human-approved incident and audit trail")).toBeInTheDocument();
    expect(screen.getAllByText("90/100").length).toBeGreaterThan(0);
    expect(screen.getByText(/All product, sales, return, procedure/)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Demo/i })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Enlarge image: Evidence-linked quality investigation/ }));
    expect(screen.getByRole("dialog", { name: /Evidence-linked quality investigation/ })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");

    await userEvent.click(screen.getByRole("button", { name: /Switch to French/ }));
    expect(screen.getByText("Assistant multi-agent d’investigation et d’aide à la décision pour la qualité retail.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Orchestration multi-agent" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Moteur KPI déterministe" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Parcours de démonstration" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Galerie de preuves" })).toBeInTheDocument();
    expect(screen.getByText("Incident approuvé par un humain et piste d’audit")).toBeInTheDocument();
    expect(screen.getByText(/Toutes les valeurs produit, vente, retour/)).toBeInTheDocument();
  });
});
