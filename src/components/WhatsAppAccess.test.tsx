import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Contact from "@/components/Sections/Contact";
import PortfolioAssistantLauncher from "@/components/assistant/PortfolioAssistantLauncher";
import { I18nProvider } from "@/i18n/I18nProvider";

vi.mock("@/components/assistant/PortfolioAssistant", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div role="dialog">
      <button onClick={onClose}>Close assistant</button>
    </div>
  ),
}));

const NUMBER = "33612345678";
const EN_MESSAGE = "Hello, I found your portfolio and would like to discuss a project with you.";
const FR_MESSAGE = "Bonjour, j’ai découvert votre portfolio et je souhaite échanger avec vous au sujet d’un projet.";

const renderAll = () =>
  render(
    <I18nProvider>
      <Contact />
      <PortfolioAssistantLauncher />
    </I18nProvider>,
  );

describe("WhatsApp access", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.setItem("tsinjo:assistant-invite-seen", "1");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("shows nothing when the number is not configured", () => {
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "");
    renderAll();
    expect(screen.queryByRole("link", { name: /WhatsApp/ })).not.toBeInTheDocument();
  });

  it("shows nothing when the number is invalid", () => {
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "+33 6 12 34 56 78");
    renderAll();
    expect(screen.queryByRole("link", { name: /WhatsApp/ })).not.toBeInTheDocument();
  });

  it("offers a safe, pre-filled link in the contact section and as a floating button", () => {
    vi.stubEnv("VITE_WHATSAPP_NUMBER", NUMBER);
    renderAll();
    const links = screen.getAllByRole("link", { name: /WhatsApp/ });
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
      expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
      const url = new URL(link.getAttribute("href") as string);
      expect(url.origin + url.pathname).toBe(`https://wa.me/${NUMBER}`);
      expect(url.searchParams.get("text")).toBe(EN_MESSAGE);
    }
  });

  it("uses the French message when the site is in French", () => {
    vi.stubEnv("VITE_WHATSAPP_NUMBER", NUMBER);
    window.localStorage.setItem("tsinjo:language", "fr");
    renderAll();
    const link = screen.getAllByRole("link", { name: /WhatsApp/ })[0];
    expect(new URL(link.getAttribute("href") as string).searchParams.get("text")).toBe(FR_MESSAGE);
  });

  it("hides the floating button while the chatbot is open and brings it back after", async () => {
    vi.stubEnv("VITE_WHATSAPP_NUMBER", NUMBER);
    render(
      <I18nProvider>
        <PortfolioAssistantLauncher />
      </I18nProvider>,
    );
    expect(screen.getByRole("link", { name: /WhatsApp/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Ask Tsinjo AI" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /WhatsApp/ })).not.toBeInTheDocument();
    await act(async () => {
      screen.getByRole("button", { name: "Close assistant" }).click();
    });
    expect(screen.getByRole("link", { name: /WhatsApp/ })).toBeInTheDocument();
  });
});
