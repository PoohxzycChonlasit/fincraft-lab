import { backendFetch } from "@/lib/api/backend-fetch.server";
import type { AdminCategory } from "../types/category.types";

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const res = await backendFetch("/admin/categories", {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    return [];
  }

  if (isRecord(res.data) && Array.isArray(res.data.data)) {
    return res.data.data as AdminCategory[];
  }

  return [];
}
