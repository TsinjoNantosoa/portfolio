import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProfileImage from "./ProfileImage";

const stubMedia = (matches: boolean) => {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches, media: query, addEventListener: () => undefined, removeEventListener: () => undefined }));
};

describe("ProfileImage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the portrait at once, with its alternative text and sizes", () => {
    stubMedia(false);
    render(<ProfileImage />);
    const image = screen.getByRole("img", { name: "Sandaniaina Tsinjo Nantosoa" });
    expect(image).toHaveAttribute("width", "480");
    expect(image).toHaveAttribute("fetchpriority", "high");
    expect(image.closest("[style*='opacity']")).toBeNull();
  });

  it("draws the network as a hidden, decorative graphic", () => {
    stubMedia(false);
    const { container } = render(<ProfileImage />);
    const svg = container.querySelector("svg.profile-portrait__network");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg?.querySelectorAll(".profile-portrait__node").length).toBe(6);
    expect(svg?.querySelectorAll(".profile-portrait__link").length).toBeGreaterThan(6);
    expect(container.querySelectorAll("a, button, input")).toHaveLength(0);
  });

  it("follows the pointer only on large screens with a mouse and no reduced-motion request", () => {
    stubMedia(true);
    const { container } = render(<ProfileImage />);
    const root = container.querySelector(".profile-portrait") as HTMLElement;
    vi.spyOn(root, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 200, height: 200, right: 200, bottom: 200, x: 0, y: 0, toJSON: () => ({}) });
    root.dispatchEvent(new MouseEvent("pointermove", { clientX: 200, clientY: 0 }));
    return new Promise<void>((resolve) =>
      requestAnimationFrame(() => {
        expect(root.style.getPropertyValue("--px")).toBe("0.500");
        expect(root.style.getPropertyValue("--py")).toBe("-0.500");
        root.dispatchEvent(new MouseEvent("pointerleave"));
        expect(root.style.getPropertyValue("--px")).toBe("0");
        resolve();
      }),
    );
  });

  it("does not listen to the pointer on touch devices or with reduced motion", () => {
    stubMedia(false);
    const { container } = render(<ProfileImage />);
    const root = container.querySelector(".profile-portrait") as HTMLElement;
    root.dispatchEvent(new MouseEvent("pointermove", { clientX: 100, clientY: 100 }));
    expect(root.style.getPropertyValue("--px")).toBe("");
  });
});
