"use client";

import { useEffect, useState, useTransition } from "react";
import { parseThemePreference, type ThemePreference } from "../types/theme-types";
import { getClientThemeCookie, setClientThemeCookie } from "../utils/theme-cookie";

const THEMES: Array<{ id: ThemePreference; label: string; icon: string }> = [
  { id: "light", label: "Light", icon: "☀️" },
  { id: "dark", label: "Dark", icon: "🌙" },
  { id: "system", label: "System", icon: "💻" },
];

export function HeaderThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof window !== "undefined") return getClientThemeCookie();
    return "system";
  });
  const [, startTransition] = useTransition();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.themePreference = preference;

    if (preference === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else if (preference === "light") {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    } else {
      root.classList.remove("dark");
      root.style.removeProperty("color-scheme");
      const isDarkSystem = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDarkSystem) root.classList.add("dark");
    }
  }, [preference]);

  const handleSelect = (newPref: ThemePreference) => {
    const valid = parseThemePreference(newPref);
    startTransition(() => {
      setPreference(valid);
      setClientThemeCookie(valid);
    });
  };

  return (
    <div role="group" aria-label="Theme selection" className="flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-0.5">
      {THEMES.map((t) => {
        const isActive = preference === t.id;
        return (
          <button
            key={t.id}
            type="button"
            aria-label={`${t.label} theme`}
            aria-pressed={isActive}
            onClick={() => handleSelect(t.id)}
            className={`min-h-[28px] px-2 py-1 text-[11px] font-semibold rounded-md transition-colors ${
              isActive
                ? "bg-[var(--surface-resting)] text-foreground shadow-xs border border-[var(--border-subtle)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span aria-hidden="true" className="mr-1">{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
