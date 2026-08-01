"use client";

import { useCallback, useMemo, useState } from "react";
import { useEdgesState, useNodesState, type Edge, type OnEdgesChange, type OnNodesChange } from "@xyflow/react";
import type { CanvasNodeValueData, ElementCanvasNode } from "../types/canvas-node.type";
import { useCanvasNodeMutations } from "./use-canvas-node-mutations";
import { normalizeCanvasEdges } from "../utils/normalize-canvas-edges";
import { layoutCanvasGraph } from "../utils/layout-canvas-graph";

export type InitialNodeInput = {
  id: string;
  elementId: string;
  positionX: number;
  positionY: number;
  valueData?: CanvasNodeValueData;
  name?: string;
  emoji?: string;
  categoryName?: string;
};

export type InitialEdgeInput = {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
};

export type SaveStatus = "idle" | "saving" | "saved" | "error";

function mapInitialNodes(inputs?: InitialNodeInput[] | null): ElementCanvasNode[] {
  if (!inputs || inputs.length === 0) return [];
  return inputs.map((node) => ({
    id: node.id,
    type: "elementNode",
    position: { x: node.positionX, y: node.positionY },
    data: { elementId: node.elementId, name: node.name ?? "Element", emoji: node.emoji ?? "Element", categoryName: node.categoryName ?? "CONCEPT", valueData: node.valueData ?? {} },
  }));
}

function mapInitialEdges(inputs?: InitialEdgeInput[] | null): Edge[] {
  if (!inputs || inputs.length === 0) return [];
  return inputs.map((e) => ({
    id: e.id,
    source: e.sourceNodeId,
    target: e.targetNodeId,
    sourceHandle: "lineage-source",
    targetHandle: "lineage-target",
    label: e.label || "Combines into",
    type: "lineage",
    style: { stroke: "var(--color-craft-accent,#ea580c)", strokeWidth: 2 },
  }));
}

export function useCanvasNodes(initialNodesInput?: InitialNodeInput[] | null, initialEdgesInput?: InitialEdgeInput[] | null) {
  const initialNodes = useMemo(() => mapInitialNodes(initialNodesInput), [initialNodesInput]);
  const initialEdges = useMemo(() => normalizeCanvasEdges(mapInitialEdges(initialEdgesInput), initialNodes), [initialEdgesInput, initialNodes]);

  const [nodes, setNodes, onNodesChangeBase] = useNodesState<ElementCanvasNode>(initialNodes);
  const [edges, setEdges, onEdgesChangeBase] = useEdgesState<Edge>(initialEdges);
  const [isDirty, setIsDirty] = useState(false);

  const mutations = useCanvasNodeMutations(nodes, setNodes, setEdges, setIsDirty);

  const onNodesChange: OnNodesChange<ElementCanvasNode> = useCallback((changes) => {
    onNodesChangeBase(changes);
    if (changes.some((c) => c.type === "remove" || c.type === "add")) setIsDirty(true);
  }, [onNodesChangeBase]);

  const onEdgesChange: OnEdgesChange<Edge> = useCallback((changes) => {
    onEdgesChangeBase(changes);
    if (changes.some((c) => c.type === "remove" || c.type === "add")) setIsDirty(true);
  }, [onEdgesChangeBase]);

  const markDragStopDirty = useCallback(() => setIsDirty(true), []);

  const tidyCanvasNodes = useCallback(() => {
    setNodes((currentNodes) => layoutCanvasGraph(currentNodes, edges));
    setIsDirty(true);
  }, [edges, setNodes]);

  const getPersistableNodes = useCallback(() => nodes.map((n) => ({
    id: n.id,
    elementId: n.data.elementId,
    positionX: Math.round(n.position.x),
    positionY: Math.round(n.position.y),
    valueData: n.data.valueData,
  })), [nodes]);

  const getPersistableEdges = useCallback(() => {
    return normalizeCanvasEdges(edges, nodes).map((e) => ({ id: e.id, sourceNodeId: e.source, targetNodeId: e.target, label: "" }));
  }, [edges, nodes]);

  const markSaved = useCallback(() => setIsDirty(false), []);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    markDragStopDirty,
    tidyCanvasNodes,
    ...mutations,
    isDirty,
    getPersistableNodes,
    getPersistableEdges,
    markSaved,
  };
}
