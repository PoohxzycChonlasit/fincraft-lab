import { backendFetch } from "@/lib/api/backend-fetch.server";
import type { AdminElementSummary } from "../types/admin-element.type";

export type FetchAdminElementsResult =
  | { success: true; elements: AdminElementSummary[] }
  | { success: false; redirectLogin: true }
  | { success: false; errorMessage: string };

type AdminElementsEnvelope = {
  data?: AdminElementSummary[];
};

export async function fetchAdminElements(): Promise<FetchAdminElementsResult> {
  const res = await backendFetch("/admin/elements", {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    if (res.status === 401) {
      return { success: false, redirectLogin: true };
    }
    return {
      success: false,
      errorMessage: res.error || `Failed to load admin elements (HTTP ${res.status}).`,
    };
  }

  const json = res.data as AdminElementsEnvelope;
  return {
    success: true,
    elements: json.data ?? [],
  };
}
