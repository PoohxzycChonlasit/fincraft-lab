import { backendFetch } from "@/lib/api/backend-fetch.server";
import type { AdminCategory } from "../types/category.types";

export type GetAdminCategoriesResult =
  | { success: true; categories: AdminCategory[] }
  | { success: false; redirectLogin: true }
  | { success: false; errorMessage: string };

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export async function getAdminCategories(): Promise<GetAdminCategoriesResult> {
  const res = await backendFetch("/admin/categories", {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    if (res.status === 401) {
      return { success: false, redirectLogin: true };
    }

    return {
      success: false,
      errorMessage: getCategoryLoadError(res.status),
    };
  }

  if (isRecord(res.data) && Array.isArray(res.data.data)) {
    return { success: true, categories: res.data.data as AdminCategory[] };
  }

  return {
    success: false,
    errorMessage: "The category catalogue returned an incomplete response.",
  };
}

function getCategoryLoadError(status: number): string {
  if (status === 403) return "You do not have permission to view Categories.";
  if (status >= 500) return "The category catalogue is temporarily unavailable. Try again.";
  return "We could not load Categories. Try again.";
}
