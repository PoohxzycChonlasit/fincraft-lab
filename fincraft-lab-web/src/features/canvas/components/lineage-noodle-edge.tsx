"use client";

import { BaseEdge, EdgeLabelRenderer, getBezierPath, Position, type EdgeProps } from "@xyflow/react";

export function LineageNoodleEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
  label,
  style,
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition: Position.Right,
    targetX,
    targetY,
    targetPosition: Position.Left,
  });

  const strokeColor = selected
    ? "var(--accent-orange)"
    : (style?.stroke as string | undefined) ?? "var(--border-strong)";
  const strokeWidth = selected ? 2.5 : 1.5;
  const opacity = selected ? 1 : 0.7;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth,
          opacity,
          transition: "stroke 150ms ease, opacity 150ms ease",
        }}
      />
      {selected && label ? (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "none",
            }}
            className="nodrag nopan surface-paper rounded-md border border-(--border-subtle) px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-xs animate-in fade-in duration-100"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
