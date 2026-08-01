"use client";

import { useCallback, type Dispatch, type SetStateAction } from "react";
import type { Edge } from "@xyflow/react";
import type { CanvasElementInput, CanvasNodeValueData, ElementCanvasNode } from "../types/canvas-node.type";

const RESULT_NODE_OFFSET = { x: 190, y: 32 };
const NODE_SEPARATION_DISTANCE = 190;

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
  return nodes.map((node) => {
    if (!node.data.valueData?.isLatestDiscovery) return node;
    const valueData = { ...node.data.valueData };
    delete valueData.isLatestDiscovery;
    return patchData(node, { valueData });
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
      const next = current.map((node) => {
        const isTarget = node.id === id;
        if (Boolean(node.data.isCombineTarget) === isTarget) return node;
        changed = true;
        return patchData(node, { isCombineTarget: isTarget });
      });
      return changed ? next : current;
    });
  }, [setNodes]);

  const setCombiningState = useCallback((ids: string[], isCombining: boolean) => {
    setNodes((current) => current.map((node) => ids.includes(node.id) ? patchData(node, { isCombining, isCombineTarget: false }) : node));
  }, [setNodes]);

  const setSelectedForCombine = useCallback((selectedId: string | null) => {
    setNodes((current) => {
      let changed = false;
      const next = current.map((node) => {
        const isSelectedForCombine = node.id === selectedId;
        if (Boolean(node.data.isSelectedForCombine) === isSelectedForCombine) return node;
        changed = true;
        return patchData(node, { isSelectedForCombine });
      });
      return changed ? next : current;
    });
  }, [setNodes]);

  const clearInteractionState = useCallback(() => {
    setNodes((current) => {
      const hasFlags = current.some((node) => node.data.isCombineTarget || node.data.isCombining || node.data.isSelectedForCombine);
      if (!hasFlags) return current;
      return current.map((node) => patchData(node, { isCombineTarget: false, isCombining: false, isSelectedForCombine: false }));
    });
  }, [setNodes]);

  return { setCombineTarget, setCombiningState, setSelectedForCombine, clearInteractionState };
}

function useNodeRemoval(nodes: ElementCanvasNode[], setNodes: Dispatch<SetStateAction<ElementCanvasNode[]>>, setEdges: Dispatch<SetStateAction<Edge[]>>, setIsDirty: (value: boolean) => void) {
  return useCallback((nodeId: string) => {
    if (!nodes.some((node) => node.id === nodeId)) return;
    setNodes((current) => current
      .filter((node) => node.id !== nodeId)
      .map((node) => ({
        ...patchData(node, { isCombineTarget: false, isCombining: false, isSelectedForCombine: false }),
        selected: false,
      })));
    setEdges((current) => current.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setIsDirty(true);
  }, [nodes, setEdges, setIsDirty, setNodes]);
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
      const [firstEdge, secondEdge] = buildLineageEdges(sourceNodeId, targetNodeId, newNode.id);
      setEdges((current) => [...current, firstEdge, secondEdge]);
    }
    setIsDirty(true);
    return newNode.id;
  }, [nodes, setEdges, setIsDirty, setNodes]);

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
  }, [setIsDirty, setNodes]);

  return { addResultNode, recoverCombine };
}

export function useCanvasNodeMutations(
  nodes: ElementCanvasNode[],
  setNodes: Dispatch<SetStateAction<ElementCanvasNode[]>>,
  setEdges: Dispatch<SetStateAction<Edge[]>>,
  setIsDirty: (value: boolean) => void,
) {
  return {
    ...useNodeCreation(setNodes, setIsDirty),
    ...useNodeInteraction(setNodes),
    removeNode: useNodeRemoval(nodes, setNodes, setEdges, setIsDirty),
    ...useNodeCombineMutations(nodes, setNodes, setEdges, setIsDirty),
  };
}
