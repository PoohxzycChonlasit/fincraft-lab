"use client";

import { RecessedCraftBay } from "@/components/fincraft/recessed-craft-bay";
import { MochiLabNote } from "@/components/fincraft/mochi-lab-note";
import {
  CraftActionBar,
  CraftResultPanel,
  ElementLibrary,
  type AvailableElement,
  useCraft,
} from "@/features/craft/public";
import { FinCraftCanvas, useCanvasNodes, type SaveStatus } from "@/features/canvas/public";
import { WorkspaceManager, type CanvasSnapshot, type WorkspaceSummary } from "@/features/workspace/public.client";

type InitialWorkspace = {
  workspaceId: string;
  workspaces: WorkspaceSummary[];
  selectedWorkspace: WorkspaceSummary;
  snapshot: CanvasSnapshot;
};

type CraftController = ReturnType<typeof useCraft>;
type CanvasController = ReturnType<typeof useCanvasNodes>;
type SaveController = {
  saveStatus: SaveStatus;
  saveError: string | null;
  handleSave: () => Promise<void>;
};

export type LabWorkspaceContentProps = {
  initialWorkspace: InitialWorkspace;
  canvas: CanvasController;
  save: SaveController;
  localElements: AvailableElement[];
  leftElement: AvailableElement | null;
  rightElement: AvailableElement | null;
  activeSlot: "left" | "right";
  isSubmitting: boolean;
  craftError: string | null;
  craftResult: CraftController["craftResult"];
  handleReset: () => void;
  handleSelectElement: (element: AvailableElement) => void;
  handleClearSlot: (slot: "left" | "right") => void;
  setActiveSlot: (slot: "left" | "right") => void;
  handleCraft: () => void;
  handlePlaceOnCanvas: () => void;
  dismissError: () => void;
};

function CraftErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 p-4 space-y-2">
      <p className="text-xs font-semibold text-[var(--color-text-danger)]">{message}</p>
      <button type="button" onClick={onDismiss} className="text-xs underline text-[var(--color-text-danger)] hover:no-underline">Dismiss</button>
    </div>
  );
}

function computeMochiNote(leftElement: AvailableElement | null, rightElement: AvailableElement | null, activeSlot: string): string {
  if (leftElement && rightElement) return `Selected "${leftElement.name}" and "${rightElement.name}". Press Craft to discover a financial concept.`;
  return `Active target slot: ${activeSlot === "left" ? "Left Input" : "Right Input"}. Select an element from the library to fill it.`;
}

type CraftLabBaySectionProps = Pick<LabWorkspaceContentProps, "leftElement" | "rightElement" | "activeSlot" | "isSubmitting" | "craftError" | "setActiveSlot" | "handleClearSlot" | "dismissError"> & {
  onCraft: () => void;
  onPlaceOnCanvas: () => void;
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
  const leftItem = leftElement ? { name: leftElement.name, visual: <span aria-hidden="true">{leftElement.emoji || "๐“"}</span> } : undefined;
  const rightItem = rightElement ? { name: rightElement.name, visual: <span aria-hidden="true">{rightElement.emoji || "๐“"}</span> } : undefined;
  const statusLabel = leftElement && rightElement ? "Ready to Craft" : leftElement || rightElement ? "1 of 2 Slots Filled" : "Craft Bay Empty";

  return (
    <>
      <RecessedCraftBay left={leftItem} right={rightItem} statusLabel={statusLabel} activeSlot={activeSlot} onSelectSlot={setActiveSlot} onClearSlot={handleClearSlot} />
      <CraftActionBar leftElement={leftElement} rightElement={rightElement} isSubmitting={isSubmitting} onCraft={onCraft} onPlaceOnCanvas={onPlaceOnCanvas} />
      {craftError ? <CraftErrorBanner message={craftError} onDismiss={dismissError} /> : null}
    </>
  );
}

export function LabWorkspaceContent({
  initialWorkspace,
  canvas,
  save,
  localElements,
  leftElement,
  rightElement,
  activeSlot,
  isSubmitting,
  craftError,
  craftResult,
  handleReset,
  handleSelectElement,
  handleClearSlot,
  setActiveSlot,
  handleCraft,
  handlePlaceOnCanvas,
  dismissError,
}: LabWorkspaceContentProps) {
  return (
    <div className="space-y-8">
      <WorkspaceManager workspaces={initialWorkspace.workspaces} selectedWorkspace={initialWorkspace.selectedWorkspace} />
      {craftResult ? <CraftResultPanel result={craftResult} leftElement={leftElement} rightElement={rightElement} onReset={handleReset} /> : <CraftLabBaySection leftElement={leftElement} rightElement={rightElement} activeSlot={activeSlot} isSubmitting={isSubmitting} craftError={craftError} setActiveSlot={setActiveSlot} handleClearSlot={handleClearSlot} onCraft={handleCraft} onPlaceOnCanvas={handlePlaceOnCanvas} dismissError={dismissError} />}
      <FinCraftCanvas nodes={canvas.nodes} onNodesChange={canvas.onNodesChange} workspaceId={initialWorkspace.workspaceId} isDirty={canvas.isDirty} saveStatus={save.saveStatus} saveError={save.saveError} onSave={save.handleSave} />
      <ElementLibrary elements={localElements} selectedLeftId={leftElement?.id ?? null} selectedRightId={rightElement?.id ?? null} onSelectElement={handleSelectElement} />
      {!craftResult ? <footer aria-label="Craft Lab Status Note"><MochiLabNote tone="guidance">{computeMochiNote(leftElement, rightElement, activeSlot)}</MochiLabNote></footer> : null}
    </div>
  );
}
