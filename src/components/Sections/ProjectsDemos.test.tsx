import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Projects from "./Projects";
import { I18nProvider } from "@/i18n/I18nProvider";
import { featuredProjects } from "@/data/projects";

const renderProjects = () =>
  render(
    <MemoryRouter>
      <I18nProvider>
        <Projects />
      </I18nProvider>
    </MemoryRouter>,
  );

describe("recruiter paths from the home page", () => {
  beforeEach(() => localStorage.clear());

  it("links straight to every live demo and to the Lab", () => {
    renderProjects();
    const demos = screen.getByRole("navigation", { name: "Try the live demos" });
    const links = within(demos).getAllByRole("link");
    expect(links.map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["RAG Playground", "/lab/playground"],
      ["Automation Showcase", "/lab/automation"],
      ["AI Operations Monitor", "/lab/operations"],
      ["All AI Lab modules", "/lab"],
    ]);
  });

  it("offers each featured project's case study, and an interactive demo only where one exists", () => {
    renderProjects();
    expect(screen.getAllByRole("link", { name: /View Case Study/ })).toHaveLength(featuredProjects.length);
    const interactive = screen.getAllByRole("link", { name: /Interactive demo/ });
    expect(interactive).toHaveLength(featuredProjects.filter((project) => project.labDemoLink).length);
    expect(interactive[0]).toHaveAttribute("href", "/lab/automation");
  });

  it("translates the demo links and the interactive-demo label into French", () => {
    localStorage.setItem("tsinjo:language", "fr");
    renderProjects();
    const demos = screen.getByRole("navigation", { name: "Tester les démonstrations" });
    expect(within(demos).getAllByRole("link").map((link) => link.textContent)).toEqual([
      "Playground RAG",
      "Showcase d’automatisation",
      "Moniteur d’opérations IA",
      "Tous les modules du Lab IA",
    ]);
    expect(screen.getByRole("link", { name: /Démo interactive/ })).toHaveAttribute("href", "/lab/automation");
  });
});
