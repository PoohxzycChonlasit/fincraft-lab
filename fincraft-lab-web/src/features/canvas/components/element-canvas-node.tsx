"use client";

import type { NodeProps } from "@xyflow/react";
import type { ElementCanvasNode } from "../types/canvas-node.type";

export function ElementCanvasNodeComponent({ data, selected }: NodeProps<ElementCanvasNode>) {
  const isTarget = Boolean(data.isCombineTarget);
  const isCombining = Boolean(data.isCombining);
  const isTapSelected = Boolean(data.isSelectedForCombine);

  const borderStyle = isTarget
    ? "border-[var(--color-craft-accent)] ring-4 ring-[var(--color-craft-accent)]/30 scale-105 shadow-lg"
    : isTapSelected
    ? "border-[var(--color-action-primary)] ring-2 ring-[var(--color-action-primary)]"
    : selected
    ? "border-[var(--border-selected)] ring-2 ring-[var(--ring)]"
    : "border-[var(--border-subtle)]";

  return (
    <article
      aria-label={`Canvas specimen: ${data.name}${isTarget ? " (Combine Target)" : ""}`}
      className={`min-w-[140px] max-w-[200px] rounded-xl p-3 border text-left transition-all duration-150 surface-resting relative ${borderStyle} ${
        isCombining ? "opacity-70 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg leading-none" aria-hidden="true">
          {data.emoji || "Element"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-foreground truncate">{data.name}</p>
          <p className="text-[10px] font-semibold text-[var(--color-craft-accent)] truncate">
            {isCombining ? "Combining..." : isTarget ? "Drop to Combine" : data.categoryName}
          </p>
        </div>
      </div>
    </article>
  );
}
