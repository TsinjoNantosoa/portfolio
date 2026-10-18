/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => undefined,
});
const STORAGE_KEY = "tsinjo:theme";

function getStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  // No saved choice yet: follow the visitor's system setting. A manual choice is saved and kept.
  return stored === "light" || stored === "dark" ? stored : "system";
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemePreference>(getStoredTheme);
  const [system, setSystem] = useState<ResolvedTheme>(() =>
    typeof window === "undefined" ? "dark" : systemTheme(),
  );
  const resolvedTheme = theme === "system" ? system : theme;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const update = () => setSystem(media.matches ? "light" : "dark");
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const appliedTheme = useRef<ResolvedTheme | null>(null);
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
    const root = document.documentElement;
    // Soften the colour swap when the visitor changes the theme (not on the first paint, not with reduced motion).
    const changed = appliedTheme.current !== null && appliedTheme.current !== resolvedTheme;
    const reduced = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    if (changed && !reduced) {
      root.classList.add("theme-switching");
      timer = window.setTimeout(() => root.classList.remove("theme-switching"), 400);
    }
    appliedTheme.current = resolvedTheme;
    root.dataset.theme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
    return () => {
      window.clearTimeout(timer);
      root.classList.remove("theme-switching");
    };
  }, [theme, resolvedTheme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
