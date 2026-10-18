import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";
import Footer from "./Footer";
import Header from "./Header";

const renderHeader = (path = "/", lang: "en" | "fr" = "en") => {
  window.localStorage.setItem("tsinjo:language", lang);
  return render(
    <ThemeProvider>
      <I18nProvider>
        <MemoryRouter initialEntries={[path]}>
          <Header />
          <Footer />
        </MemoryRouter>
      </I18nProvider>
    </ThemeProvider>,
  );
};

describe("header navigation", () => {
  beforeEach(() => {
    window.localStorage.clear();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: () => ({ matches: false, addEventListener: () => undefined, removeEventListener: () => undefined, addListener: () => undefined, removeListener: () => undefined }),
    });
  });

  it("has one path to Contact: the Let's Talk button, not a second menu link", () => {
    renderHeader();
    const primary = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(primary).queryByRole("link", { name: "Contact" })).not.toBeInTheDocument();
    expect(within(primary).queryByRole("link", { name: "Education" })).not.toBeInTheDocument();
    expect(within(primary).getByRole("link", { name: "Let's Talk" })).toHaveAttribute("href", "/#contact");
    for (const name of ["Home", "About", "Experience", "Projects", "AI Lab", "Skills"]) {
      expect(within(primary).getByRole("link", { name })).toBeInTheDocument();
    }
  });

  it("keeps Education and Contact reachable from the footer", () => {
    renderHeader();
    const footer = screen.getByRole("navigation", { name: "Footer navigation" });
    expect(within(footer).getByRole("link", { name: "Education" })).toHaveAttribute("href", "/#education");
    expect(within(footer).getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/#contact");
    expect(within(footer).getByRole("link", { name: "AI Lab" })).toHaveAttribute("href", "/lab");
  });

  it("marks the AI Lab entry as current on Lab pages", () => {
    renderHeader("/lab/playground");
    const primary = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(primary).getByRole("link", { name: "AI Lab" })).toHaveAttribute("aria-current", "true");
    expect(within(primary).getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("uses French labels and a descriptive language tooltip", () => {
    renderHeader("/", "fr");
    const primary = screen.getByRole("navigation", { name: "Navigation principale" });
    expect(within(primary).getByRole("link", { name: "Lab IA" })).toBeInTheDocument();
    expect(within(primary).getByRole("link", { name: "Discutons" })).toBeInTheDocument();
    const language = screen.getAllByRole("button", { name: /FR — Passer en anglais/ })[0];
    expect(language).toHaveAttribute("title", "Français · Passer en anglais");
  });

  it("shows the same entries, with the call to action, in the mobile menu", async () => {
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const mobile = await screen.findByRole("navigation", { name: "Mobile navigation" });
    expect(within(mobile).queryByRole("link", { name: "Contact" })).not.toBeInTheDocument();
    expect(within(mobile).queryByRole("link", { name: "Education" })).not.toBeInTheDocument();
    expect(within(mobile).getByRole("link", { name: "AI Lab" })).toHaveAttribute("href", "/lab");
    expect(within(mobile).getByRole("link", { name: "Let's Talk" })).toHaveAttribute("href", "/#contact");
  });
});

describe("mobile menu transition", () => {
  beforeEach(() => {
    window.localStorage.clear();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: () => ({ matches: false, addEventListener: () => undefined, removeEventListener: () => undefined, addListener: () => undefined, removeListener: () => undefined }),
    });
  });

  it("stays mounted for the closing transition, hidden from assistive technology, then unmounts", async () => {
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const panel = await screen.findByRole("dialog", { name: "Mobile navigation" });
    await waitFor(() => expect(panel).toHaveClass("is-open"));
    await userEvent.click(within(panel).getByRole("button", { name: "Close menu" }));
    await waitFor(() => expect(panel).toHaveAttribute("aria-hidden", "true"));
    expect(panel).not.toHaveClass("is-open");
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Mobile navigation", hidden: true })).not.toBeInTheDocument(), { timeout: 1500 });
  });
});
