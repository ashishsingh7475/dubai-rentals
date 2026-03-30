"use client";

import * as React from "react";

export type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedTheme: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "dubai-rentals.theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") return getSystemTheme();
  return mode;
}

function applyThemeToDocument(resolved: "light" | "dark") {
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.classList.toggle("dark", resolved === "dark");
  // Helps built-in UI (form controls, scrollbars) match the theme.
  root.style.colorScheme = resolved;
}

export function ThemeProvider({
  children,
  defaultMode = "system",
}: {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}) {
  const [mode, setModeState] = React.useState<ThemeMode>(defaultMode);
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    () => resolveTheme(defaultMode)
  );

  // Load persisted preference on mount (client only).
  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const nextMode: ThemeMode =
      stored === "light" || stored === "dark" || stored === "system"
        ? stored
        : defaultMode;
    setModeState(nextMode);
  }, [defaultMode]);

  // Keep resolved theme in sync with mode + system setting.
  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const update = () => {
      const resolved = resolveTheme(mode);
      setResolvedTheme(resolved);
      applyThemeToDocument(resolved);
    };
    update();

    if (!mq) return;
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [mode]);

  const setMode = React.useCallback((next: ThemeMode) => {
    setModeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggle = React.useCallback(() => {
    setMode(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setMode]);

  const value = React.useMemo(
    () => ({ mode, resolvedTheme, setMode, toggle }),
    [mode, resolvedTheme, setMode, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

