import type { ElementGuidance, SuggestedPartner } from "../types/element-guidance.type";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSuggestedPartner(value: unknown): value is SuggestedPartner {
  return isRecord(value)
    && typeof value.id === "string"
    && typeof value.name === "string"
    && typeof value.slug === "string"
    && typeof value.emoji === "string"
    && (value.iconUrl === null || typeof value.iconUrl === "string")
    && typeof value.elementType === "string"
    && typeof value.categoryName === "string";
}

function isElementGuidance(value: unknown): value is ElementGuidance {
  if (!isRecord(value) || !isRecord(value.element)) return false;
  const element = value.element;
  const category = element.category;
  if (!isRecord(category)) return false;
  return typeof element.id === "string"
    && typeof element.name === "string"
    && typeof element.slug === "string"
    && typeof element.emoji === "string"
    && (element.iconUrl === null || typeof element.iconUrl === "string")
    && typeof element.elementType === "string"
    && typeof category.id === "string"
    && typeof category.name === "string"
    && typeof element.description === "string"
    && Array.isArray(value.suggestedPartners)
    && value.suggestedPartners.every(isSuggestedPartner);
}

function readElementGuidance(value: unknown): ElementGuidance | null {
  if (isElementGuidance(value)) return value;
  if (isRecord(value) && isElementGuidance(value.data)) return value.data;
  return null;
}

export async function fetchElementGuidanceApi(elementId: string): Promise<ElementGuidance | null> {
  try {
    const res = await fetch(`/api/elements/${encodeURIComponent(elementId)}/guidance`);
    if (!res.ok) return null;
    const json: unknown = await res.json();
    return readElementGuidance(json);
  } catch {
    return null;
  }
}
