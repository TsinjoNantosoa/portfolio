import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PreferencesControls from "@/components/Layout/PreferencesControls";
import { I18nProvider } from "./I18nProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";

describe("portfolio preferences", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });
  });

  it("persists language and theme choices", async () => {
    render(
      <ThemeProvider>
        <I18nProvider>
          <PreferencesControls />
        </I18nProvider>
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "FR" }));
    expect(localStorage.getItem("tsinjo:language")).toBe("fr");
    expect(document.documentElement.lang).toBe("fr");

    await userEvent.selectOptions(screen.getByLabelText("Thème"), "light");
    await waitFor(() => {
      expect(localStorage.getItem("tsinjo:theme")).toBe("light");
      expect(document.documentElement.dataset.theme).toBe("light");
    });
  });
});
