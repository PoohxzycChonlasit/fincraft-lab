"use client";

import { useState, useCallback, useMemo } from "react";
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

function mapInitialNodes(inputs?: InitialNodeInput[] | null): ElementCanvasNode[] {
  if (!inputs || inputs.length === 0) return [];
  return inputs.map((n) => ({
    id: n.id,
    type: "elementNode",
    position: { x: n.positionX, y: n.positionY },
    data: { elementId: n.elementId, name: n.name ?? "Element", emoji: n.emoji ?? "📄", categoryName: n.categoryName ?? "CONCEPT" },
  }));
}

function buildNode(el: CanvasElementInput, pos: { x: number; y: number }): ElementCanvasNode {
  return {
    id: crypto.randomUUID(),
    type: "elementNode",
    position: { x: Math.round(pos.x), y: Math.round(pos.y) },
    data: { elementId: el.id, name: el.name, emoji: el.emoji || "📄", categoryName: el.categoryName || "CONCEPT" },
  };
}

function patchData(node: ElementCanvasNode, patch: Partial<ElementCanvasNode["data"]>): ElementCanvasNode {
  return { ...node, data: { ...node.data, ...patch } };
}

function useNodeMutations(setNodes: React.Dispatch<React.SetStateAction<ElementCanvasNode[]>>, setIsDirty: (v: boolean) => void) {
  const addNodeAtPosition = useCallback(
    (el: CanvasElementInput, pos: { x: number; y: number }) => {
      setNodes((prev) => [...prev, buildNode(el, pos)]);
      setIsDirty(true);
    },
    [setNodes, setIsDirty],
  );

  const addElementsToCanvas = useCallback(
    (elems: CanvasElementInput[]) => {
      setNodes((prev) => {
        const updated = [...prev];
        let count = prev.length;
        for (const el of elems) {
          if (!updated.some((n) => n.data.elementId === el.id)) {
            updated.push(buildNode(el, { x: 60 + (count % 3) * 180, y: 60 + Math.floor(count / 3) * 110 }));
            count += 1;
          }
        }
        return updated;
      });
      setIsDirty(true);
    },
    [setNodes, setIsDirty],
  );

  const setCombineTarget = useCallback(
    (id: string | null) => setNodes((prev) => prev.map((n) => (Boolean(n.data.isCombineTarget) === (n.id === id) ? n : patchData(n, { isCombineTarget: n.id === id })))),
    [setNodes],
  );

  const setCombiningState = useCallback(
    (ids: string[], isCombining: boolean) => setNodes((prev) => prev.map((n) => (ids.includes(n.id) ? patchData(n, { isCombining, isCombineTarget: false }) : n))),
    [setNodes],
  );

  const setSelectedForCombine = useCallback(
    (selectedId: string | null) => setNodes((prev) => prev.map((n) => (Boolean(n.data.isSelectedForCombine) === (n.id === selectedId) ? n : patchData(n, { isSelectedForCombine: n.id === selectedId })))),
    [setNodes],
  );

  return { addNodeAtPosition, addElementsToCanvas, setCombineTarget, setCombiningState, setSelectedForCombine };
}

export function useCanvasNodes(initialNodesInput?: InitialNodeInput[] | null) {
  const initialNodes = useMemo(() => mapInitialNodes(initialNodesInput), [initialNodesInput]);
  const [nodes, setNodes, onNodesChangeBase] = useNodesState<ElementCanvasNode>(initialNodes);
  const [isDirty, setIsDirty] = useState(false);

  const onNodesChange: OnNodesChange<ElementCanvasNode> = useCallback(
    (changes) => {
      onNodesChangeBase(changes);
      if (changes.some((c) => c.type === "position" || c.type === "remove" || c.type === "add")) setIsDirty(true);
    },
    [onNodesChangeBase],
  );

  const mutations = useNodeMutations(setNodes, setIsDirty);

  const getPersistableNodes = useCallback(
    (): PersistableCanvasNode[] => nodes.map((n) => ({ id: n.id, elementId: n.data.elementId, positionX: Math.round(n.position.x), positionY: Math.round(n.position.y) })),
    [nodes],
  );

  const markSaved = useCallback(() => setIsDirty(false), []);

  return { nodes, onNodesChange, ...mutations, isDirty, getPersistableNodes, markSaved };
}
