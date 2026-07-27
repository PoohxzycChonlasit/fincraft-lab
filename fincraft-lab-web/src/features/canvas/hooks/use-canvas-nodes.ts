"use client";

import { useCallback } from "react";
import { useNodesState } from "@xyflow/react";
import type { AvailableElement } from "@/features/craft/types/craft-element.type";
import type { ElementCanvasNode } from "../types/canvas-node.type";

export function useCanvasNodes() {
  const [nodes, setNodes, onNodesChange] = useNodesState<ElementCanvasNode>([]);

  const addElementsToCanvas = useCallback((elementsToPlace: AvailableElement[]) => {
    setNodes((prevNodes) => {
      const updated = [...prevNodes];
      let newCount = prevNodes.length;

      for (const el of elementsToPlace) {
        const exists = updated.some((n) => n.id === el.id);
        if (!exists) {
          const x = 60 + (newCount % 3) * 180;
          const y = 60 + Math.floor(newCount / 3) * 110;
          newCount += 1;

          const newNode: ElementCanvasNode = {
            id: el.id,
            type: "elementNode",
            position: { x, y },
            data: {
              elementId: el.id,
              name: el.name,
              emoji: el.emoji || "📄",
              categoryName: el.category?.name || el.elementType,
            },
          };

          updated.push(newNode);
        }
      }

      return updated;
    });
  }, [setNodes]);

  return {
    nodes,
    onNodesChange,
    addElementsToCanvas,
  };
}
