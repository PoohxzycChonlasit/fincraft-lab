"use client";

import { useCallback, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  BackgroundVariant,
  useReactFlow,
  type OnNodeDrag,
  type OnNodesChange,
} from "@xyflow/react";
import type { SaveStatus } from "../hooks/use-canvas-nodes";
import type { CanvasElementInput, ElementCanvasNode } from "../types/canvas-node.type";
import { ElementCanvasNodeComponent } from "./element-canvas-node";

const nodeTypes = { elementNode: ElementCanvasNodeComponent };
const NODE_WIDTH = 160;
const NODE_HEIGHT = 70;
const COLLISION_THRESHOLD = 1200;

type FinCraftCanvasProps = {
  nodes: ElementCanvasNode[];
  onNodesChange: OnNodesChange<ElementCanvasNode>;
  onDropLibraryElement: (element: CanvasElementInput, position: { x: number; y: number }) => void;
  onTargetHighlight: (targetId: string | null) => void;
  onCombineNodes: (sourceNode: ElementCanvasNode, targetNode: ElementCanvasNode, collisionPosition: { x: number; y: number }) => void;
  onNodeTap: (node: ElementCanvasNode) => void;
  onClearTapSelection: () => void;
  workspaceId?: string;
  isDirty?: boolean;
  saveStatus?: SaveStatus;
  saveError?: string | null;
  onSave?: () => void;
};

function overlapArea(first: ElementCanvasNode, second: ElementCanvasNode): number {
  const overlapX = Math.max(0, Math.min(first.position.x + NODE_WIDTH, second.position.x + NODE_WIDTH) - Math.max(first.position.x, second.position.x));
  const overlapY = Math.max(0, Math.min(first.position.y + NODE_HEIGHT, second.position.y + NODE_HEIGHT) - Math.max(first.position.y, second.position.y));
  return overlapX * overlapY;
}

function findCollisionTarget(draggedNode: ElementCanvasNode, nodes: ElementCanvasNode[]): ElementCanvasNode | null {
  let bestTarget: ElementCanvasNode | null = null;
  let bestArea = COLLISION_THRESHOLD;
  for (const candidate of nodes) {
    if (candidate.id === draggedNode.id) continue;
    const area = overlapArea(draggedNode, candidate);
    if (area > bestArea || (area === bestArea && area > COLLISION_THRESHOLD && candidate.id < (bestTarget?.id ?? "~"))) {
      bestTarget = candidate;
      bestArea = area;
    }
  }
  return bestTarget;
}

function isCanvasElementInput(value: unknown): value is CanvasElementInput {
  if (typeof value !== "object" || value === null) return false;
  if (!("id" in value) || !("name" in value)) return false;
  if (typeof value.id !== "string" || typeof value.name !== "string") return false;
  return (!("emoji" in value) || value.emoji === undefined || typeof value.emoji === "string")
    && (!("categoryName" in value) || value.categoryName === undefined || typeof value.categoryName === "string");
}

function CanvasEmptyOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
      <div className="surface-floating max-w-sm space-y-2 rounded-2xl border border-[var(--border-subtle)] p-5">
        <p className="text-sm font-semibold text-foreground">Infinite Craft Workspace</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Drag elements from the Library onto the canvas. Drag one element onto another to combine and discover financial concepts.
        </p>
      </div>
    </div>
  );
}

function SaveStatusIndicator({ isDirty, saveStatus }: { isDirty?: boolean; saveStatus?: SaveStatus }) {
  if (saveStatus === "saving") return <span className="text-xs font-semibold text-[var(--color-craft-accent)]">Saving...</span>;
  if (saveStatus === "error") return <span className="text-xs font-semibold text-[var(--color-text-danger)]">Save error</span>;
  if (isDirty) return <span className="text-xs font-semibold text-[var(--color-craft-accent)]">Unsaved changes</span>;
  if (saveStatus === "saved") return <span className="text-xs font-semibold text-[var(--primitive-teal-700)]">Saved</span>;
  return null;
}

function CanvasHeader({ nodeCount, isDirty, saveStatus, canSave, isSaving, onSave }: {
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
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Infinite Craft Workspace ({nodeCount})</h2>
        <SaveStatusIndicator isDirty={isDirty} saveStatus={saveStatus} />
      </div>
      {onSave ? (
        <button type="button" onClick={onSave} disabled={!canSave} aria-label="Save workspace" className="min-h-[44px] rounded-xl border border-[var(--border-subtle)] bg-[var(--color-action-primary)] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-action-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50">
          {isSaving ? "Saving..." : "Save workspace"}
        </button>
      ) : null}
    </div>
  );
}

type CanvasInnerProps = Omit<FinCraftCanvasProps, "workspaceId" | "isDirty" | "saveStatus" | "saveError" | "onSave">;

function useCanvasDragHandlers({ nodes, onDropLibraryElement, onTargetHighlight, onCombineNodes }: CanvasInnerProps) {
  const { screenToFlowPosition } = useReactFlow();
  const currentTargetRef = useRef<ElementCanvasNode | null>(null);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const rawData = event.dataTransfer.getData("application/fincraft-element");
    if (!rawData) return;
    try {
      const parsed: unknown = JSON.parse(rawData);
      if (isCanvasElementInput(parsed)) {
        onDropLibraryElement(parsed, screenToFlowPosition({ x: event.clientX, y: event.clientY }));
      }
    } catch {
      return;
    }
  }, [screenToFlowPosition, onDropLibraryElement]);

  const handleNodeDrag = useCallback<OnNodeDrag<ElementCanvasNode>>((_, draggedNode) => {
    const target = findCollisionTarget(draggedNode, nodes);
    if (target?.id === currentTargetRef.current?.id) return;
    currentTargetRef.current = target;
    onTargetHighlight(target?.id ?? null);
  }, [nodes, onTargetHighlight]);

  const handleNodeDragStop = useCallback<OnNodeDrag<ElementCanvasNode>>((_, draggedNode) => {
    const target = currentTargetRef.current;
    currentTargetRef.current = null;
    onTargetHighlight(null);
    if (!target) return;
    onCombineNodes(draggedNode, target, {
      x: (draggedNode.position.x + target.position.x) / 2,
      y: (draggedNode.position.y + target.position.y) / 2,
    });
  }, [onTargetHighlight, onCombineNodes]);

  return { handleDragOver, handleDrop, handleNodeDrag, handleNodeDragStop };
}

function ReactFlowCanvasInner(props: CanvasInnerProps) {
  const { nodes, onNodesChange, onNodeTap, onClearTapSelection } = props;
  const { handleDragOver, handleDrop, handleNodeDrag, handleNodeDragStop } = useCanvasDragHandlers(props);
  const handleNodeClick = useCallback((_: React.MouseEvent, node: ElementCanvasNode) => onNodeTap(node), [onNodeTap]);

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] sm:h-[500px]" onDragOver={handleDragOver} onDrop={handleDrop}>
      {nodes.length === 0 ? <CanvasEmptyOverlay /> : null}
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        onNodeDrag={handleNodeDrag}
        onNodeDragStop={handleNodeDragStop}
        onNodeClick={handleNodeClick}
        onPaneClick={onClearTapSelection}
        nodeTypes={nodeTypes}
        fitView={nodes.length > 0}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        aria-label="Craft Workspace Diagram"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls showInteractive={false} className="!rounded-xl !border-[var(--border-subtle)] !bg-[var(--surface-resting)] !shadow-[var(--shadow-resting)]" />
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
      {saveError ? <div role="alert" className="rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 p-3 text-xs text-[var(--color-text-danger)]">{saveError}</div> : null}
      <ReactFlowProvider>
        <ReactFlowCanvasInner {...props} />
      </ReactFlowProvider>
    </section>
  );
}
