"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AvailableElement } from "../types/craft-element.type";
import type { CraftResult } from "../types/craft-result.type";

export type UseCraftReturn = {
  isSubmitting: boolean;
  craftError: string | null;
  craftResult: CraftResult | null;
  handleCraft: (leftElement: AvailableElement | null, rightElement: AvailableElement | null) => Promise<void>;
  handleReset: () => void;
  dismissError: () => void;
};

export function useCraft(): UseCraftReturn {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [craftError, setCraftError] = useState<string | null>(null);
  const [craftResult, setCraftResult] = useState<CraftResult | null>(null);

  const handleCraft = async (left: AvailableElement | null, right: AvailableElement | null) => {
    if (!left || !right || isSubmitting) return;
    setCraftError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/craft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputElementIds: [left.id, right.id] }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const json = (await res.json()) as { data?: CraftResult; error?: string };

      if (!res.ok) {
        setCraftError(json.error ?? "Craft failed. Please try again.");
        return;
      }

      if (json.data) setCraftResult(json.data);
    } catch {
      setCraftError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCraftResult(null);
    setCraftError(null);
  };

  const dismissError = () => setCraftError(null);

  return { isSubmitting, craftError, craftResult, handleCraft, handleReset, dismissError };
}
