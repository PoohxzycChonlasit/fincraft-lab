"use client";

import type { NodeProps } from "@xyflow/react";
import type { ElementCanvasNode } from "../types/canvas-node.type";

export function ElementCanvasNodeComponent({ data, selected }: NodeProps<ElementCanvasNode>) {
  return (
    <article
      aria-label={`Canvas specimen: ${data.name}`}
      className={`min-w-[140px] max-w-[200px] rounded-xl p-3 border text-left transition-colors surface-resting ${
        selected ? "border-[var(--border-selected)] ring-2 ring-[var(--ring)]" : "border-[var(--border-subtle)]"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg leading-none" aria-hidden="true">
          {data.emoji || "📄"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-foreground truncate">{data.name}</p>
          <p className="text-[10px] font-semibold text-[var(--color-craft-accent)] truncate">
            {data.categoryName}
          </p>
        </div>
      </div>
    </article>
  );
}
