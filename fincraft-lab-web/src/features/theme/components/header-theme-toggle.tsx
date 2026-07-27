"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { parseThemePreference, type ThemePreference } from "../types/theme-types";
import { getClientThemeCookie, setClientThemeCookie } from "../utils/theme-cookie";

const THEMES: Array<{ id: ThemePreference; label: string; Icon: typeof Sun }> = [
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
  { id: "system", label: "System", Icon: Monitor },
];

function getThemeOption(preference: ThemePreference) {
  return THEMES.find((theme) => theme.id === preference) ?? THEMES[2];
}

function useThemePreference() {
  const [preference, setPreference] = useState<ThemePreference>(() => typeof window !== "undefined" ? getClientThemeCookie() : "system");
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
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) root.classList.add("dark");
    }
  }, [preference]);

  const handleSelect = (newPreference: ThemePreference) => {
    const validPreference = parseThemePreference(newPreference);
    startTransition(() => {
      setPreference(validPreference);
      setClientThemeCookie(validPreference);
    });
  };

  return { preference, handleSelect };
}

function useDismissableMenu(isOpen: boolean, closeMenu: (restoreFocus?: boolean) => void, menuRef: React.RefObject<HTMLDivElement | null>, triggerRef: React.RefObject<HTMLButtonElement | null>) {
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) closeMenu(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    menuRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isOpen, menuRef, triggerRef]);
}

function ThemeOptions({ preference, onSelect }: { preference: ThemePreference; onSelect: (preference: ThemePreference) => void }) {
  return (
    <div className="flex flex-col gap-1">
      {THEMES.map(({ id, label, Icon }) => {
        const isActive = preference === id;
        return (
          <button key={id} type="button" role="menuitemradio" aria-checked={isActive} onClick={() => onSelect(id)} className={`flex min-h-9 items-center gap-2 rounded-lg px-2.5 text-left text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${isActive ? "bg-[var(--surface-inset)] text-foreground" : "text-muted-foreground hover:bg-[var(--surface-inset)] hover:text-foreground"}`}>
            <Icon size={15} aria-hidden="true" />
            <span className="flex-1">{label}</span>
            {isActive ? <span aria-label="Current theme">Current</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export function HeaderThemeToggle() {
  const { preference, handleSelect } = useThemePreference();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback((restoreFocus = true) => {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);
  useDismissableMenu(isOpen, closeMenu, menuRef, triggerRef);

  const currentTheme = getThemeOption(preference);
  const CurrentIcon = currentTheme.Icon;

  return (
    <div className="relative">
      <button ref={triggerRef} type="button" aria-label={`Theme preference: ${currentTheme.label}. Open theme menu`} aria-haspopup="menu" aria-expanded={isOpen} onClick={() => setIsOpen((previous) => !previous)} className="inline-flex size-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-inset)] text-foreground transition-colors hover:bg-[var(--surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
        <CurrentIcon size={16} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div ref={menuRef} role="menu" aria-label="Theme preference" className="surface-overlay absolute right-0 top-[calc(100%+8px)] z-50 w-44 rounded-2xl p-2 shadow-xl">
          <p className="px-2.5 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Theme</p>
          <ThemeOptions preference={preference} onSelect={(value) => { handleSelect(value); closeMenu(); }} />
        </div>
      ) : null}
    </div>
  );
}
