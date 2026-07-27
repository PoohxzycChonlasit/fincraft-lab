import { getAccessToken } from "@/lib/auth/access-token.server";
import { BackendApiError } from "./backend-api-error";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type BackendFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  requireAuth?: boolean;
};

export type BackendFetchResponse<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: string };

export async function backendFetch<T = unknown>(
  path: string,
  options: BackendFetchOptions = {},
): Promise<BackendFetchResponse<T>> {
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

  const url = `${BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;

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

    const responseData: unknown = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message = BackendApiError.parseMessage(responseData);
      return { ok: false, status: res.status, error: message };
    }

    return { ok: true, status: res.status, data: responseData as T };
  } catch {
    return { ok: false, status: 500, error: "Network or server error connecting to backend" };
  }
}
