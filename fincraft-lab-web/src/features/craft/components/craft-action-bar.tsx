"use client";

import type { AvailableElement } from "../types/craft-element.type";

type CraftActionBarProps = {
  leftElement: AvailableElement | null;
  rightElement: AvailableElement | null;
  isSubmitting: boolean;
  onCraft: () => void;
};

export function CraftActionBar({ leftElement, rightElement, isSubmitting, onCraft }: CraftActionBarProps) {
  const isReady = Boolean(leftElement && rightElement);
  const isDuplicate = Boolean(leftElement && rightElement && leftElement.id === rightElement.id);
  const canCraft = isReady && !isDuplicate && !isSubmitting;

  let buttonLabel = "Select 2 Elements to Craft";
  if (isSubmitting) buttonLabel = "Crafting...";
  else if (isDuplicate) buttonLabel = "Elements must be different";
  else if (isReady) buttonLabel = "Craft";

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onCraft}
        disabled={!canCraft}
        aria-label={buttonLabel}
        aria-busy={isSubmitting}
        className={[
          "min-h-[44px] w-full max-w-xs rounded-xl px-6 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)]",
          canCraft
            ? "bg-[var(--color-action-primary)] text-white hover:bg-[var(--color-action-hover)] cursor-pointer"
            : "bg-[var(--surface-inset)] text-muted-foreground border border-[var(--border-subtle)] cursor-not-allowed opacity-60",
        ].join(" ")}
      >
        {buttonLabel}
      </button>
      {isDuplicate ? (
        <p role="alert" className="text-xs font-medium text-[var(--color-text-danger)]">
          Both slots contain the same element — please choose two different elements.
        </p>
      ) : null}
    </div>
  );
}
