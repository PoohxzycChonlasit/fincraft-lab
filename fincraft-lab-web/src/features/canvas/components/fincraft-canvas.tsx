"use client";

import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  type OnNodesChange,
} from "@xyflow/react";
import type { ElementCanvasNode } from "../types/canvas-node.type";
import { ElementCanvasNodeComponent } from "./element-canvas-node";

const nodeTypes = {
  elementNode: ElementCanvasNodeComponent,
};

type FinCraftCanvasProps = {
  nodes: ElementCanvasNode[];
  onNodesChange: OnNodesChange<ElementCanvasNode>;
};

function CanvasEmptyOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
      <div className="surface-floating max-w-sm rounded-2xl border border-[var(--border-subtle)] p-5 space-y-2">
        <p className="text-sm font-semibold text-foreground">
          Infinite Craft Workspace
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your canvas is currently empty. Select elements in the Craft Bay and click &quot;Place selected on canvas&quot; to inspect them here.
        </p>
      </div>
    </div>
  );
}

export function FinCraftCanvas({ nodes, onNodesChange }: FinCraftCanvasProps) {
  const isEmpty = nodes.length === 0;

  return (
    <section
      aria-label="Infinite Craft Workspace"
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Infinite Craft Workspace ({nodes.length})
        </h2>
        <span className="text-[11px] text-muted-foreground">
          Pan, zoom & drag nodes freely
        </span>
      </div>

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
