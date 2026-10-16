import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CaseStudyPage from "./CaseStudyPage";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";

const renderCaseStudy = () =>
  render(
    <MemoryRouter initialEntries={["/work/sihia"]}>
      <ThemeProvider>
        <I18nProvider>
          <Routes>
            <Route path="/work/:slug" element={<CaseStudyPage />} />
          </Routes>
        </I18nProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );

describe("Case Studies V2", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders dated SIHIA validation, limitations, navigation, and French copy", async () => {
    renderCaseStudy();

    expect(screen.getByRole("heading", { level: 1, name: "SIHIA — AI-Powered HealthTech Platform" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Evaluation & Testing" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Current Limitations" })).toBeInTheDocument();
    expect(screen.getAllByText("Documented validation · 2026-08-11")).toHaveLength(2);
    expect(screen.getByRole("navigation", { name: "Case study sections" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Switch to French" }));

    expect(screen.getByRole("heading", { name: "Évaluation et tests" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Limites actuelles" })).toBeInTheDocument();
    expect(screen.getAllByText("Validation documentée · 11/08/2026")).toHaveLength(2);
  });
});
