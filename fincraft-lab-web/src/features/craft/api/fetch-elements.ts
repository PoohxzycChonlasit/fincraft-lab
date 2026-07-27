import { backendFetch } from "@/lib/api/backend-fetch.server";
import type { AvailableElement } from "../types/craft-element.type";

export type FetchElementsResult =
  | { success: true; elements: AvailableElement[] }
  | { success: false; redirectLogin: true }
  | { success: false; errorMessage: string };

type ElementsEnvelope = {
  data?: AvailableElement[];
};

export async function fetchAvailableElements(isAuthenticated: boolean): Promise<FetchElementsResult> {
  const res = await backendFetch(isAuthenticated ? "/elements/available" : "/elements", {
    method: "GET",
    requireAuth: isAuthenticated,
  });

  if (!res.ok) {
    if (isAuthenticated && res.status === 401) {
      return { success: false, redirectLogin: true };
    }
    return {
      success: false,
      errorMessage: res.error || "Failed to load elements from backend.",
    };
  }

  const json = res.data as ElementsEnvelope;
  return {
    success: true,
    elements: json.data ?? [],
  };
}
