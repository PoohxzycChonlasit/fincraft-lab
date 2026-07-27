import { VALID_THEME_PREFERENCES, DEFAULT_THEME_PREFERENCE } from "../constants/theme-constants";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedAppearance = "light" | "dark";

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    typeof value === "string" &&
    (VALID_THEME_PREFERENCES as readonly string[]).includes(value)
  );
}

export function parseThemePreference(value: unknown): ThemePreference {
  if (isThemePreference(value)) {
    return value;
  }
  return DEFAULT_THEME_PREFERENCE;
}
