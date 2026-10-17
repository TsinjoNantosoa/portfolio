import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AutomationPage from "./AutomationPage";
import CaseStudyPage from "./CaseStudyPage";
import Index from "./Index";
import LabPage from "./LabPage";
import NotFound from "./NotFound";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";

const SITE = "https://tsinjona.netlify.app";

const renderAt = (initialPath: string) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <ThemeProvider>
        <I18nProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/lab" element={<LabPage />} />
            <Route path="/lab/automation" element={<AutomationPage />} />
            <Route path="/work/:slug" element={<CaseStudyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </I18nProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );

const head = (selector: string, attribute = "content") => document.head.querySelector(selector)?.getAttribute(attribute);

describe("page metadata", () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = () => undefined;
    document.head.innerHTML = "";
    document.title = "";
  });

  it("keeps a case study's own title, description, canonical and Open Graph tags after a language switch", async () => {
    renderAt("/work/multi-tenant-rag");
    const englishTitle = document.title;
    const englishDescription = head('meta[name="description"]');
    expect(englishTitle).toBe("Enterprise RAG & AI Commercial Agent Platform — Case Study");
    expect(head('link[rel="canonical"]', "href")).toBe(`${SITE}/work/multi-tenant-rag`);

    await userEvent.click(screen.getByRole("button", { name: /Switch to French/ }));

    // Regression: the language provider used to overwrite title and description with the home page's.
    expect(document.title).toBe("Enterprise RAG & AI Commercial Agent Platform — Étude de cas");
    expect(document.title).not.toMatch(/Ingénieur IA \(RAG/);
    expect(head('meta[name="description"]')).not.toBe(englishDescription);
    expect(head('meta[name="description"]')).not.toMatch(/^Ingénieur IA spécialisé/);
    expect(head('link[rel="canonical"]', "href")).toBe(`${SITE}/work/multi-tenant-rag`);
    expect(head('meta[property="og:url"]')).toBe(`${SITE}/work/multi-tenant-rag`);
    expect(head('meta[property="og:title"]')).toBe(document.title);
    expect(document.documentElement.lang).toBe("fr");
  });

  it("keeps a lab page's description in the visitor's language and its URL tags unchanged", async () => {
    renderAt("/lab");
    expect(head('meta[name="description"]')).toMatch(/^Methods, architectures/);
    await userEvent.click(screen.getByRole("button", { name: /Switch to French/ }));
    expect(head('meta[name="description"]')).toMatch(/^Méthodes, architectures/);
    expect(document.title).toBe("AI Engineering Lab — Tsinjo");
    expect(head('meta[property="og:url"]')).toBe(`${SITE}/lab`);
    expect(head('link[rel="canonical"]', "href")).toBe(`${SITE}/lab`);
  });

  it("gives the automation showcase its own Open Graph tags (previously inherited from the home page)", () => {
    renderAt("/lab/automation");
    expect(head('meta[property="og:url"]')).toBe(`${SITE}/lab/automation`);
    expect(head('meta[property="og:title"]')).toBe("Business Automation Showcase — Tsinjo");
    expect(head('meta[name="twitter:title"]')).toBe("Business Automation Showcase — Tsinjo");
  });

  it("uses the home page record on the home route, with no page-level JSON-LD", () => {
    renderAt("/");
    expect(document.title).toBe("Sandaniaina Tsinjo Nantosoa — AI Engineer (RAG & AI Agents)");
    expect(head('link[rel="canonical"]', "href")).toBe(`${SITE}/`);
    expect(document.head.querySelector("script#route-jsonld")).toBeNull();
  });

  it("marks an unknown URL noindex so it is not indexed as a soft 404", () => {
    renderAt("/definitely-not-a-page");
    expect(head('meta[name="robots"]')).toBe("noindex, follow");
    expect(document.title).toBe("Page not found — Tsinjo");
  });

  it("does not index an unknown case study slug", () => {
    renderAt("/work/does-not-exist");
    expect(head('meta[name="robots"]')).toBe("noindex, follow");
  });
});
