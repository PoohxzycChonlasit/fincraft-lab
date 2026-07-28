import type { Edge } from "@xyflow/react";
import type { ElementCanvasNode } from "../types/canvas-node.type";

export function normalizeCanvasEdges(edges: Edge[] | undefined, nodes: ElementCanvasNode[]): Edge[] {
  if (!edges || edges.length === 0) return [];
  const nodeIds = new Set(nodes.map((n) => n.id));
  const seenIds = new Set<string>();
  const result: Edge[] = [];

  for (const edge of edges) {
    if (!edge || !edge.id || !edge.source || !edge.target) continue;
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) continue;
    if (seenIds.has(edge.id)) continue;
    seenIds.add(edge.id);

    result.push({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: "lineage-source",
      targetHandle: "lineage-target",
      label: edge.label || "Combines into",
      type: "lineage",
      style: edge.style || { stroke: "var(--color-craft-accent,#ea580c)", strokeWidth: 2 },
    });
  }

  return result;
}
