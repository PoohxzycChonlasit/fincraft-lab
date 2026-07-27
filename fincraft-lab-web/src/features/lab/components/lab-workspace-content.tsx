"use client";

import Link from "next/link";
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
  isAuthenticated: boolean;
  initialWorkspace?: InitialWorkspace;
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
    <div role="alert" className="space-y-2 rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 p-4">
      <p className="text-xs font-semibold text-[var(--color-text-danger)]">{message}</p>
      <button type="button" onClick={onDismiss} className="text-xs text-[var(--color-text-danger)] underline hover:no-underline">Dismiss</button>
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
  const leftItem = leftElement ? { name: leftElement.name, visual: <span aria-hidden="true">{leftElement.emoji || "Element"}</span> } : undefined;
  const rightItem = rightElement ? { name: rightElement.name, visual: <span aria-hidden="true">{rightElement.emoji || "Element"}</span> } : undefined;
  const statusLabel = leftElement && rightElement ? "Ready to Craft" : leftElement || rightElement ? "1 of 2 Slots Filled" : "Craft Bay Empty";

  return (
    <>
      <RecessedCraftBay left={leftItem} right={rightItem} statusLabel={statusLabel} activeSlot={activeSlot} onSelectSlot={setActiveSlot} onClearSlot={handleClearSlot} />
      <CraftActionBar leftElement={leftElement} rightElement={rightElement} isSubmitting={isSubmitting} onCraft={onCraft} onPlaceOnCanvas={onPlaceOnCanvas} />
      {craftError ? <CraftErrorBanner message={craftError} onDismiss={dismissError} /> : null}
    </>
  );
}

function GuestCanvasNotice() {
  return (
    <p role="note" className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-3 text-xs leading-relaxed text-muted-foreground">
      Guest canvas changes are temporary. <Link href="/login" className="font-semibold text-[var(--color-action-primary)] underline hover:no-underline">Sign in to save your workspace.</Link>
    </p>
  );
}

export function LabWorkspaceContent({
  isAuthenticated,
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
      {isAuthenticated && initialWorkspace ? <WorkspaceManager workspaces={initialWorkspace.workspaces} selectedWorkspace={initialWorkspace.selectedWorkspace} /> : null}
      {craftResult ? <CraftResultPanel result={craftResult} leftElement={leftElement} rightElement={rightElement} onReset={handleReset} /> : <CraftLabBaySection leftElement={leftElement} rightElement={rightElement} activeSlot={activeSlot} isSubmitting={isSubmitting} craftError={craftError} setActiveSlot={setActiveSlot} handleClearSlot={handleClearSlot} onCraft={handleCraft} onPlaceOnCanvas={handlePlaceOnCanvas} dismissError={dismissError} />}
      <FinCraftCanvas
        nodes={canvas.nodes}
        onNodesChange={canvas.onNodesChange}
        workspaceId={isAuthenticated ? initialWorkspace?.workspaceId : undefined}
        isDirty={canvas.isDirty}
        saveStatus={isAuthenticated ? save.saveStatus : undefined}
        saveError={isAuthenticated ? save.saveError : undefined}
        onSave={isAuthenticated ? save.handleSave : undefined}
      />
      {!isAuthenticated ? <GuestCanvasNotice /> : null}
      <ElementLibrary elements={localElements} selectedLeftId={leftElement?.id ?? null} selectedRightId={rightElement?.id ?? null} onSelectElement={handleSelectElement} />
      {!craftResult ? <footer aria-label="Craft Lab Status Note"><MochiLabNote tone="guidance">{computeMochiNote(leftElement, rightElement, activeSlot)}</MochiLabNote></footer> : null}
    </div>
  );
}
