"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

export function usePrefetchElementGuidance() {
  const queryClient = useQueryClient();
  return useCallback(
    (elementId: string | null) => {
      if (!elementId) return;
      queryClient.prefetchQuery({
        queryKey: ["element-guidance", elementId],
        queryFn: () => fetchElementGuidanceApi(elementId),
        staleTime: 5 * 60 * 1000,
      });
    },
    [queryClient],
  );
}
