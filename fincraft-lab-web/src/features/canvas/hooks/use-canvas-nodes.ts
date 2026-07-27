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

function mapInitialNodes(initialNodesInput?: InitialNodeInput[] | null): ElementCanvasNode[] {
  if (!initialNodesInput || initialNodesInput.length === 0) return [];
  return initialNodesInput.map((node) => ({
    id: node.id,
    type: "elementNode",
    position: { x: node.positionX, y: node.positionY },
    data: {
      elementId: node.elementId,
      name: node.name ?? "Element",
      emoji: node.emoji ?? "📄",
      categoryName: node.categoryName ?? "CONCEPT",
    },
  }));
}

function buildNewNode(el: CanvasElementInput, index: number): ElementCanvasNode {
  return {
    id: crypto.randomUUID(),
    type: "elementNode",
    position: { x: 60 + (index % 3) * 180, y: 60 + Math.floor(index / 3) * 110 },
    data: {
      elementId: el.id,
      name: el.name,
      emoji: el.emoji || "📄",
      categoryName: el.categoryName || "CONCEPT",
    },
  };
}

export function useCanvasNodes(initialNodesInput?: InitialNodeInput[] | null) {
  const initialNodes = useMemo(() => mapInitialNodes(initialNodesInput), [initialNodesInput]);
  const [nodes, setNodes, onNodesChangeBase] = useNodesState<ElementCanvasNode>(initialNodes);
  const [isDirty, setIsDirty] = useState(false);

  const onNodesChange: OnNodesChange<ElementCanvasNode> = useCallback(
    (changes) => {
      onNodesChangeBase(changes);
      if (changes.some((c) => c.type === "position" || c.type === "remove" || c.type === "add")) {
        setIsDirty(true);
      }
    },
    [onNodesChangeBase],
  );

  const addElementsToCanvas = useCallback(
    (elementsToPlace: CanvasElementInput[]) => {
      setNodes((prev) => {
        const updated = [...prev];
        let newCount = prev.length;
        for (const el of elementsToPlace) {
          if (!updated.some((n) => n.data.elementId === el.id)) {
            updated.push(buildNewNode(el, newCount));
            newCount += 1;
          }
        }
        return updated;
      });
      setIsDirty(true);
    },
    [setNodes],
  );

  const getPersistableNodes = useCallback((): PersistableCanvasNode[] => {
    return nodes.map((n) => ({
      id: n.id,
      elementId: n.data.elementId,
      positionX: Math.round(n.position.x),
      positionY: Math.round(n.position.y),
    }));
  }, [nodes]);

  const markSaved = useCallback(() => {
    setIsDirty(false);
  }, []);

  return {
    nodes,
    onNodesChange,
    addElementsToCanvas,
    isDirty,
    getPersistableNodes,
    markSaved,
  };
}
