"use client";

import { useState, useCallback, useMemo } from "react";
import { useNodesState, type OnNodesChange } from "@xyflow/react";
import type { AvailableElement } from "@/features/craft/types/craft-element.type";
import type { CanvasSnapshot, SaveWorkspacePayloadNode } from "@/features/workspace/types/workspace.type";
import { saveWorkspaceCanvasApi } from "@/features/workspace/api/workspace-client";
import type { ElementCanvasNode } from "../types/canvas-node.type";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

function mapInitialNodes(snapshot?: CanvasSnapshot | null): ElementCanvasNode[] {
  if (!snapshot?.nodes || snapshot.nodes.length === 0) return [];
  return snapshot.nodes.map((node) => ({
    id: node.id,
    type: "elementNode",
    position: { x: node.positionX, y: node.positionY },
    data: {
      elementId: node.elementId,
      name: node.element?.name ?? "Element",
      emoji: node.element?.emoji ?? "📄",
      categoryName: node.element?.elementType ?? "CONCEPT",
    },
  }));
}

function buildNewNode(el: AvailableElement, index: number): ElementCanvasNode {
  return {
    id: crypto.randomUUID(),
    type: "elementNode",
    position: { x: 60 + (index % 3) * 180, y: 60 + Math.floor(index / 3) * 110 },
    data: {
      elementId: el.id,
      name: el.name,
      emoji: el.emoji || "📄",
      categoryName: el.category?.name || el.elementType,
    },
  };
}

export function useCanvasNodes(initialSnapshot?: CanvasSnapshot | null) {
  const initialNodes = useMemo(() => mapInitialNodes(initialSnapshot), [initialSnapshot]);
  const [nodes, setNodes, onNodesChangeBase] = useNodesState<ElementCanvasNode>(initialNodes);
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  const onNodesChange: OnNodesChange<ElementCanvasNode> = useCallback(
    (changes) => {
      onNodesChangeBase(changes);
      if (changes.some((c) => c.type === "position" || c.type === "remove" || c.type === "add")) {
        setIsDirty(true);
        if (saveStatus === "saved") setSaveStatus("idle");
      }
    },
    [onNodesChangeBase, saveStatus],
  );

  const addElementsToCanvas = useCallback(
    (elementsToPlace: AvailableElement[]) => {
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
      if (saveStatus === "saved") setSaveStatus("idle");
    },
    [setNodes, saveStatus],
  );

  const handleSaveWorkspace = useCallback(
    async (workspaceId: string) => {
      if (!workspaceId || saveStatus === "saving") return;
      setSaveStatus("saving");
      setSaveError(null);

      const payload: SaveWorkspacePayloadNode[] = nodes.map((n) => ({
        id: n.id,
        elementId: n.data.elementId,
        positionX: Math.round(n.position.x),
        positionY: Math.round(n.position.y),
      }));

      const res = await saveWorkspaceCanvasApi(workspaceId, payload);
      if (res.success) {
        setIsDirty(false);
        setSaveStatus("saved");
      } else {
        setSaveStatus("error");
        setSaveError(res.errorMessage);
      }
    },
    [nodes, saveStatus],
  );

  return { nodes, onNodesChange, addElementsToCanvas, isDirty, saveStatus, saveError, handleSaveWorkspace };
}
