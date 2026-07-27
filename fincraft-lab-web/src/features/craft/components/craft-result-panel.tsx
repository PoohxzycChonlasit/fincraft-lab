"use client";

import { OrangeDiscoveryStamp } from "@/components/fincraft/orange-discovery-stamp";
import type { CraftResult } from "../types/craft-result.type";
import type { AvailableElement } from "../types/craft-element.type";

type CraftResultPanelProps = {
  result: CraftResult;
  leftElement: AvailableElement | null;
  rightElement: AvailableElement | null;
  onReset: () => void;
};

function NoRecipePanel({ onReset }: { onReset: () => void }) {
  return (
    <div className="surface-inset rounded-2xl border border-[var(--border-subtle)] p-5 space-y-3 text-center">
      <p className="text-sm font-semibold text-foreground">No Recipe Found</p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        This combination of elements doesn&apos;t produce a known financial concept. Try a different pair.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="min-h-[44px] rounded-xl border border-[var(--border-interactive)] bg-[var(--surface-resting)] px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-[var(--surface-inset)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
      >
        Try Again
      </button>
    </div>
  );
}

export function CraftResultPanel({ result, leftElement, rightElement, onReset }: CraftResultPanelProps) {
  if (result.outcome === "NO_RECIPE") {
    return <NoRecipePanel onReset={onReset} />;
  }

  const { element, detail, isNewDiscovery } = result;
  const combo = leftElement && rightElement
    ? `${leftElement.name} + ${rightElement.name}`
    : `${element.emoji} ${element.name}`;
  const statusLabel = isNewDiscovery ? "New Discovery!" : "Rediscovered";

  return (
    <div className="space-y-4">
      <OrangeDiscoveryStamp
        title={element.name}
        combination={combo}
        supportingText={detail.shortDescription}
        statusLabel={statusLabel}
      />
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onReset}
          className="min-h-[44px] rounded-xl border border-[var(--border-interactive)] bg-[var(--surface-resting)] px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-[var(--surface-inset)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        >
          Craft Again
        </button>
      </div>
    </div>
  );
}
