"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { getClientThemeCookie, setClientThemeCookie } from "../utils/theme-cookie";
import type { ResolvedAppearance, ThemePreference } from "../types/theme-types";

function resolveTheme(preference: ThemePreference): ResolvedAppearance {
  if (preference !== "system") return preference;
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(preference: ThemePreference, resolved: ResolvedAppearance) {
  const root = document.documentElement;
  root.dataset.themePreference = preference;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

function useDirectThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>(() => getClientThemeCookie());
  const [resolved, setResolved] = useState<ResolvedAppearance>(() => resolveTheme(getClientThemeCookie()));

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (event: MediaQueryListEvent) => {
      if (preference !== "system") return;
      const nextResolved = event.matches ? "dark" : "light";
      setResolved(nextResolved);
      applyTheme(preference, nextResolved);
    };

    applyTheme(preference, resolveTheme(preference));
    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [preference]);

  const toggleTheme = () => {
    const nextPreference: ThemePreference = resolved === "light" ? "dark" : "light";
    setPreference(nextPreference);
    setResolved(nextPreference);
    setClientThemeCookie(nextPreference);
    applyTheme(nextPreference, nextPreference);
  };

  return { resolved, toggleTheme };
}

export function HeaderThemeToggle() {
  const { resolved, toggleTheme } = useDirectThemeToggle();
  const isLight = resolved === "light";
  const Icon = isLight ? Moon : Sun;
  const nextLabel = isLight ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      type="button"
      aria-label={nextLabel}
      title={nextLabel}
      onClick={toggleTheme}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-inset)] text-foreground transition-colors hover:bg-[var(--surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  );
}
