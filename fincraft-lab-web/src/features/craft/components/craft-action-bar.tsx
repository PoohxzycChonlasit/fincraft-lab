"use client";

import type { AvailableElement } from "../types/craft-element.type";

type CraftActionBarProps = {
  leftElement: AvailableElement | null;
  rightElement: AvailableElement | null;
  isSubmitting: boolean;
  onCraft: () => void;
  onPlaceOnCanvas: () => void;
};

export function CraftActionBar({
  leftElement,
  rightElement,
  isSubmitting,
  onCraft,
  onPlaceOnCanvas,
}: CraftActionBarProps) {
  const isReady = Boolean(leftElement && rightElement);
  const isDuplicate = Boolean(leftElement && rightElement && leftElement.id === rightElement.id);
  const canCraft = isReady && !isDuplicate && !isSubmitting;
  const hasAnySelection = Boolean(leftElement || rightElement);

  let buttonLabel = "Select 2 Elements to Craft";
  if (isSubmitting) buttonLabel = "Crafting...";
  else if (isDuplicate) buttonLabel = "Elements must be different";
  else if (isReady) buttonLabel = "Craft";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg">
        <button
          type="button"
          onClick={onCraft}
          disabled={!canCraft}
          aria-label={buttonLabel}
          aria-busy={isSubmitting}
          className={[
            "min-h-[44px] w-full sm:w-1/2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)]",
            canCraft
              ? "bg-[var(--color-action-primary)] text-white hover:bg-[var(--color-action-hover)] cursor-pointer"
              : "bg-[var(--surface-inset)] text-muted-foreground border border-[var(--border-subtle)] cursor-not-allowed opacity-60",
          ].join(" ")}
        >
          {buttonLabel}
        </button>
        <button
          type="button"
          onClick={onPlaceOnCanvas}
          disabled={!hasAnySelection}
          aria-label="Place selected on canvas"
          className={[
            "min-h-[44px] w-full sm:w-1/2 rounded-xl border px-5 py-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)]",
            hasAnySelection
              ? "border-[var(--border-interactive)] bg-[var(--surface-resting)] text-foreground hover:bg-[var(--surface-inset)] cursor-pointer"
              : "border-[var(--border-subtle)] bg-[var(--surface-inset)] text-muted-foreground cursor-not-allowed opacity-60",
          ].join(" ")}
        >
          Place selected on canvas
        </button>
      </div>
      {isDuplicate ? (
        <p role="alert" className="text-xs font-medium text-[var(--color-text-danger)]">
          Both slots contain the same element — please choose two different elements.
        </p>
      ) : null}
    </div>
  );
}
