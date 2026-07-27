"use client";

import { useCallback, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  BackgroundVariant,
  useReactFlow,
  type OnNodesChange,
  type OnNodeDrag,
} from "@xyflow/react";
import type { SaveStatus } from "../hooks/use-canvas-nodes";
import type { CanvasElementInput, ElementCanvasNode } from "../types/canvas-node.type";
import { ElementCanvasNodeComponent } from "./element-canvas-node";

const nodeTypes = {
  elementNode: ElementCanvasNodeComponent,
};

type FinCraftCanvasProps = {
  nodes: ElementCanvasNode[];
  onNodesChange: OnNodesChange<ElementCanvasNode>;
  onDropLibraryElement: (element: CanvasElementInput, position: { x: number; y: number }) => void;
  onTargetHighlight: (targetId: string | null) => void;
  onCombineNodes: (sourceNode: ElementCanvasNode, targetNode: ElementCanvasNode, midpoint: { x: number; y: number }) => void;
  onNodeTap: (node: ElementCanvasNode) => void;
  onClearTapSelection: () => void;
  workspaceId?: string;
  isDirty?: boolean;
  saveStatus?: SaveStatus;
  saveError?: string | null;
  onSave?: () => void;
};

function findCollisionTarget(draggedNode: ElementCanvasNode, nodes: ElementCanvasNode[]): ElementCanvasNode | null {
  const dragX = draggedNode.position.x;
  const dragY = draggedNode.position.y;
  const dragW = 160;
  const dragH = 70;

  for (const n of nodes) {
    if (n.id === draggedNode.id) continue;
    const nx = n.position.x;
    const ny = n.position.y;
    const nw = 160;
    const nh = 70;

    const overlapX = Math.max(0, Math.min(dragX + dragW, nx + nw) - Math.max(dragX, nx));
    const overlapY = Math.max(0, Math.min(dragY + dragH, ny + nh) - Math.max(dragY, ny));
    if (overlapX * overlapY > 1200) return n;
  }
  return null;
}

function CanvasEmptyOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
      <div className="surface-floating max-w-sm rounded-2xl border border-[var(--border-subtle)] p-5 space-y-2">
        <p className="text-sm font-semibold text-foreground">Infinite Craft Workspace</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Drag elements from the Library onto the canvas. Drag one element onto another to combine and discover financial concepts!
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
  if (saveStatus === "error") return <span className="text-xs font-semibold text-[var(--color-text-danger)]">Save error</span>;
  if (isDirty) return <span className="text-xs font-semibold text-[var(--color-craft-accent)]">Unsaved changes</span>;
  if (saveStatus === "saved") return <span className="text-xs font-semibold text-[var(--primitive-teal-700)]">Saved</span>;
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

type CanvasInnerProps = Omit<FinCraftCanvasProps, "workspaceId" | "isDirty" | "saveStatus" | "saveError" | "onSave">;

function useCanvasDragHandlers({ nodes, onDropLibraryElement, onTargetHighlight, onCombineNodes }: CanvasInnerProps) {
  const { screenToFlowPosition } = useReactFlow();
  const currentTargetRef = useRef<ElementCanvasNode | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const rawData = e.dataTransfer.getData("application/fincraft-element");
      if (!rawData) return;
      try {
        const el = JSON.parse(rawData) as CanvasElementInput;
        onDropLibraryElement(el, screenToFlowPosition({ x: e.clientX, y: e.clientY }));
      } catch { /* ignore */ }
    },
    [screenToFlowPosition, onDropLibraryElement],
  );

  const handleNodeDrag = useCallback<OnNodeDrag<ElementCanvasNode>>(
    (_, draggedNode) => {
      const target = findCollisionTarget(draggedNode, nodes);
      if (target?.id !== currentTargetRef.current?.id) {
        currentTargetRef.current = target;
        onTargetHighlight(target ? target.id : null);
      }
    },
    [nodes, onTargetHighlight],
  );

  const handleNodeDragStop = useCallback<OnNodeDrag<ElementCanvasNode>>(
    (_, draggedNode) => {
      const target = currentTargetRef.current;
      currentTargetRef.current = null;
      onTargetHighlight(null);
      if (target) {
        onCombineNodes(draggedNode, target, {
          x: (draggedNode.position.x + target.position.x) / 2,
          y: (draggedNode.position.y + target.position.y) / 2,
        });
      }
    },
    [onTargetHighlight, onCombineNodes],
  );

  return { handleDragOver, handleDrop, handleNodeDrag, handleNodeDragStop };
}

function ReactFlowCanvasInner(props: CanvasInnerProps) {
  const { nodes, onNodesChange, onNodeTap, onClearTapSelection } = props;
  const { handleDragOver, handleDrop, handleNodeDrag, handleNodeDragStop } = useCanvasDragHandlers(props);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: ElementCanvasNode) => onNodeTap(node),
    [onNodeTap],
  );

  return (
    <div className="relative h-[400px] sm:h-[500px] w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] overflow-hidden" onDragOver={handleDragOver} onDrop={handleDrop}>
      {nodes.length === 0 && <CanvasEmptyOverlay />}
      <ReactFlow
        nodes={nodes} onNodesChange={onNodesChange}
        onNodeDrag={handleNodeDrag} onNodeDragStop={handleNodeDragStop}
        onNodeClick={handleNodeClick} onPaneClick={onClearTapSelection}
        nodeTypes={nodeTypes} fitView={nodes.length > 0}
        minZoom={0.2} maxZoom={2}
        proOptions={{ hideAttribution: true }} aria-label="Craft Workspace Diagram"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls showInteractive={false} className="!bg-[var(--surface-resting)] !border-[var(--border-subtle)] !rounded-xl !shadow-[var(--shadow-resting)]" />
      </ReactFlow>
    </div>
  );
}

export function FinCraftCanvas(props: FinCraftCanvasProps) {
  const { nodes, isDirty, saveStatus, saveError, onSave, workspaceId } = props;
  const isSaving = saveStatus === "saving";
  const canSave = Boolean(workspaceId && isDirty && !isSaving && onSave);

  return (
    <section aria-label="Infinite Craft Workspace" className="space-y-3">
      <CanvasHeader nodeCount={nodes.length} isDirty={isDirty} saveStatus={saveStatus} canSave={canSave} isSaving={isSaving} onSave={onSave} />
      {saveError && (
        <div role="alert" className="rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 p-3 text-xs text-[var(--color-text-danger)]">
          {saveError}
        </div>
      )}
      <ReactFlowProvider>
        <ReactFlowCanvasInner {...props} />
      </ReactFlowProvider>
    </section>
  );
}
