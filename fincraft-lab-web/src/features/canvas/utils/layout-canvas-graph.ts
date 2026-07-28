import type { Edge } from "@xyflow/react";
import type { ElementCanvasNode } from "../types/canvas-node.type";

const COLUMN_GAP = 280;
const ROW_GAP = 120;
const START_X = 360;
const START_Y = 60;
const DISCONNECTED_X = 60;
const DISCONNECTED_Y = 60;
const DISCONNECTED_ROW_GAP = 90;

type AdjacencyMap = Map<string, Set<string>>;

function buildGraphAdjacency(nodes: ElementCanvasNode[], edges: Edge[]): { incoming: AdjacencyMap; outgoing: AdjacencyMap } {
  const nodeSet = new Set(nodes.map((n) => n.id));
  const incoming: AdjacencyMap = new Map();
  const outgoing: AdjacencyMap = new Map();

  for (const n of nodes) {
    incoming.set(n.id, new Set());
    outgoing.set(n.id, new Set());
  }

  for (const e of edges) {
    if (!e || !e.source || !e.target || !nodeSet.has(e.source) || !nodeSet.has(e.target)) continue;
    outgoing.get(e.source)?.add(e.target);
    incoming.get(e.target)?.add(e.source);
  }

  return { incoming, outgoing };
}

function calculateNodeDepths(nodes: ElementCanvasNode[], incoming: AdjacencyMap): Map<string, number> {
  const depths = new Map<string, number>();
  const visited = new Set<string>();

  function getDepth(id: string): number {
    if (depths.has(id)) return depths.get(id)!;
    if (visited.has(id)) return 0;
    visited.add(id);

    const parents = incoming.get(id);
    if (!parents || parents.size === 0) {
      depths.set(id, 0);
      visited.delete(id);
      return 0;
    }

    let maxParentDepth = 0;
    for (const parentId of parents) {
      const pDepth = getDepth(parentId);
      if (pDepth > maxParentDepth) maxParentDepth = pDepth;
    }

    const currentDepth = maxParentDepth + 1;
    depths.set(id, currentDepth);
    visited.delete(id);
    return currentDepth;
  }

  for (const n of nodes) {
    getDepth(n.id);
  }

  return depths;
}

export function layoutCanvasGraph(nodes: ElementCanvasNode[], edges: Edge[]): ElementCanvasNode[] {
  if (!nodes || nodes.length === 0) return [];

  const { incoming, outgoing } = buildGraphAdjacency(nodes, edges);
  const depths = calculateNodeDepths(nodes, incoming);

  const columns = new Map<number, ElementCanvasNode[]>();
  const disconnected: ElementCanvasNode[] = [];

  for (const node of nodes) {
    const inc = incoming.get(node.id)?.size ?? 0;
    const out = outgoing.get(node.id)?.size ?? 0;

    if (inc === 0 && out === 0) {
      disconnected.push(node);
    } else {
      const d = depths.get(node.id) ?? 0;
      if (!columns.has(d)) columns.set(d, []);
      columns.get(d)!.push(node);
    }
  }

  disconnected.sort((a, b) => a.data.name.localeCompare(b.data.name) || a.id.localeCompare(b.id));

  const updatedMap = new Map<string, { x: number; y: number }>();

  for (let i = 0; i < disconnected.length; i++) {
    updatedMap.set(disconnected[i].id, {
      x: DISCONNECTED_X,
      y: DISCONNECTED_Y + i * DISCONNECTED_ROW_GAP,
    });
  }

  const sortedDepths = Array.from(columns.keys()).sort((a, b) => a - b);

  for (const depth of sortedDepths) {
    const colNodes = columns.get(depth)!;
    colNodes.sort((a, b) => a.data.name.localeCompare(b.data.name) || a.id.localeCompare(b.id));

    for (let rowIndex = 0; rowIndex < colNodes.length; rowIndex++) {
      const node = colNodes[rowIndex];
      updatedMap.set(node.id, {
        x: START_X + depth * COLUMN_GAP,
        y: START_Y + rowIndex * ROW_GAP,
      });
    }
  }

  return nodes.map((node) => {
    const newPos = updatedMap.get(node.id);
    if (!newPos) return node;
    return { ...node, position: newPos };
  });
}
