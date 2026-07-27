"use client";

import { useEffect, useState, useTransition } from "react";
import { VALID_THEME_PREFERENCES } from "../constants/theme-constants";
import {
  parseThemePreference,
  type ResolvedAppearance,
  type ThemePreference,
} from "../types/theme-types";
import { getClientThemeCookie, setClientThemeCookie } from "../utils/theme-cookie";

interface ThemeSwitcherProps {
  initialPreference?: ThemePreference;
}

export function ThemeSwitcher({ initialPreference = "system" }: ThemeSwitcherProps) {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof window !== "undefined") {
      return getClientThemeCookie();
    }
    return initialPreference;
  });
  const [resolved, setResolved] = useState<ResolvedAppearance>("light");
  const [, startTransition] = useTransition();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function updateTheme(pref: ThemePreference) {
      const root = document.documentElement;
      root.dataset.themePreference = pref;

      let isDark = false;
      if (pref === "dark") {
        isDark = true;
      } else if (pref === "system") {
        isDark = mediaQuery.matches;
      }

      root.classList.toggle("dark", isDark);
      root.style.colorScheme = isDark ? "dark" : "light";
      setResolved(isDark ? "dark" : "light");
    }

    updateTheme(preference);

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (preference === "system") {
        const root = document.documentElement;
        root.classList.toggle("dark", e.matches);
        root.style.colorScheme = e.matches ? "dark" : "light";
        setResolved(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [preference]);

  const handleSelectPreference = (newPref: ThemePreference) => {
    const valid = parseThemePreference(newPref);
    startTransition(() => {
      setPreference(valid);
      setClientThemeCookie(valid);
    });
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-[var(--surface-resting)] border border-[var(--border-subtle)] shadow-[var(--shadow-resting)]">
      <SwitcherHeader resolved={resolved} />
      <SwitcherButtons preference={preference} onSelect={handleSelectPreference} />
    </div>
  );
}

function SwitcherHeader({ resolved }: { resolved: ResolvedAppearance }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
        Theme Preference
      </span>
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--surface-inset)] border border-[var(--border-subtle)] text-[var(--color-text-secondary)]">
        Resolved Appearance: <strong className="capitalize text-[var(--color-text-primary)]">{resolved}</strong>
      </span>
    </div>
  );
}

function SwitcherButtons({
  preference,
  onSelect,
}: {
  preference: ThemePreference;
  onSelect: (pref: ThemePreference) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label="Theme mode selection">
      {VALID_THEME_PREFERENCES.map((option) => {
        const isSelected = preference === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(option)}
            className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive)] focus-visible:ring-offset-2 ${
              isSelected
                ? "bg-[var(--color-action-primary,#0d9488)] text-white font-semibold shadow-sm"
                : "bg-[var(--surface-inset)] hover:bg-[var(--color-surface-subtle,#e7e5e4)] text-[var(--color-text-primary)] border border-[var(--border-subtle)]"
            }`}
          >
            <span className="capitalize">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
