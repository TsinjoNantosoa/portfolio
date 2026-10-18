import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Reveal from "./Reveal";
import { useInViewOnce } from "./useReveal";

type Callback = (entries: Array<{ isIntersecting: boolean; target: Element }>) => void;

let callbacks: Callback[] = [];
let observed: Element[] = [];

class FakeObserver {
  constructor(callback: Callback) {
    callbacks.push(callback);
  }
  observe(element: Element) {
    observed.push(element);
  }
  unobserve(element: Element) {
    observed = observed.filter((item) => item !== element);
  }
  disconnect() {
    observed = [];
  }
}

/** Blocks are measured together in a microtask after the commit. */
const flush = () => act(async () => undefined);

const setTop = (top: number) => {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({ top, bottom: top + 100, left: 0, right: 100, width: 100, height: 100, x: 0, y: top, toJSON: () => ({}) });
};

const mockMotionPreference = (reduce: boolean) => {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: reduce && query.includes("prefers-reduced-motion"), media: query, addEventListener: () => undefined, removeEventListener: () => undefined }));
};

describe("Reveal", () => {
  beforeEach(() => {
    callbacks = [];
    observed = [];
    vi.stubGlobal("IntersectionObserver", FakeObserver);
    vi.stubGlobal("innerHeight", 900);
    mockMotionPreference(false);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("hides a block below the fold, then shows it once, when it scrolls into view", async () => {
    setTop(2000);
    render(<Reveal data-testid="block">content</Reveal>);
    const block = screen.getByTestId("block");
    await flush();
    expect(block.dataset.reveal).toBe("hidden");
    expect(observed).toContain(block);
    act(() => callbacks[0]([{ isIntersecting: true, target: block }]));
    expect(block.dataset.reveal).toBe("shown");
    expect(observed).not.toContain(block);
    expect(block).toHaveTextContent("content");
  });

  it("never hides a block that is already on screen or above it", async () => {
    setTop(300);
    const { unmount } = render(<Reveal data-testid="a">visible</Reveal>);
    await flush();
    expect(screen.getByTestId("a").dataset.reveal).toBeUndefined();
    unmount();
    setTop(-1500);
    render(<Reveal data-testid="b">above</Reveal>);
    await flush();
    expect(screen.getByTestId("b").dataset.reveal).toBeUndefined();
  });

  it("never hides anything when IntersectionObserver is not available", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    setTop(2000);
    render(<Reveal data-testid="block">content</Reveal>);
    expect(screen.getByTestId("block").dataset.reveal).toBeUndefined();
  });

  it("never hides anything when the visitor prefers reduced motion", () => {
    mockMotionPreference(true);
    setTop(2000);
    render(<Reveal data-testid="block">content</Reveal>);
    expect(screen.getByTestId("block").dataset.reveal).toBeUndefined();
    expect(observed).toHaveLength(0);
  });

  it("measures all blocks of a commit together instead of one layout per block", async () => {
    setTop(2000);
    const spy = vi.spyOn(Element.prototype, "getBoundingClientRect");
    render(
      <>
        <Reveal>1</Reveal>
        <Reveal>2</Reveal>
        <Reveal>3</Reveal>
      </>,
    );
    expect(spy).not.toHaveBeenCalled();
    await flush();
    expect(spy).toHaveBeenCalledTimes(3);
    expect(document.querySelectorAll('[data-reveal="hidden"]')).toHaveLength(3);
  });

  it("staggers by position in a group, capped so long lists do not lag", () => {
    setTop(2000);
    render(
      <>
        <Reveal data-testid="first">1</Reveal>
        <Reveal index={2} data-testid="third">3</Reveal>
        <Reveal index={40} data-testid="far">40</Reveal>
      </>,
    );
    expect(screen.getByTestId("first").style.getPropertyValue("--reveal-index")).toBe("0");
    expect(screen.getByTestId("third").style.getPropertyValue("--reveal-index")).toBe("2");
    expect(screen.getByTestId("far").style.getPropertyValue("--reveal-index")).toBe("5");
  });

  it("renders the element it is asked to, keeping its own attributes", () => {
    setTop(0);
    render(<Reveal as="article" id="exp" className="x">body</Reveal>);
    const article = document.querySelector("article#exp");
    expect(article).toHaveClass("x");
  });
});

describe("useInViewOnce", () => {
  beforeEach(() => {
    callbacks = [];
    observed = [];
    vi.stubGlobal("IntersectionObserver", FakeObserver);
    mockMotionPreference(false);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const Probe = () => {
    const [ref, seen] = useInViewOnce<HTMLDivElement>();
    return <div ref={ref} data-testid="probe" data-seen={String(seen)} />;
  };

  it("turns true the first time the element is seen", () => {
    render(<Probe />);
    expect(screen.getByTestId("probe").dataset.seen).toBe("false");
    act(() => callbacks[0]([{ isIntersecting: true, target: screen.getByTestId("probe") }]));
    expect(screen.getByTestId("probe").dataset.seen).toBe("true");
  });

  it("is true at once with reduced motion", () => {
    mockMotionPreference(true);
    render(<Probe />);
    expect(screen.getByTestId("probe").dataset.seen).toBe("true");
  });
});
