"use client";

import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  type OnNodesChange,
} from "@xyflow/react";
import type { SaveStatus } from "../hooks/use-canvas-nodes";
import type { ElementCanvasNode } from "../types/canvas-node.type";
import { ElementCanvasNodeComponent } from "./element-canvas-node";

const nodeTypes = {
  elementNode: ElementCanvasNodeComponent,
};

type FinCraftCanvasProps = {
  nodes: ElementCanvasNode[];
  onNodesChange: OnNodesChange<ElementCanvasNode>;
  workspaceId?: string;
  isDirty?: boolean;
  saveStatus?: SaveStatus;
  saveError?: string | null;
  onSave?: () => void;
};

function CanvasEmptyOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
      <div className="surface-floating max-w-sm rounded-2xl border border-[var(--border-subtle)] p-5 space-y-2">
        <p className="text-sm font-semibold text-foreground">Infinite Craft Workspace</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your canvas is currently empty. Select elements in the Craft Bay and click &quot;Place selected on canvas&quot; to inspect them here.
        </p>
      </div>
    </div>
  );
}

function SaveStatusIndicator({ isDirty, saveStatus }: { isDirty?: boolean; saveStatus?: SaveStatus }) {
  if (saveStatus === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-craft-accent)]">
        <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-craft-accent)] animate-pulse" />
        Saving...
      </span>
    );
  }
  if (saveStatus === "error") {
    return <span className="text-xs font-semibold text-[var(--color-text-danger)]">Save error</span>;
  }
  if (isDirty) {
    return <span className="text-xs font-semibold text-[var(--color-craft-accent)]">Unsaved changes</span>;
  }
  if (saveStatus === "saved") {
    return <span className="text-xs font-semibold text-[var(--primitive-teal-700)]">Saved</span>;
  }
  return null;
}

function CanvasHeader({
  nodeCount,
  isDirty,
  saveStatus,
  canSave,
  isSaving,
  onSave,
}: {
  nodeCount: number;
  isDirty?: boolean;
  saveStatus?: SaveStatus;
  canSave: boolean;
  isSaving: boolean;
  onSave?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Infinite Craft Workspace ({nodeCount})
        </h2>
        <SaveStatusIndicator isDirty={isDirty} saveStatus={saveStatus} />
      </div>
      {onSave && (
        <button
          type="button"
          onClick={onSave}
          disabled={!canSave}
          aria-label="Save workspace"
          className={[
            "min-h-[44px] rounded-xl px-4 py-2.5 text-xs font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)]",
            canSave
              ? "bg-[var(--color-action-primary)] text-white hover:bg-[var(--color-action-hover)] cursor-pointer"
              : "bg-[var(--surface-inset)] text-muted-foreground border-[var(--border-subtle)] cursor-not-allowed opacity-60",
          ].join(" ")}
        >
          {isSaving ? "Saving..." : "Save workspace"}
        </button>
      )}
    </div>
  );
}

export function FinCraftCanvas({
  nodes,
  onNodesChange,
  workspaceId,
  isDirty,
  saveStatus,
  saveError,
  onSave,
}: FinCraftCanvasProps) {
  const isEmpty = nodes.length === 0;
  const isSaving = saveStatus === "saving";
  const canSave = Boolean(workspaceId && isDirty && !isSaving && onSave);

  return (
    <section aria-label="Infinite Craft Workspace" className="space-y-3">
      <CanvasHeader
        nodeCount={nodes.length}
        isDirty={isDirty}
        saveStatus={saveStatus}
        canSave={canSave}
        isSaving={isSaving}
        onSave={onSave}
      />
      {saveError && (
        <div role="alert" className="rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 p-3 text-xs text-[var(--color-text-danger)]">
          {saveError}
        </div>
      )}
      <div className="relative h-[400px] sm:h-[500px] w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] overflow-hidden">
        {isEmpty && <CanvasEmptyOverlay />}
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          fitView={!isEmpty}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          aria-label="Craft Workspace Diagram"
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls showInteractive={false} className="!bg-[var(--surface-resting)] !border-[var(--border-subtle)] !rounded-xl !shadow-[var(--shadow-resting)]" />
        </ReactFlow>
      </div>
    </section>
  );
}
