"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchElementGuidanceApi } from "../api/fetch-element-guidance";
import type { ElementGuidance } from "../types/element-guidance.type";

export function useElementGuidance(elementId: string | null) {
  return useQuery<ElementGuidance | null>({
    queryKey: ["element-guidance", elementId],
    queryFn: () => (elementId ? fetchElementGuidanceApi(elementId) : Promise.resolve(null)),
    enabled: Boolean(elementId),
    staleTime: 5 * 60 * 1000,
  });
}
