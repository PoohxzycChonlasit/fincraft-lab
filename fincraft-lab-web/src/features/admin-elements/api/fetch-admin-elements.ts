import { cookies } from "next/headers";
import type { AdminElementSummary } from "../types/admin-element.type";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type FetchAdminElementsResult =
  | { success: true; elements: AdminElementSummary[] }
  | { success: false; redirectLogin: true }
  | { success: false; errorMessage: string };

export async function fetchAdminElements(): Promise<FetchAdminElementsResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return { success: false, redirectLogin: true };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/admin/elements`, {
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
        errorMessage: `Failed to load admin elements (HTTP ${res.status}).`,
      };
    }

    const json = (await res.json()) as { data?: AdminElementSummary[] };
    return {
      success: true,
      elements: json.data ?? [],
    };
  } catch {
    return {
      success: false,
      errorMessage: "Backend connection error while fetching admin elements.",
    };
  }
}
