"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ElementCanvasNode } from "../types/canvas-node.type";

function getTypeColor(type?: string): string {
  switch (type?.toUpperCase()) {
    case "BASE":
      return "var(--accent-teal)";
    case "CONCEPT":
      return "var(--accent-orange)";
    case "RISK":
      return "var(--destructive)";
    case "TOOL":
      return "var(--accent-teal-strong)";
    case "BEHAVIOR":
      return "#7c3aed";
    case "DISCOVERY":
      return "var(--accent-orange)";
    default:
      return "var(--accent-orange)";
  }
}

function ElementCanvasNodeBase({ data, selected }: NodeProps<ElementCanvasNode>) {
  const isTarget = Boolean(data.isCombineTarget);
  const isCombining = Boolean(data.isCombining);
  const isTapSelected = Boolean(data.isSelectedForCombine);
  const typeColor = getTypeColor(data.categoryName);

  const borderStyle = isTarget
    ? "border-[var(--accent-orange)] ring-4 ring-[var(--accent-orange)]/30 scale-105 shadow-md"
    : isTapSelected
      ? "border-[var(--accent-teal)] ring-2 ring-[var(--accent-teal)]"
      : selected
        ? "border-[var(--border-strong)] ring-2 ring-[var(--focus-ring)]"
        : "border-[var(--border-subtle)]";

  return (
    <article
      aria-label={`Canvas element: ${data.name}${isTarget ? " (Combine Target)" : ""}`}
      className={`relative w-[190px] rounded-xl border text-left surface-solid shadow-xs transition-all duration-150 overflow-visible ${borderStyle} ${
        isCombining ? "opacity-70 pointer-events-none" : ""
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="lineage-target"
        aria-label="Input port"
        className="!h-3 !w-3 !-left-1.5 !border-2 !border-[var(--surface-solid)] !bg-[var(--accent-teal)] transition-transform hover:scale-125"
      />

      <div className="rounded-t-lg px-2.5 py-1 border-b border-[var(--border-subtle)] bg-[var(--surface-paper)] flex items-center justify-between gap-1">
        <span className="text-[9px] font-extrabold uppercase tracking-wider truncate" style={{ color: typeColor }}>
          {data.categoryName || "ELEMENT"}
        </span>
        {isTarget ? <span className="text-[8px] font-bold uppercase text-[var(--accent-orange)]">Target</span> : null}
      </div>

      <div className="p-2.5 flex items-start gap-2 min-h-[44px]">
        <span className="surface-paper flex size-7 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-sm leading-none">
          {data.emoji || "Element"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold leading-snug text-foreground line-clamp-2">{data.name}</p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="lineage-source"
        aria-label="Output port"
        className="!h-3 !w-3 !-right-1.5 !border-2 !border-[var(--surface-solid)] !bg-[var(--accent-orange)] transition-transform hover:scale-125"
      />
    </article>
  );
}

export const ElementCanvasNodeComponent = memo(ElementCanvasNodeBase, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.selected === next.selected &&
    prev.dragging === next.dragging &&
    prev.data.elementId === next.data.elementId &&
    prev.data.name === next.data.name &&
    prev.data.emoji === next.data.emoji &&
    prev.data.categoryName === next.data.categoryName &&
    prev.data.isCombineTarget === next.data.isCombineTarget &&
    prev.data.isCombining === next.data.isCombining &&
    prev.data.isSelectedForCombine === next.data.isSelectedForCombine
  );
});
