"use client";

import { useState, useCallback } from "react";
import { RecessedCraftBay } from "@/components/fincraft/recessed-craft-bay";
import { MochiLabNote } from "@/components/fincraft/mochi-lab-note";
import type { AvailableElement } from "../types/craft-element.type";
import type { CraftElementResult } from "../types/craft-result.type";
import { useCanvasNodes } from "@/features/canvas/hooks/use-canvas-nodes";
import { FinCraftCanvas } from "@/features/canvas/components/fincraft-canvas";
import { useCraftBaySelection } from "../hooks/use-craft-bay-selection";
import { useCraft } from "../hooks/use-craft";
import { ElementLibrary } from "./element-library";
import { CraftActionBar } from "./craft-action-bar";
import { CraftResultPanel } from "./craft-result-panel";

import type { CanvasSnapshot } from "@/features/workspace/types/workspace.type";

export type CraftLabClientProps = {
  elements: AvailableElement[];
  errorMessage?: string;
  initialWorkspace?: { workspaceId: string; snapshot: CanvasSnapshot };
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

function computeMochiNote(leftElement: AvailableElement | null, rightElement: AvailableElement | null, activeSlot: string): string {
  if (leftElement && rightElement) {
    return `Selected "${leftElement.name}" and "${rightElement.name}". Press Craft to discover a financial concept.`;
  }
  return `Active target slot: ${activeSlot === "left" ? "Left Input" : "Right Input"}. Select an element from the library to fill it.`;
}

type CraftLabBaySectionProps = {
  leftElement: AvailableElement | null;
  rightElement: AvailableElement | null;
  activeSlot: "left" | "right";
  isSubmitting: boolean;
  craftError: string | null;
  setActiveSlot: (slot: "left" | "right") => void;
  handleClearSlot: (slot: "left" | "right") => void;
  onCraft: () => void;
  onPlaceOnCanvas: () => void;
  dismissError: () => void;
};

function CraftLabBaySection({
  leftElement,
  rightElement,
  activeSlot,
  isSubmitting,
  craftError,
  setActiveSlot,
  handleClearSlot,
  onCraft,
  onPlaceOnCanvas,
  dismissError,
}: CraftLabBaySectionProps) {
  const leftItem = leftElement ? { name: leftElement.name, visual: <span aria-hidden="true">{leftElement.emoji || "📄"}</span> } : undefined;
  const rightItem = rightElement ? { name: rightElement.name, visual: <span aria-hidden="true">{rightElement.emoji || "📄"}</span> } : undefined;
  const statusLabel = leftElement && rightElement ? "Ready to Craft" : leftElement || rightElement ? "1 of 2 Slots Filled" : "Craft Bay Empty";

  return (
    <>
      <RecessedCraftBay left={leftItem} right={rightItem} statusLabel={statusLabel} activeSlot={activeSlot} onSelectSlot={setActiveSlot} onClearSlot={handleClearSlot} />
      <CraftActionBar leftElement={leftElement} rightElement={rightElement} isSubmitting={isSubmitting} onCraft={onCraft} onPlaceOnCanvas={onPlaceOnCanvas} />
      {craftError ? <CraftErrorBanner message={craftError} onDismiss={dismissError} /> : null}
    </>
  );
}

export function CraftLabClient({ elements: initialElements, errorMessage, initialWorkspace }: CraftLabClientProps) {
  const [localElements, setLocalElements] = useState<AvailableElement[]>(initialElements);
  const { nodes, onNodesChange, addElementsToCanvas, isDirty, saveStatus, saveError, handleSaveWorkspace } =
    useCanvasNodes(initialWorkspace?.snapshot);

  const workspaceId = initialWorkspace?.workspaceId;
  const handleSave = useCallback(() => {
    if (workspaceId) handleSaveWorkspace(workspaceId);
  }, [workspaceId, handleSaveWorkspace]);

  const handleDiscovery = useCallback((el: CraftElementResult) => {
    setLocalElements((prev) => (prev.some((e) => e.id === el.id) ? prev : [...prev, toAvailableElement(el)]));
  }, []);

  const { activeSlot, setActiveSlot, leftElement, rightElement, handleSelectElement, handleClearSlot } = useCraftBaySelection();
  const { isSubmitting, craftError, craftResult, handleCraft, handleReset, dismissError } = useCraft({ onDiscovery: handleDiscovery });

  const handlePlaceOnCanvas = useCallback(() => {
    const selected = [leftElement, rightElement].filter((e): e is AvailableElement => Boolean(e));
    if (selected.length > 0) addElementsToCanvas(selected);
  }, [leftElement, rightElement, addElementsToCanvas]);

  if (errorMessage) return <LoadErrorBanner message={errorMessage} />;

  return (
    <div className="space-y-8">
      {craftResult ? (
        <CraftResultPanel result={craftResult} leftElement={leftElement} rightElement={rightElement} onReset={handleReset} />
      ) : (
        <CraftLabBaySection
          leftElement={leftElement}
          rightElement={rightElement}
          activeSlot={activeSlot}
          isSubmitting={isSubmitting}
          craftError={craftError}
          setActiveSlot={setActiveSlot}
          handleClearSlot={handleClearSlot}
          onCraft={() => handleCraft(leftElement, rightElement)}
          onPlaceOnCanvas={handlePlaceOnCanvas}
          dismissError={dismissError}
        />
      )}
      <FinCraftCanvas nodes={nodes} onNodesChange={onNodesChange} workspaceId={workspaceId} isDirty={isDirty} saveStatus={saveStatus} saveError={saveError} onSave={handleSave} />
      <ElementLibrary elements={localElements} selectedLeftId={leftElement?.id ?? null} selectedRightId={rightElement?.id ?? null} onSelectElement={handleSelectElement} />
      {!craftResult && (
        <footer aria-label="Craft Lab Status Note">
          <MochiLabNote tone="guidance">{computeMochiNote(leftElement, rightElement, activeSlot)}</MochiLabNote>
        </footer>
      )}
    </div>
  );
}
