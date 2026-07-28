import { backendFetch } from "@/lib/api/backend-fetch.server";
import type { AvailableElement } from "../types/craft-element.type";

export type FetchElementsResult =
  | { success: true; elements: AvailableElement[] }
  | { success: false; redirectLogin: true }
  | { success: false; errorMessage: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAvailableElement(value: unknown): value is AvailableElement {
  if (!isRecord(value) || !isRecord(value.category)) return false;
  return typeof value.id === "string"
    && typeof value.name === "string"
    && typeof value.slug === "string"
    && typeof value.emoji === "string"
    && (value.iconUrl === null || typeof value.iconUrl === "string")
    && typeof value.elementType === "string"
    && typeof value.isStarter === "boolean"
    && typeof value.category.id === "string"
    && typeof value.category.name === "string"
    && typeof value.category.sortOrder === "number";
}

function readAvailableElements(value: unknown): AvailableElement[] | null {
  if (!isRecord(value) || !Array.isArray(value.data)) return null;
  return value.data.every(isAvailableElement) ? value.data : null;
}

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

  const elements = readAvailableElements(res.data);
  if (!elements) {
    return { success: false, errorMessage: "Elements response was invalid." };
  }
  return {
    success: true,
    elements,
  };
}
