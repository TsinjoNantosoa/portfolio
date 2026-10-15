import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

Object.defineProperty(HTMLElement.prototype, "scrollTo", { configurable: true, value: () => undefined });
Object.defineProperty(globalThis, "IntersectionObserver", {
  configurable: true,
  value: class IntersectionObserverMock {
    readonly root = null;
    readonly rootMargin = "0px";
    readonly thresholds = [0];

    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  },
});
afterEach(() => cleanup());
