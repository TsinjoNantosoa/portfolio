import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeProvider";

const mockSystemTheme = (scheme: "light" | "dark") => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: scheme === "light" && query.includes("prefers-color-scheme: light"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
};

function Probe() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <>
      <p data-testid="state">{`${theme}/${resolvedTheme}`}</p>
      <button type="button" onClick={() => setTheme("dark")}>
        choose dark
      </button>
    </>
  );
}

const renderProbe = () =>
  render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );

describe("ThemeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("follows a light system setting when the visitor has not chosen", () => {
    mockSystemTheme("light");
    renderProbe();
    expect(screen.getByTestId("state")).toHaveTextContent("system/light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("follows a dark system setting when the visitor has not chosen", () => {
    mockSystemTheme("dark");
    renderProbe();
    expect(screen.getByTestId("state")).toHaveTextContent("system/dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("keeps a manual choice over the system setting, across visits", () => {
    mockSystemTheme("light");
    window.localStorage.setItem("tsinjo:theme", "dark");
    renderProbe();
    expect(screen.getByTestId("state")).toHaveTextContent("dark/dark");
  });

  it("saves a manual choice", () => {
    mockSystemTheme("light");
    renderProbe();
    act(() => screen.getByRole("button", { name: "choose dark" }).click());
    expect(window.localStorage.getItem("tsinjo:theme")).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
