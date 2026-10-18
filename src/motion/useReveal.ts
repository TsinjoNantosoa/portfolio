import { useEffect, useLayoutEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const canObserve = () => typeof window !== "undefined" && typeof IntersectionObserver !== "undefined";

/** One observer for every revealed block: cheaper than one per element. */
let sharedObserver: IntersectionObserver | null = null;
const getObserver = (): IntersectionObserver => {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "shown";
          sharedObserver?.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );
  }
  return sharedObserver;
};

/**
 * Blocks that mounted in this commit wait here so their positions are read together, in one layout pass,
 * and only then written. Reading and writing one block at a time forces a layout for every block.
 */
const pending = new Set<HTMLElement>();
let flushScheduled = false;

const flushPending = () => {
  flushScheduled = false;
  const elements = [...pending];
  pending.clear();
  const limit = window.innerHeight * 0.95;
  const belowTheFold = elements.filter((element) => element.isConnected && element.getBoundingClientRect().top >= limit);
  const observer = getObserver();
  for (const element of belowTheFold) {
    element.dataset.reveal = "hidden";
    observer.observe(element);
  }
};

/**
 * Reveals a block once, the first time it scrolls into view.
 *
 * Content is visible by default. The hidden starting state is only applied (before the first paint) to blocks
 * that are below the fold, when IntersectionObserver exists and the visitor has not asked for reduced motion.
 * Anything already on screen at load, above the fold, or in an environment without observers is never hidden.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || !canObserve() || prefersReducedMotion()) return undefined;
    pending.add(element);
    if (!flushScheduled) {
      flushScheduled = true;
      // A microtask runs after every layout effect of this commit and before the browser paints.
      queueMicrotask(flushPending);
    }
    return () => {
      pending.delete(element);
      sharedObserver?.unobserve(element);
    };
  }, []);
  return ref;
}

/** True from the moment the element is first seen on screen. Without observers or with reduced motion it is true at once. */
export function useInViewOnce<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(() => !canObserve() || prefersReducedMotion());
  useEffect(() => {
    const element = ref.current;
    if (seen || !element) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [seen, threshold]);
  return [ref, seen] as const;
}
