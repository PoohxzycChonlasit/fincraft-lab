import { THEME_COOKIE_NAME } from "../constants/theme-constants";
import { parseThemePreference, type ThemePreference } from "../types/theme-types";

export function getClientThemeCookie(): ThemePreference {
  if (typeof document === "undefined") {
    return "system";
  }

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, val] = cookie.trim().split("=");
    if (key === THEME_COOKIE_NAME && val) {
      return parseThemePreference(decodeURIComponent(val));
    }
  }

  return "system";
}

export function setClientThemeCookie(preference: ThemePreference): void {
  if (typeof document === "undefined") {
    return;
  }

  const oneYearInSeconds = 31536000;
  document.cookie = `${THEME_COOKIE_NAME}=${encodeURIComponent(
    preference
  )}; path=/; max-age=${oneYearInSeconds}; SameSite=Lax`;
}
