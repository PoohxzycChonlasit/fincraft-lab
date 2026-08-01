"use client";

import type { DragEventHandler, KeyboardEventHandler, MouseEvent, RefObject } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  ReactFlow,
  type Edge,
  type OnEdgesChange,
  type OnNodeDrag,
  type OnNodesChange,
} from "@xyflow/react";
import { Trash2, Wand2 } from "lucide-react";
import type { ElementCanvasNode } from "../types/canvas-node.type";
import { CanvasNodeRemovalDialog } from "./canvas-node-removal-dialog";
import { ElementCanvasNodeComponent } from "./element-canvas-node";
import { LineageNoodleEdge } from "./lineage-noodle-edge";

const nodeTypes = { elementNode: ElementCanvasNodeComponent };
const edgeTypes = { lineage: LineageNoodleEdge };

type CanvasFlowSurfaceProps = {
  frameRef: RefObject<HTMLDivElement | null>;
  nodes: ElementCanvasNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<ElementCanvasNode>;
  onEdgesChange?: OnEdgesChange<Edge>;
  onNodeDrag: OnNodeDrag<ElementCanvasNode>;
  onNodeDragStop: OnNodeDrag<ElementCanvasNode>;
  onNodeClick: (event: MouseEvent, node: ElementCanvasNode) => void;
  onPaneClick: () => void;
  onDragOver: DragEventHandler<HTMLDivElement>;
  onDrop: DragEventHandler<HTMLDivElement>;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
  onTidyCanvas?: () => void;
  onTidyClick: () => void;
  canTidy: boolean;
  selectedNode: ElementCanvasNode | null;
  isActionBusy: boolean;
  isRemovalProcessing: boolean;
  removeTriggerRef: RefObject<HTMLButtonElement | null>;
  onRemoveRequest: () => void;
  removalDialogOpen: boolean;
  onRemovalDialogOpenChange: (open: boolean) => void;
  onConfirmRemove: () => void;
  incidentEdgeCount: number;
};

function CanvasEmptyOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
      <div className="surface-floating max-w-sm space-y-1.5 rounded-2xl border border-[var(--border-subtle)] p-5 shadow-xs">
        <p className="text-sm font-semibold text-foreground">Drag an element here to begin.</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Select or drag elements from the Element Library onto this infinite workspace.
        </p>
      </div>
    </div>
  );
}

function CanvasActionPanel({ onTidyCanvas, onTidyClick, canTidy, nodes, selectedNode, isActionBusy, removeTriggerRef, onRemoveRequest }: Pick<CanvasFlowSurfaceProps, "onTidyCanvas" | "onTidyClick" | "canTidy" | "nodes" | "selectedNode" | "isActionBusy" | "removeTriggerRef" | "onRemoveRequest">) {
  return (
    <Panel position="top-right" className="!m-2 flex items-center gap-2">
      {onTidyCanvas ? (
        <button
          type="button"
          onClick={onTidyClick}
          disabled={!canTidy}
          aria-label="Arrange connected elements and fit them into view"
          title={nodes.length <= 1 ? "Add at least two elements before arranging the Canvas" : "Arrange connected elements and fit them into view"}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-resting)] px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs transition-colors hover:bg-[var(--surface-inset)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Wand2 size={13} className="text-[var(--color-craft-accent)]" aria-hidden="true" />
          <span>Tidy Canvas</span>
        </button>
      ) : null}
      <button
        ref={removeTriggerRef}
        type="button"
        onClick={onRemoveRequest}
        disabled={!selectedNode || isActionBusy}
        aria-label={selectedNode ? `Remove ${selectedNode.data.name} from this Canvas` : "Remove selected Node"}
        title={selectedNode ? `Remove ${selectedNode.data.name} from this Canvas` : "Select a Node to remove it"}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-[var(--border-destructive)] bg-[var(--surface-resting)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-danger)] shadow-xs transition-colors hover:bg-[var(--surface-inset)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 size={13} aria-hidden="true" />
        <span>Remove Node</span>
      </button>
    </Panel>
  );
}

export function CanvasFlowSurface(props: CanvasFlowSurfaceProps) {
  const {
    frameRef, nodes, edges, onNodesChange, onEdgesChange, onNodeDrag, onNodeDragStop, onNodeClick, onPaneClick, onDragOver, onDrop, onKeyDown,
    onTidyCanvas, onTidyClick, canTidy, selectedNode, isActionBusy, removeTriggerRef, onRemoveRequest, removalDialogOpen, onRemovalDialogOpenChange, onConfirmRemove, incidentEdgeCount, isRemovalProcessing,
  } = props;
  return (
    <div ref={frameRef} tabIndex={0} aria-label="Canvas keyboard controls" onKeyDown={onKeyDown} className="lab-canvas-frame relative flex h-full min-h-0 min-w-0 w-full flex-1 basis-0 flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" onDragOver={onDragOver} onDrop={onDrop}>
      {nodes.length === 0 ? <CanvasEmptyOverlay /> : null}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {selectedNode ? `Selected canvas element: ${selectedNode.data.name}. Delete or Backspace removes it from this Canvas.` : "No canvas element selected."}
      </p>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        deleteKeyCode={null}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={nodes.length > 0}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        aria-label="Craft Workspace Diagram"
        style={{ width: "100%", height: "100%" }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls showInteractive={false} className="!rounded-xl !border-[var(--border-subtle)] !bg-[var(--surface-resting)] !shadow-[var(--shadow-resting)]" />
        <CanvasActionPanel
          onTidyCanvas={onTidyCanvas}
          onTidyClick={onTidyClick}
          canTidy={canTidy}
          nodes={nodes}
          selectedNode={selectedNode}
          isActionBusy={isActionBusy}
          removeTriggerRef={removeTriggerRef}
          onRemoveRequest={onRemoveRequest}
        />
      </ReactFlow>
      <CanvasNodeRemovalDialog node={selectedNode} incidentEdgeCount={incidentEdgeCount} open={removalDialogOpen} onOpenChange={onRemovalDialogOpenChange} onConfirm={onConfirmRemove} isProcessing={isRemovalProcessing} removeTriggerRef={removeTriggerRef} frameRef={frameRef} />
    </div>
  );
}
