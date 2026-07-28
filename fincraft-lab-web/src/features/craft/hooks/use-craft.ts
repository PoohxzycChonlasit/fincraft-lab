"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { CraftResult, CraftDiscoveryResult, CraftDiscoverySource, CraftElementResult } from "../types/craft-result.type";

export type CraftInputElement = { id: string };

export type UseCraftReturn = {
  isSubmitting: boolean;
  craftError: string | null;
  craftResult: CraftResult | null;
  lastDiscovery: CraftDiscoveryResult | null;
  handleCraft: (leftElement: CraftInputElement | null, rightElement: CraftInputElement | null) => Promise<CraftResult | null>;
  handleReset: () => void;
  dismissError: () => void;
  setLastDiscovery: (discovery: CraftDiscoveryResult | null) => void;
};

type UseCraftOptions = {
  onDiscovery?: (element: CraftElementResult, isNew: boolean) => void;
  isAuthenticated?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isCraftSource(value: unknown): value is CraftDiscoverySource {
  return isRecord(value)
    && typeof value.title === "string"
    && typeof value.organization === "string"
    && typeof value.url === "string"
    && (value.jurisdiction === undefined || typeof value.jurisdiction === "string")
    && (value.sourceType === undefined || typeof value.sourceType === "string");
}

function isCraftElement(value: unknown): value is CraftElementResult {
  return isRecord(value)
    && typeof value.id === "string"
    && typeof value.name === "string"
    && typeof value.slug === "string"
    && (value.iconUrl === null || typeof value.iconUrl === "string")
    && typeof value.emoji === "string"
    && typeof value.elementType === "string"
    && typeof value.isStarter === "boolean";
}

function isCraftResult(value: unknown): value is CraftResult {
  if (!isRecord(value) || typeof value.outcome !== "string") return false;
  if (value.outcome === "NO_RECIPE") return true;
  if (value.outcome !== "DISCOVERY" || typeof value.isNewDiscovery !== "boolean" || !isCraftElement(value.element) || !isRecord(value.detail)) return false;
  const detail = value.detail;
  return typeof detail.shortDescription === "string"
    && typeof detail.realLesson === "string"
    && isNullableString(detail.example)
    && isNullableString(detail.possibleBenefit)
    && isNullableString(detail.possibleTradeoff)
    && isNullableString(detail.hiddenRisk)
    && isNullableString(detail.worksWhen)
    && isNullableString(detail.becomesDifficultWhen)
    && isNullableString(detail.whatChangesOutcome)
    && typeof detail.realityLevel === "string"
    && typeof detail.safetyLabel === "string"
    && Array.isArray(detail.sources)
    && detail.sources.every(isCraftSource);
}

function readCraftResponse(value: unknown): { data?: CraftResult; error?: string } {
  if (!isRecord(value)) return {};
  return {
    ...(isCraftResult(value.data) ? { data: value.data } : {}),
    ...(typeof value.error === "string" ? { error: value.error } : {}),
  };
}

export function useCraft({ onDiscovery, isAuthenticated = true }: UseCraftOptions = {}): UseCraftReturn {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [craftError, setCraftError] = useState<string | null>(null);
  const [craftResult, setCraftResult] = useState<CraftResult | null>(null);
  const [lastDiscovery, setLastDiscovery] = useState<CraftDiscoveryResult | null>(null);

  const handleCraft = useCallback(async (left: CraftInputElement | null, right: CraftInputElement | null): Promise<CraftResult | null> => {
    if (!left || !right || isSubmitting) return null;
    setCraftError(null);
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

      const body: unknown = await res.json();
      const json = readCraftResponse(body);

      if (!res.ok) {
        setCraftError(json.error ?? "Craft failed. Please try again.");
        return null;
      }

      if (json.data) {
        setCraftResult(json.data);
        if (json.data.outcome === "DISCOVERY") {
          setLastDiscovery(json.data);
          onDiscovery?.(json.data.element, json.data.isNewDiscovery);
        }
        return json.data;
      }
      setCraftError("Craft response was invalid. Please try again.");
      return null;
    } catch {
      setCraftError("Network error. Please check your connection and try again.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [isAuthenticated, isSubmitting, onDiscovery, router]);

  const handleReset = useCallback(() => {
    setCraftResult(null);
    setCraftError(null);
  }, []);

  const dismissError = useCallback(() => setCraftError(null), []);

  return { isSubmitting, craftError, craftResult, lastDiscovery, handleCraft, handleReset, dismissError, setLastDiscovery };
}
