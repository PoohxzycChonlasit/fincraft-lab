import type { ElementGuidance } from "../types/element-guidance.type";

export async function fetchElementGuidanceApi(elementId: string): Promise<ElementGuidance | null> {
  try {
    const res = await fetch(`/api/elements/${encodeURIComponent(elementId)}/guidance`);
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.element ? json : json?.data) as ElementGuidance;
  } catch {
    return null;
  }
}
