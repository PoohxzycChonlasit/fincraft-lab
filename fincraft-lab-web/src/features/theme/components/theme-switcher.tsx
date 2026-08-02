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
  const [preference, setPreference] = useState<ThemePreference>(initialPreference);
  const [resolved, setResolved] = useState<ResolvedAppearance>("light");
  const [, startTransition] = useTransition();

  useEffect(() => {
    const cookieSync = window.setTimeout(() => {
      const clientPreference = getClientThemeCookie();
      if (clientPreference !== initialPreference) setPreference(clientPreference);
    }, 0);

    return () => window.clearTimeout(cookieSync);
  }, [initialPreference]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function updateTheme(pref: ThemePreference) {
      const root = document.documentElement;
      root.dataset.themePreference = pref;

      if (pref === "dark") {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
        setResolved("dark");
      } else if (pref === "light") {
        root.classList.remove("dark");
        root.style.colorScheme = "light";
        setResolved("light");
      } else {
        root.classList.remove("dark");
        root.style.removeProperty("color-scheme");
        setResolved(mediaQuery.matches ? "dark" : "light");
      }
    }

    updateTheme(preference);

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (preference === "system") {
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
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-(--surface-resting) border border-(--border-subtle) shadow-(--shadow-resting)">
      <SwitcherHeader resolved={resolved} />
      <SwitcherButtons preference={preference} onSelect={handleSelectPreference} />
    </div>
  );
}

function SwitcherHeader({ resolved }: { resolved: ResolvedAppearance }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-(--color-text-secondary)">
        Theme Preference
      </span>
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-(--surface-inset) border border-(--border-subtle) text-(--color-text-secondary)">
        Resolved Appearance: <strong className="capitalize text-(--color-text-primary)">{resolved}</strong>
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
            className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-interactive) focus-visible:ring-offset-2 ${
              isSelected
                ? "bg-[var(--color-action-primary,#0f766e)] text-[var(--color-text-inverse,#ffffff)] font-semibold shadow-sm"
                : "bg-(--surface-inset) hover:bg-[var(--color-surface-subtle,#e7e5e4)] text-(--color-text-primary) border border-(--border-subtle)"
            }`}
          >
            <span className="capitalize">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
