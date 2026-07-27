"use client";

import { RecessedCraftBay } from "@/components/fincraft/recessed-craft-bay";
import { MochiLabNote } from "@/components/fincraft/mochi-lab-note";
import type { AvailableElement } from "../types/craft-element.type";
import { useCraftBaySelection } from "../hooks/use-craft-bay-selection";
import { ElementLibrary } from "./element-library";

export type CraftLabClientProps = {
  elements: AvailableElement[];
  errorMessage?: string;
};

export function CraftLabClient({ elements, errorMessage }: CraftLabClientProps) {
  const { activeSlot, setActiveSlot, leftElement, rightElement, handleSelectElement, handleClearSlot } = useCraftBaySelection();

  if (errorMessage) {
    return (
      <div className="surface-inset rounded-xl p-6 border border-destructive/30 bg-destructive/5 space-y-2">
        <h2 className="text-base font-semibold text-destructive">Unable to Load Craft Lab</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">{errorMessage}</p>
      </div>
    );
  }

  const statusLabel = leftElement && rightElement ? "Ready to Craft" : leftElement || rightElement ? "1 of 2 Slots Filled" : "Craft Bay Empty";
  const mochiNoteText = leftElement && rightElement
    ? `Selected "${leftElement.name}" and "${rightElement.name}". Craft execution will be unlocked in the next step.`
    : `Active target slot: ${activeSlot === "left" ? "Left Input" : "Right Input"}. Select an element from the library to fill it.`;

  const leftItem = leftElement ? { name: leftElement.name, visual: <span aria-hidden="true">{leftElement.emoji || "📄"}</span> } : undefined;
  const rightItem = rightElement ? { name: rightElement.name, visual: <span aria-hidden="true">{rightElement.emoji || "📄"}</span> } : undefined;

  return (
    <div className="space-y-8">
      <RecessedCraftBay left={leftItem} right={rightItem} statusLabel={statusLabel} activeSlot={activeSlot} onSelectSlot={setActiveSlot} onClearSlot={handleClearSlot} />
      <ElementLibrary elements={elements} selectedLeftId={leftElement?.id ?? null} selectedRightId={rightElement?.id ?? null} onSelectElement={handleSelectElement} />
      <footer aria-label="Craft Lab Status Note">
        <MochiLabNote tone="guidance">{mochiNoteText}</MochiLabNote>
      </footer>
    </div>
  );
}
