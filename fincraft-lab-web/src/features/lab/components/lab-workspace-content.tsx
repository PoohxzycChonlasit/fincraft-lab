"use client";

import Link from "next/link";
import { WorkspaceManager, type CanvasSnapshot, type WorkspaceSummary } from "@/features/workspace/public.client";
import { FinCraftCanvas, useCanvasNodes, type SaveStatus } from "@/features/canvas/public";
import { useCanvasCombine } from "@/features/canvas/hooks/use-canvas-combine";
import { ElementLibrary, type AvailableElement } from "@/features/craft/public";
import { CraftResultPanel } from "@/features/craft/components/craft-result-panel";
import { MochiLabNote } from "@/components/fincraft/mochi-lab-note";
import { RecessedCraftBay } from "@/components/fincraft/recessed-craft-bay";
import { CraftActionBar } from "@/features/craft/components/craft-action-bar";

type InitialWorkspace = {
  workspaceId: string;
  workspaces: WorkspaceSummary[];
  selectedWorkspace: WorkspaceSummary;
  snapshot: CanvasSnapshot;
};

type CanvasController = ReturnType<typeof useCanvasNodes>;
type CombineController = ReturnType<typeof useCanvasCombine>;
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
  combine: CombineController;
  localElements: AvailableElement[];
  leftElement: AvailableElement | null;
  rightElement: AvailableElement | null;
  activeSlot: "left" | "right";
  handleSelectElement: (element: AvailableElement) => void;
  handleClearSlot: (slot: "left" | "right") => void;
  setActiveSlot: (slot: "left" | "right") => void;
  handlePlaceOnCanvas: () => void;
};

function GuestCanvasNotice() {
  return (
    <p role="note" className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-3 text-xs leading-relaxed text-muted-foreground">
      Guest canvas changes are temporary.{" "}
      <Link href="/login" className="font-semibold text-[var(--color-action-primary)] underline hover:no-underline">
        Sign in to save your workspace.
      </Link>
    </p>
  );
}

function InlineCraftErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div role="alert" className="space-y-2 rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 p-4">
      <p className="text-xs font-semibold text-[var(--color-text-danger)]">{message}</p>
      <button type="button" onClick={onDismiss} className="text-xs text-[var(--color-text-danger)] underline hover:no-underline">
        Dismiss
      </button>
    </div>
  );
}

function CraftBaySection({
  leftElement,
  rightElement,
  activeSlot,
  setActiveSlot,
  handleClearSlot,
  handlePlaceOnCanvas,
}: Pick<LabWorkspaceContentProps, "leftElement" | "rightElement" | "activeSlot" | "setActiveSlot" | "handleClearSlot" | "handlePlaceOnCanvas">) {
  const leftItem = leftElement
    ? { name: leftElement.name, visual: <span aria-hidden="true">{leftElement.emoji || "Element"}</span> }
    : undefined;
  const rightItem = rightElement
    ? { name: rightElement.name, visual: <span aria-hidden="true">{rightElement.emoji || "Element"}</span> }
    : undefined;
  const statusLabel =
    leftElement && rightElement ? "Ready to Craft" : leftElement || rightElement ? "1 of 2 Slots Filled" : "Craft Bay Empty";

  return (
    <>
      <RecessedCraftBay left={leftItem} right={rightItem} statusLabel={statusLabel} activeSlot={activeSlot} onSelectSlot={setActiveSlot} onClearSlot={handleClearSlot} />
      <CraftActionBar leftElement={leftElement} rightElement={rightElement} isSubmitting={false} onCraft={() => undefined} onPlaceOnCanvas={handlePlaceOnCanvas} />
    </>
  );
}


function NoRecipePanel({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="surface-inset rounded-2xl border border-[var(--border-subtle)] p-5 space-y-3 text-center">
      <p className="text-sm font-semibold text-foreground">No Recipe Found</p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        These two elements don&apos;t produce a known concept. Try a different combination.
      </p>
      <button type="button" onClick={onDismiss} className="min-h-[44px] rounded-xl border border-[var(--border-interactive)] bg-[var(--surface-resting)] px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-[var(--surface-inset)] transition-colors">
        Dismiss
      </button>
    </div>
  );
}

function CombineFeedbackSection({ combine }: { combine: CombineController }) {
  const discoveryResult = combine.craftResult?.outcome === "DISCOVERY" ? combine.craftResult : null;
  const noRecipeResult = combine.craftResult?.outcome === "NO_RECIPE" ? combine.craftResult : null;
  return (
    <>
      {combine.craftError ? <InlineCraftErrorBanner message={combine.craftError} onDismiss={combine.dismissError} /> : null}
      {noRecipeResult ? <NoRecipePanel onDismiss={combine.handleReset} /> : null}
      {discoveryResult ? <CraftResultPanel result={discoveryResult} leftElement={null} rightElement={null} onReset={combine.handleReset} /> : null}
    </>
  );
}

export function LabWorkspaceContent({
  isAuthenticated,
  initialWorkspace,
  canvas,
  save,
  combine,
  localElements,
  leftElement,
  rightElement,
  activeSlot,
  handleSelectElement,
  handleClearSlot,
  setActiveSlot,
  handlePlaceOnCanvas,
}: LabWorkspaceContentProps) {
  return (
    <div className="space-y-8">
      {isAuthenticated && initialWorkspace ? (
        <WorkspaceManager workspaces={initialWorkspace.workspaces} selectedWorkspace={initialWorkspace.selectedWorkspace} />
      ) : null}
      <CraftBaySection leftElement={leftElement} rightElement={rightElement} activeSlot={activeSlot} setActiveSlot={setActiveSlot} handleClearSlot={handleClearSlot} handlePlaceOnCanvas={handlePlaceOnCanvas} />
      <CombineFeedbackSection combine={combine} />
      <FinCraftCanvas
        nodes={canvas.nodes} onNodesChange={canvas.onNodesChange}
        onDropLibraryElement={combine.handleDropOnCanvas} onTargetHighlight={combine.handleTargetHighlight}
        onCombineNodes={combine.handleCombineNodes} onNodeTap={combine.handleNodeTap}
        onClearTapSelection={combine.handleClearTapSelection}
        workspaceId={isAuthenticated ? initialWorkspace?.workspaceId : undefined}
        isDirty={canvas.isDirty}
        saveStatus={isAuthenticated ? save.saveStatus : undefined}
        saveError={isAuthenticated ? save.saveError : undefined}
        onSave={isAuthenticated ? save.handleSave : undefined}
      />
      {!isAuthenticated ? <GuestCanvasNotice /> : null}
      <ElementLibrary elements={localElements} selectedLeftId={leftElement?.id ?? null} selectedRightId={rightElement?.id ?? null} onSelectElement={handleSelectElement} onDragStart={undefined} />
      <footer aria-label="Craft Lab Status Note">
        <MochiLabNote tone="guidance">
          Drag elements from the Library onto the canvas. Drag one canvas element onto another to combine and discover financial concepts. Tap two elements on mobile to combine.
        </MochiLabNote>
      </footer>
    </div>
  );
}
