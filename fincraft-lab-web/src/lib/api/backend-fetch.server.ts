import { getAccessToken } from "@/lib/auth/access-token.server";
import { parseBackendResponse } from "./backend-response";

const getBackendBaseUrl = (): string => {
  const envUrl = process.env.FINCRAFT_API_URL || "http://localhost:4000";
  return envUrl.trim().replace(/\/+$/, "");
};

export type BackendFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  requireAuth?: boolean;
};

export type BackendFetchResult =
  | { ok: true; status: number; data: unknown }
  | { ok: false; status: number; error: string };

export async function backendFetch(
  path: string,
  options: BackendFetchOptions = {},
): Promise<BackendFetchResult> {
  const { method = "GET", headers = {}, body, requireAuth = true } = options;

  let token: string | null = null;
  if (requireAuth) {
    token = await getAccessToken();
    if (!token) {
      return { ok: false, status: 401, error: "Session expired. Please log in again." };
    }
  }

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getBackendBaseUrl();
  const url = `${baseUrl}${cleanPath}`;

  try {
    const res = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    if (res.status === 401) {
      return { ok: false, status: 401, error: "Session expired. Please log in again." };
    }

    const parsed = await parseBackendResponse(res);
    if (!parsed.ok) {
      return { ok: false, status: parsed.status, error: parsed.error };
    }

    return { ok: true, status: parsed.status, data: parsed.data };
  } catch {
    return { ok: false, status: 500, error: "Network or server error connecting to backend" };
  }
}
