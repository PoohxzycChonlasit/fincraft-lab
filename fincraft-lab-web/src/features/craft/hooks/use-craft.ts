"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { CraftResult, CraftElementResult } from "../types/craft-result.type";

export type CraftInputElement = { id: string };

export type UseCraftReturn = {
  isSubmitting: boolean;
  craftError: string | null;
  craftResult: CraftResult | null;
  handleCraft: (leftElement: CraftInputElement | null, rightElement: CraftInputElement | null) => Promise<CraftResult | null>;
  handleReset: () => void;
  dismissError: () => void;
};

type UseCraftOptions = {
  onDiscovery?: (element: CraftElementResult, isNew: boolean) => void;
  isAuthenticated?: boolean;
};

export function useCraft({ onDiscovery, isAuthenticated = true }: UseCraftOptions = {}): UseCraftReturn {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [craftError, setCraftError] = useState<string | null>(null);
  const [craftResult, setCraftResult] = useState<CraftResult | null>(null);

  const handleCraft = useCallback(async (left: CraftInputElement | null, right: CraftInputElement | null): Promise<CraftResult | null> => {
    if (!left || !right || isSubmitting) return null;
    setCraftError(null);
    setCraftResult(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(isAuthenticated ? "/api/craft" : "/api/craft/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputElementIds: [left.id, right.id] }),
      });

      if (isAuthenticated && res.status === 401) {
        router.push("/login");
        return null;
      }

      const json = (await res.json()) as { data?: CraftResult; error?: string };

      if (!res.ok) {
        setCraftError(json.error ?? "Craft failed. Please try again.");
        return null;
      }

      if (json.data) {
        setCraftResult(json.data);
        if (json.data.outcome === "DISCOVERY") {
          onDiscovery?.(json.data.element, json.data.isNewDiscovery);
          if (isAuthenticated) router.refresh();
        }
        return json.data;
      }
      return null;
    } catch {
      setCraftError("Network error. Please check your connection and try again.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [isAuthenticated, isSubmitting, onDiscovery, router]);

  const handleReset = () => {
    setCraftResult(null);
    setCraftError(null);
  };

  const dismissError = () => setCraftError(null);

  return { isSubmitting, craftError, craftResult, handleCraft, handleReset, dismissError };
}
