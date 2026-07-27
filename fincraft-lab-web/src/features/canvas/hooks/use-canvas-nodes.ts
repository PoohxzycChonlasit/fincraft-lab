"use client";

import { useCallback, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useNodesState, type OnNodesChange } from "@xyflow/react";
import type { ElementCanvasNode, CanvasElementInput, PersistableCanvasNode } from "../types/canvas-node.type";

export type InitialNodeInput = {
  id: string;
  elementId: string;
  positionX: number;
  positionY: number;
  name?: string;
  emoji?: string;
  categoryName?: string;
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
    data: {
      elementId: node.elementId,
      name: node.name ?? "Element",
      emoji: node.emoji ?? "Element",
      categoryName: node.categoryName ?? "CONCEPT",
    },
  }));
}

function buildNode(element: CanvasElementInput, position: { x: number; y: number }): ElementCanvasNode {
  return {
    id: crypto.randomUUID(),
    type: "elementNode",
    position: { x: Math.round(position.x), y: Math.round(position.y) },
    data: {
      elementId: element.id,
      name: element.name,
      emoji: element.emoji || "Element",
      categoryName: element.categoryName || "CONCEPT",
    },
  };
}

function patchData(node: ElementCanvasNode, patch: Partial<ElementCanvasNode["data"]>): ElementCanvasNode {
  return { ...node, data: { ...node.data, ...patch } };
}

function libraryPosition(nodeCount: number): { x: number; y: number } {
  return { x: 60 + (nodeCount % 3) * 180, y: 60 + Math.floor(nodeCount / 3) * 110 };
}

function useNodeCreation(
  setNodes: Dispatch<SetStateAction<ElementCanvasNode[]>>,
  setIsDirty: (value: boolean) => void,
) {
  const addNodeAtPosition = useCallback((element: CanvasElementInput, position: { x: number; y: number }) => {
    setNodes((current) => [...current, buildNode(element, position)]);
    setIsDirty(true);
  }, [setNodes, setIsDirty]);

  const addElementsToCanvas = useCallback((elements: CanvasElementInput[]) => {
    setNodes((current) => {
      const next = [...current];
      for (const element of elements) {
        if (next.some((node) => node.data.elementId === element.id)) continue;
        next.push(buildNode(element, libraryPosition(next.length)));
      }
      return next;
    });
    setIsDirty(true);
  }, [setNodes, setIsDirty]);

  return { addNodeAtPosition, addElementsToCanvas };
}

function useNodeInteraction(
  setNodes: Dispatch<SetStateAction<ElementCanvasNode[]>>,
) {
  const setCombineTarget = useCallback((id: string | null) => {
    setNodes((current) => current.map((node) => patchData(node, { isCombineTarget: node.id === id })));
  }, [setNodes]);

  const setCombiningState = useCallback((ids: string[], isCombining: boolean) => {
    setNodes((current) => current.map((node) => ids.includes(node.id)
      ? patchData(node, { isCombining, isCombineTarget: false })
      : node));
  }, [setNodes]);

  const setSelectedForCombine = useCallback((selectedId: string | null) => {
    setNodes((current) => current.map((node) => patchData(node, { isSelectedForCombine: node.id === selectedId })));
  }, [setNodes]);

  const clearInteractionState = useCallback(() => {
    setNodes((current) => current.map((node) => patchData(node, {
      isCombineTarget: false,
      isCombining: false,
      isSelectedForCombine: false,
    })));
  }, [setNodes]);

  return { setCombineTarget, setCombiningState, setSelectedForCombine, clearInteractionState };
}

function useNodeCombineMutations(
  nodes: ElementCanvasNode[],
  setNodes: Dispatch<SetStateAction<ElementCanvasNode[]>>,
  setIsDirty: (value: boolean) => void,
) {
  const addResultNode = useCallback((element: CanvasElementInput, collisionPosition: { x: number; y: number }) => {
    if (nodes.some((node) => node.data.elementId === element.id)) return;
    setNodes((current) => [...current, buildNode(element, {
      x: collisionPosition.x + RESULT_NODE_OFFSET.x,
      y: collisionPosition.y + RESULT_NODE_OFFSET.y,
    })]);
    setIsDirty(true);
  }, [nodes, setNodes, setIsDirty]);

  const recoverCombine = useCallback((sourceNodeId: string, targetNodeId: string) => {
    setNodes((current) => {
      const source = current.find((node) => node.id === sourceNodeId);
      const target = current.find((node) => node.id === targetNodeId);
      if (!source || !target) return current;
      const dx = source.position.x - target.position.x;
      const dy = source.position.y - target.position.y;
      const distance = Math.hypot(dx, dy);
      const offset = distance === 0
        ? { x: NODE_SEPARATION_DISTANCE, y: 24 }
        : { x: (dx / distance) * NODE_SEPARATION_DISTANCE, y: (dy / distance) * NODE_SEPARATION_DISTANCE };
      return current.map((node) => node.id === sourceNodeId
        ? { ...node, position: { x: source.position.x + offset.x, y: source.position.y + offset.y } }
        : node);
    });
    setIsDirty(true);
  }, [setNodes, setIsDirty]);

  return { addResultNode, recoverCombine };
}

export function useCanvasNodes(initialNodesInput?: InitialNodeInput[] | null) {
  const initialNodes = useMemo(() => mapInitialNodes(initialNodesInput), [initialNodesInput]);
  const [nodes, setNodes, onNodesChangeBase] = useNodesState<ElementCanvasNode>(initialNodes);
  const [isDirty, setIsDirty] = useState(false);
  const creation = useNodeCreation(setNodes, setIsDirty);
  const interaction = useNodeInteraction(setNodes);
  const combine = useNodeCombineMutations(nodes, setNodes, setIsDirty);

  const onNodesChange: OnNodesChange<ElementCanvasNode> = useCallback((changes) => {
    onNodesChangeBase(changes);
    if (changes.some((change) => change.type === "position" || change.type === "remove" || change.type === "add")) {
      setIsDirty(true);
    }
  }, [onNodesChangeBase]);

  const getPersistableNodes = useCallback((): PersistableCanvasNode[] => nodes.map((node) => ({
    id: node.id,
    elementId: node.data.elementId,
    positionX: Math.round(node.position.x),
    positionY: Math.round(node.position.y),
  })), [nodes]);

  const markSaved = useCallback(() => setIsDirty(false), []);

  return {
    nodes,
    onNodesChange,
    ...creation,
    ...interaction,
    ...combine,
    isDirty,
    getPersistableNodes,
    markSaved,
  };
}
