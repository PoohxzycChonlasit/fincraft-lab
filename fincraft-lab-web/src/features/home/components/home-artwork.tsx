"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { THEME_CHANGE_EVENT } from "@/features/theme/constants/theme-constants";
import type { ResolvedAppearance, ThemePreference } from "@/features/theme/types/theme-types";

const HERO_ARTWORK = {
  light: "/images/home/financial-city-day.png",
  dark: "/images/home/financial-city-night.png",
} as const;

type ThemeChangeDetail = {
  preference: ThemePreference;
  resolved: ResolvedAppearance;
};

type HomeArtworkProps = {
  initialThemePreference: ThemePreference;
};

export function HomeArtwork({ initialThemePreference }: HomeArtworkProps) {
  const preference = useRef(initialThemePreference);
  const [appearance, setAppearance] = useState<ResolvedAppearance | null>(
    initialThemePreference === "system" ? null : initialThemePreference,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applySystemAppearance = () => {
      if (preference.current === "system") {
        setAppearance(mediaQuery.matches ? "dark" : "light");
      }
    };
    const handleThemeChange = (event: Event) => {
      const { preference: nextPreference, resolved } = (event as CustomEvent<ThemeChangeDetail>).detail;
      preference.current = nextPreference;
      setAppearance(resolved);
    };

    applySystemAppearance();
    mediaQuery.addEventListener("change", applySystemAppearance);
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", applySystemAppearance);
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    };
  }, []);

  return (
    <figure className="home-artwork" aria-hidden="true" data-artwork-status="production">
      {appearance ? (
        <Image
          key={appearance}
          src={HERO_ARTWORK[appearance]}
          alt=""
          fill
          priority
          sizes="(max-width: 639px) 120vw, (max-width: 1023px) 90vw, (max-width: 1439px) 52vw, 720px"
          className="home-artwork-image"
        />
      ) : null}
    </figure>
  );
}
