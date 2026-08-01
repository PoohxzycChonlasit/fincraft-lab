const DEFAULT_AUTH_REDIRECT = "/lab";
const INTERNAL_AUTH_ORIGIN = "https://fincraft.internal";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getSafeReturnTo(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) return DEFAULT_AUTH_REDIRECT;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return DEFAULT_AUTH_REDIRECT;

  try {
    const parsed = new URL(value, INTERNAL_AUTH_ORIGIN);
    if (parsed.origin !== INTERNAL_AUTH_ORIGIN) return DEFAULT_AUTH_REDIRECT;
    if (parsed.pathname === "/login" || parsed.pathname === "/register" || parsed.pathname.startsWith("/api/")) {
      return DEFAULT_AUTH_REDIRECT;
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return DEFAULT_AUTH_REDIRECT;
  }
}

export function buildAuthHref(path: "/login" | "/register", returnTo: string, registered = false): string {
  const query = new URLSearchParams();
  if (registered) query.set("registered", "true");
  if (returnTo !== DEFAULT_AUTH_REDIRECT) query.set("returnTo", returnTo);
  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}

export function readAuthError(data: unknown, fallback: string): string {
  if (!isRecord(data)) return fallback;
  const error = data.error;
  if (typeof error === "string" && error.trim().length > 0) return error;
  const message = data.message;
  if (typeof message === "string" && message.trim().length > 0) return message;
  return fallback;
}

export function getLoginErrorMessage(status: number, data: unknown): string {
  if (status === 401) {
    const message = readAuthError(data, "Invalid email or password");
    return message === "Account is not active" ? message : "Invalid email or password";
  }
  if (status === 403) return "Account is not active";
  if (status >= 500) return "We couldn't sign you in right now. Please try again.";
  return readAuthError(data, "Unable to sign in. Please review your details and try again.");
}

export function getRegisterErrorMessage(status: number, data: unknown): string {
  if (status === 409) return "A user with this email already exists";
  if (status >= 500) return "We couldn't create your account right now. Please try again.";
  return readAuthError(data, "Unable to create your account. Please review your details and try again.");
}

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
