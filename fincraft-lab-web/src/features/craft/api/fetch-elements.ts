import { cookies } from "next/headers";
import type { AvailableElement } from "../types/craft-element.type";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type FetchElementsResult =
  | { success: true; elements: AvailableElement[] }
  | { success: false; redirectLogin: true }
  | { success: false; errorMessage: string };

export async function fetchAvailableElements(): Promise<FetchElementsResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return { success: false, redirectLogin: true };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/elements`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      return { success: false, redirectLogin: true };
    }

    if (!res.ok) {
      return {
        success: false,
        errorMessage: `Failed to load elements from backend (HTTP ${res.status}).`,
      };
    }

    const json = (await res.json()) as { data?: AvailableElement[] };
    return {
      success: true,
      elements: json.data ?? [],
    };
  } catch {
    return {
      success: false,
      errorMessage: "Backend connection error. Please ensure the API server is running.",
    };
  }
}
