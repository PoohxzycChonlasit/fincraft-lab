"use client";

import { useState, useCallback } from "react";
import { RecessedCraftBay } from "@/components/fincraft/recessed-craft-bay";
import { MochiLabNote } from "@/components/fincraft/mochi-lab-note";
import type { AvailableElement } from "../types/craft-element.type";
import type { CraftElementResult } from "../types/craft-result.type";
import { useCraftBaySelection } from "../hooks/use-craft-bay-selection";
import { useCraft } from "../hooks/use-craft";
import { ElementLibrary } from "./element-library";
import { CraftActionBar } from "./craft-action-bar";
import { CraftResultPanel } from "./craft-result-panel";

export type CraftLabClientProps = {
  elements: AvailableElement[];
  errorMessage?: string;
};

function toAvailableElement(el: CraftElementResult): AvailableElement {
  return {
    id: el.id,
    name: el.name,
    slug: el.slug,
    emoji: el.emoji,
    iconUrl: el.iconUrl,
    elementType: el.elementType,
    isStarter: el.isStarter,
  };
}

function LoadErrorBanner({ message }: { message: string }) {
  return (
    <div className="surface-inset rounded-xl p-6 border border-destructive/30 bg-destructive/5 space-y-2">
      <h2 className="text-base font-semibold text-destructive">Unable to Load Craft Lab</h2>
      <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
    </div>
  );
}

function CraftErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 p-4 space-y-2">
      <p className="text-xs font-semibold text-[var(--color-text-danger)]">{message}</p>
      <button type="button" onClick={onDismiss} className="text-xs underline text-[var(--color-text-danger)] hover:no-underline">
        Dismiss
      </button>
    </div>
  );
}

export function CraftLabClient({ elements: initialElements, errorMessage }: CraftLabClientProps) {
  const [localElements, setLocalElements] = useState<AvailableElement[]>(initialElements);

  const handleDiscovery = useCallback((el: CraftElementResult) => {
    setLocalElements((prev) => {
      const alreadyPresent = prev.some((e) => e.id === el.id);
      if (alreadyPresent) return prev;
      return [...prev, toAvailableElement(el)];
    });
  }, []);

  const { activeSlot, setActiveSlot, leftElement, rightElement, handleSelectElement, handleClearSlot } = useCraftBaySelection();
  const { isSubmitting, craftError, craftResult, handleCraft, handleReset, dismissError } = useCraft({ onDiscovery: handleDiscovery });

  if (errorMessage) return <LoadErrorBanner message={errorMessage} />;

  if (craftResult) {
    return (
      <div className="space-y-8">
        <CraftResultPanel result={craftResult} leftElement={leftElement} rightElement={rightElement} onReset={handleReset} />
        <ElementLibrary elements={localElements} selectedLeftId={leftElement?.id ?? null} selectedRightId={rightElement?.id ?? null} onSelectElement={handleSelectElement} />
      </div>
    );
  }

  const bothFilled = Boolean(leftElement && rightElement);
  const statusLabel = bothFilled ? "Ready to Craft" : leftElement || rightElement ? "1 of 2 Slots Filled" : "Craft Bay Empty";
  const mochiNote = bothFilled
    ? `Selected "${leftElement!.name}" and "${rightElement!.name}". Press Craft to discover a financial concept.`
    : `Active target slot: ${activeSlot === "left" ? "Left Input" : "Right Input"}. Select an element from the library to fill it.`;

  const leftItem = leftElement ? { name: leftElement.name, visual: <span aria-hidden="true">{leftElement.emoji || "📄"}</span> } : undefined;
  const rightItem = rightElement ? { name: rightElement.name, visual: <span aria-hidden="true">{rightElement.emoji || "📄"}</span> } : undefined;

  return (
    <div className="space-y-8">
      <RecessedCraftBay left={leftItem} right={rightItem} statusLabel={statusLabel} activeSlot={activeSlot} onSelectSlot={setActiveSlot} onClearSlot={handleClearSlot} />
      <CraftActionBar leftElement={leftElement} rightElement={rightElement} isSubmitting={isSubmitting} onCraft={() => handleCraft(leftElement, rightElement)} />
      {craftError ? <CraftErrorBanner message={craftError} onDismiss={dismissError} /> : null}
      <ElementLibrary elements={localElements} selectedLeftId={leftElement?.id ?? null} selectedRightId={rightElement?.id ?? null} onSelectElement={handleSelectElement} />
      <footer aria-label="Craft Lab Status Note">
        <MochiLabNote tone="guidance">{mochiNote}</MochiLabNote>
      </footer>
    </div>
  );
}
