import type { ThemePreference } from "../types/theme-types";

export const THEME_COOKIE_NAME = "fincraft_theme" as const;
export const THEME_CHANGE_EVENT = "fincraft:theme-change" as const;
export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system" as const;
export const VALID_THEME_PREFERENCES: readonly ThemePreference[] = [
  "light",
  "dark",
  "system",
] as const;
