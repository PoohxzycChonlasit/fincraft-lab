"use client";

import { useCallback, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useEdgesState, useNodesState, type Edge, type OnEdgesChange, type OnNodesChange } from "@xyflow/react";
import type { ElementCanvasNode, CanvasElementInput, CanvasNodeValueData } from "../types/canvas-node.type";
import { normalizeCanvasEdges } from "../utils/normalize-canvas-edges";

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

const RESULT_NODE_OFFSET = { x: 190, y: 32 };
const NODE_SEPARATION_DISTANCE = 190;

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

function buildNode(element: CanvasElementInput, position: { x: number; y: number }, valueData?: CanvasNodeValueData): ElementCanvasNode {
  return {
    id: crypto.randomUUID(),
    type: "elementNode",
    position: { x: Math.round(position.x), y: Math.round(position.y) },
    data: { elementId: element.id, name: element.name, emoji: element.emoji || "Element", categoryName: element.categoryName || "CONCEPT", valueData: valueData ?? {} },
  };
}

function buildLineageEdges(sourceNodeId: string, targetNodeId: string, resultNodeId: string): [Edge, Edge] {
  return [
    { id: crypto.randomUUID(), source: sourceNodeId, target: resultNodeId, sourceHandle: "lineage-source", targetHandle: "lineage-target", label: "Combines into", type: "lineage", style: { stroke: "var(--color-craft-accent,#ea580c)", strokeWidth: 2 } },
    { id: crypto.randomUUID(), source: targetNodeId, target: resultNodeId, sourceHandle: "lineage-source", targetHandle: "lineage-target", label: "Combines into", type: "lineage", style: { stroke: "var(--color-action-primary,#0f766e)", strokeWidth: 2 } },
  ];
}

function patchData(node: ElementCanvasNode, patch: Partial<ElementCanvasNode["data"]>): ElementCanvasNode {
  return { ...node, data: { ...node.data, ...patch } };
}

function clearLatestDiscoveryFlag(nodes: ElementCanvasNode[]): ElementCanvasNode[] {
  return nodes.map((n) => {
    if (!n.data.valueData?.isLatestDiscovery) return n;
    const copy = { ...n.data.valueData };
    delete copy.isLatestDiscovery;
    return patchData(n, { valueData: copy });
  });
}

function useNodeCreation(setNodes: Dispatch<SetStateAction<ElementCanvasNode[]>>, setIsDirty: (value: boolean) => void) {
  const addNodeAtPosition = useCallback((element: CanvasElementInput, position: { x: number; y: number }) => {
    setNodes((current) => [...current, buildNode(element, position)]);
    setIsDirty(true);
  }, [setNodes, setIsDirty]);

  const addElementsToCanvas = useCallback((elements: CanvasElementInput[]) => {
    setNodes((current) => {
      const next = [...current];
      for (const element of elements) {
        if (next.some((node) => node.data.elementId === element.id)) continue;
        next.push(buildNode(element, { x: 60 + (next.length % 3) * 180, y: 60 + Math.floor(next.length / 3) * 110 }));
      }
      return next;
    });
    setIsDirty(true);
  }, [setNodes, setIsDirty]);

  return { addNodeAtPosition, addElementsToCanvas };
}

function useNodeInteraction(setNodes: Dispatch<SetStateAction<ElementCanvasNode[]>>) {
  const setCombineTarget = useCallback((id: string | null) => {
    setNodes((current) => {
      let changed = false;
      const next = current.map((n) => {
        const isTarget = n.id === id;
        if (Boolean(n.data.isCombineTarget) === isTarget) return n;
        changed = true;
        return patchData(n, { isCombineTarget: isTarget });
      });
      return changed ? next : current;
    });
  }, [setNodes]);

  const setCombiningState = useCallback((ids: string[], isCombining: boolean) => {
    setNodes((current) => current.map((n) => ids.includes(n.id) ? patchData(n, { isCombining, isCombineTarget: false }) : n));
  }, [setNodes]);

  const setSelectedForCombine = useCallback((selectedId: string | null) => {
    setNodes((current) => {
      let changed = false;
      const next = current.map((n) => {
        const isSel = n.id === selectedId;
        if (Boolean(n.data.isSelectedForCombine) === isSel) return n;
        changed = true;
        return patchData(n, { isSelectedForCombine: isSel });
      });
      return changed ? next : current;
    });
  }, [setNodes]);

  const clearInteractionState = useCallback(() => {
    setNodes((current) => {
      const hasFlags = current.some((n) => n.data.isCombineTarget || n.data.isCombining || n.data.isSelectedForCombine);
      if (!hasFlags) return current;
      return current.map((n) => patchData(n, { isCombineTarget: false, isCombining: false, isSelectedForCombine: false }));
    });
  }, [setNodes]);

  return { setCombineTarget, setCombiningState, setSelectedForCombine, clearInteractionState };
}

function useNodeCombineMutations(
  nodes: ElementCanvasNode[],
  setNodes: Dispatch<SetStateAction<ElementCanvasNode[]>>,
  setEdges: Dispatch<SetStateAction<Edge[]>>,
  setIsDirty: (value: boolean) => void,
) {
  const addResultNode = useCallback((element: CanvasElementInput, collisionPosition: { x: number; y: number }, sourceNodeId?: string, targetNodeId?: string) => {
    const existing = nodes.find((node) => node.data.elementId === element.id);
    if (existing) return existing.id;
    const newNode = buildNode(element, { x: collisionPosition.x + RESULT_NODE_OFFSET.x, y: collisionPosition.y + RESULT_NODE_OFFSET.y }, { isLatestDiscovery: true, timestamp: Date.now() });
    setNodes((current) => [...clearLatestDiscoveryFlag(current), newNode]);
    if (sourceNodeId && targetNodeId) {
      const [e1, e2] = buildLineageEdges(sourceNodeId, targetNodeId, newNode.id);
      setEdges((currEdges) => {
        const set = new Set(currEdges.map((e) => e.id));
        const next = [...currEdges];
        if (!set.has(e1.id)) next.push(e1);
        if (!set.has(e2.id)) next.push(e2);
        return next;
      });
    }
    setIsDirty(true);
    return newNode.id;
  }, [nodes, setNodes, setEdges, setIsDirty]);

  const recoverCombine = useCallback((sourceNodeId: string, targetNodeId: string) => {
    setNodes((current) => {
      const source = current.find((node) => node.id === sourceNodeId);
      const target = current.find((node) => node.id === targetNodeId);
      if (!source || !target) return current;
      const dx = source.position.x - target.position.x;
      const dy = source.position.y - target.position.y;
      const distance = Math.hypot(dx, dy);
      const offset = distance === 0 ? { x: NODE_SEPARATION_DISTANCE, y: 24 } : { x: (dx / distance) * NODE_SEPARATION_DISTANCE, y: (dy / distance) * NODE_SEPARATION_DISTANCE };
      return current.map((node) => node.id === sourceNodeId ? { ...node, position: { x: source.position.x + offset.x, y: source.position.y + offset.y } } : node);
    });
    setIsDirty(true);
  }, [setNodes, setIsDirty]);

  return { addResultNode, recoverCombine };
}

export function useCanvasNodes(initialNodesInput?: InitialNodeInput[] | null, initialEdgesInput?: InitialEdgeInput[] | null) {
  const initialNodes = useMemo(() => mapInitialNodes(initialNodesInput), [initialNodesInput]);
  const initialEdges = useMemo(() => normalizeCanvasEdges(mapInitialEdges(initialEdgesInput), initialNodes), [initialEdgesInput, initialNodes]);

  const [nodes, setNodes, onNodesChangeBase] = useNodesState<ElementCanvasNode>(initialNodes);
  const [edges, setEdges, onEdgesChangeBase] = useEdgesState<Edge>(initialEdges);
  const [isDirty, setIsDirty] = useState(false);

  const creation = useNodeCreation(setNodes, setIsDirty);
  const interaction = useNodeInteraction(setNodes);
  const combine = useNodeCombineMutations(nodes, setNodes, setEdges, setIsDirty);

  const onNodesChange: OnNodesChange<ElementCanvasNode> = useCallback((changes) => {
    onNodesChangeBase(changes);
    if (changes.some((c) => c.type === "remove" || c.type === "add")) setIsDirty(true);
  }, [onNodesChangeBase]);

  const onEdgesChange: OnEdgesChange<Edge> = useCallback((changes) => {
    onEdgesChangeBase(changes);
    if (changes.some((c) => c.type === "remove" || c.type === "add")) setIsDirty(true);
  }, [onEdgesChangeBase]);

  const markDragStopDirty = useCallback(() => setIsDirty(true), []);

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
    ...creation,
    ...interaction,
    ...combine,
    isDirty,
    getPersistableNodes,
    getPersistableEdges,
    markSaved,
  };
}
