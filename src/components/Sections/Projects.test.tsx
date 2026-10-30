import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Projects from "./Projects";
import { I18nProvider } from "@/i18n/I18nProvider";
import { featuredProjects, secondaryProjects } from "@/data/projects";

describe("Projects filters", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("filters both featured and secondary projects and can restore the complete catalog", async () => {
    const projectCount = featuredProjects.length + secondaryProjects.length;
    render(
      <MemoryRouter>
        <I18nProvider>
          <Projects />
        </I18nProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(`${projectCount} projects shown`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AI Business Operating System" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "IoT Kafka Spark Pipeline" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Data Engineering" }));

    expect(screen.getByText("4 projects shown")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "SIHIA — AI-Powered HealthTech Platform" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "IoT Kafka Spark Pipeline" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "AI Business Operating System" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "All Projects" }));

    expect(screen.getByText(`${projectCount} projects shown`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AI Business Operating System" })).toBeInTheDocument();
  });
});
