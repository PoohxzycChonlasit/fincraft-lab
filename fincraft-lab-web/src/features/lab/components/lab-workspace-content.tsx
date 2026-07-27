"use client";

import Link from "next/link";
import { WorkspaceManager, type CanvasSnapshot, type WorkspaceSummary } from "@/features/workspace/public.client";
import { FinCraftCanvas, useCanvasNodes, type SaveStatus } from "@/features/canvas/public";
import { CraftResultPanel, ElementLibrary, type AvailableElement } from "@/features/craft/public";
import { MochiLabNote } from "@/components/fincraft/mochi-lab-note";
import type { useLabCraftCombine } from "../hooks/use-lab-craft-combine";

type InitialWorkspace = {
  workspaceId: string;
  workspaces: WorkspaceSummary[];
  selectedWorkspace: WorkspaceSummary;
  snapshot: CanvasSnapshot;
};

type CanvasController = ReturnType<typeof useCanvasNodes>;
type CombineController = ReturnType<typeof useLabCraftCombine>;
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
  handlePlaceElement: (element: AvailableElement) => void;
};

function GuestCanvasNotice() {
  return (
    <p role="note" className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-3 text-xs leading-relaxed text-muted-foreground">
      Guest canvas changes are temporary. <Link href="/login" className="font-semibold text-[var(--color-action-primary)] underline hover:no-underline">Sign in to save your workspace.</Link>
    </p>
  );
}

function InlineCraftError({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div role="alert" className="space-y-2 rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 p-4">
      <p className="text-xs font-semibold text-[var(--color-text-danger)]">{message}</p>
      <button type="button" onClick={onDismiss} className="text-xs text-[var(--color-text-danger)] underline hover:no-underline">Dismiss</button>
    </div>
  );
}

function CombineFeedbackSection({ combine }: { combine: CombineController }) {
  if (combine.craftError) return <InlineCraftError message={combine.craftError} onDismiss={combine.dismissError} />;
  if (combine.craftResult?.outcome === "NO_RECIPE") {
    return <p role="status" className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-3 text-xs text-muted-foreground">No discovery yet. Try another combination.</p>;
  }
  if (combine.craftResult?.outcome === "DISCOVERY") {
    return <CraftResultPanel result={combine.craftResult} leftElement={null} rightElement={null} onReset={combine.handleReset} />;
  }
  return null;
}

export function LabWorkspaceContent({
  isAuthenticated,
  initialWorkspace,
  canvas,
  save,
  combine,
  localElements,
  handlePlaceElement,
}: LabWorkspaceContentProps) {
  return (
    <div className="space-y-8">
      {isAuthenticated && initialWorkspace ? <WorkspaceManager workspaces={initialWorkspace.workspaces} selectedWorkspace={initialWorkspace.selectedWorkspace} /> : null}
      <CombineFeedbackSection combine={combine} />
      <FinCraftCanvas
        nodes={canvas.nodes}
        onNodesChange={canvas.onNodesChange}
        onDropLibraryElement={combine.handleDropOnCanvas}
        onTargetHighlight={combine.handleTargetHighlight}
        onCombineNodes={combine.handleCombineNodes}
        onNodeTap={combine.handleNodeTap}
        onClearTapSelection={combine.handleClearTapSelection}
        workspaceId={isAuthenticated ? initialWorkspace?.workspaceId : undefined}
        isDirty={canvas.isDirty}
        saveStatus={isAuthenticated ? save.saveStatus : undefined}
        saveError={isAuthenticated ? save.saveError : undefined}
        onSave={isAuthenticated ? save.handleSave : undefined}
      />
      {!isAuthenticated ? <GuestCanvasNotice /> : null}
      <ElementLibrary elements={localElements} onPlaceElement={handlePlaceElement} />
      <footer aria-label="Craft Lab Status Note">
        <MochiLabNote tone="guidance">Drag elements from the Library onto the canvas. Drag one canvas element onto another to combine and discover financial concepts. Tap two elements on mobile to combine.</MochiLabNote>
      </footer>
    </div>
  );
}
