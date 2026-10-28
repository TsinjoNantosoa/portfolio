import { readFileSync } from "node:fs";
import path from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AnimatedAIOrb from "./AnimatedAIOrb";
import AssistantHeader from "./AssistantHeader";
import type { AssistantStatus } from "./assistant-types";

const css = readFileSync(path.resolve(process.cwd(), "src/components/assistant/AnimatedAIOrb.css"), "utf8");

describe("AnimatedAIOrb", () => {
  it("is a decorative graphic: hidden from assistive technology and not focusable", () => {
    const { container } = render(<AnimatedAIOrb />);
    const orb = container.querySelector(".ai-orb");
    expect(orb).toHaveAttribute("aria-hidden", "true");
    expect(orb).toHaveAttribute("data-state", "idle");
    expect(container.querySelectorAll("a, button, input, [tabindex]")).toHaveLength(0);
    expect(container.querySelector("title")).toBeNull();
    expect(container.textContent).toBe("");
  });

  it.each(["idle", "processing", "streaming", "success", "error"] as const)("exposes the %s state", (state) => {
    const { container } = render(<AnimatedAIOrb state={state} />);
    expect(container.querySelector(".ai-orb")).toHaveAttribute("data-state", state);
  });

  it("applies the size and entrance options", () => {
    const { container } = render(<AnimatedAIOrb size="small" entrance />);
    expect(container.querySelector(".ai-orb")).toHaveClass("ai-orb--small", "ai-orb--enter");
  });

  it("gives each instance its own gradient ids", () => {
    const { container } = render(
      <>
        <AnimatedAIOrb />
        <AnimatedAIOrb />
      </>,
    );
    const ids = [...container.querySelectorAll("radialGradient")].map((node) => node.id);
    expect(ids).toHaveLength(4);
    expect(new Set(ids).size).toBe(4);
  });

  it("does not re-render when its props are unchanged", () => {
    const { container, rerender } = render(<AnimatedAIOrb state="streaming" />);
    const before = container.querySelector(".ai-orb");
    rerender(<AnimatedAIOrb state="streaming" />);
    expect(container.querySelector(".ai-orb")).toBe(before);
  });

  describe("stylesheet", () => {
    it("switches every animation off for reduced motion and keeps the states apart without it", () => {
      const block = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
      expect(block).toMatch(/animation:\s*none\s*!important/);
      expect(block).toMatch(/transition:\s*none\s*!important/);
      expect(css).toMatch(/\.ai-orb\[data-state="error"\] \.ai-orb__flag\s*{[^}]*opacity:\s*1/);
    });

    it("animates only transform and opacity", () => {
      const keyframes = css.slice(css.indexOf("/* ---------- Keyframes"), css.indexOf("/* ---------- Reduced motion"));
      expect(keyframes).toContain("@keyframes");
      expect(keyframes).not.toMatch(/\b(width|height|top|left|right|bottom|margin|padding|filter|box-shadow)\s*:/);
    });

    it("does not rely on will-change", () => {
      expect(css).not.toMatch(/will-change/);
    });
  });
});

describe("AssistantHeader orb", () => {
  const cases: [AssistantStatus, string][] = [
    ["connecting", "processing"],
    ["thinking", "processing"],
    ["streaming", "streaming"],
    ["complete", "success"],
    ["error", "error"],
    ["rate_limited", "error"],
    ["unavailable", "error"],
    ["idle", "idle"],
  ];
  it.each(cases)("shows the %s status as the %s orb, next to the unchanged status text", (status, orb) => {
    const { container, getByRole } = render(
      <AssistantHeader titleId="t" status={status} statusLabel={`label ${status}`} onClear={() => undefined} onClose={() => undefined} />,
    );
    expect(container.querySelector(".tsinjo-ai__header .ai-orb")).toHaveAttribute("data-state", orb);
    expect(getByRole("status")).toHaveTextContent(`label ${status}`);
  });
});
