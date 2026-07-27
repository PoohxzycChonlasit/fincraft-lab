"use client";

import { useCallback } from "react";
import { useCanvasCombine, useCanvasNodes, type CanvasCombineRequest } from "@/features/canvas/public";
import { useCraft, type CraftElementResult } from "@/features/craft/public";

type CanvasController = ReturnType<typeof useCanvasNodes>;

export type LabCraftCombineOptions = {
  canvas: CanvasController;
  isAuthenticated: boolean;
  onDiscovery?: (element: CraftElementResult, isNew: boolean) => void;
};

export function useLabCraftCombine({ canvas, isAuthenticated, onDiscovery }: LabCraftCombineOptions) {
  const craft = useCraft({ isAuthenticated, onDiscovery });
  const { handleCraft } = craft;
  const { addResultNode, recoverCombine } = canvas;

  const handleCombineRequest = useCallback(async (request: CanvasCombineRequest) => {
    const result = await handleCraft(
      { id: request.sourceElementId },
      { id: request.targetElementId },
    );
    if (result?.outcome === "DISCOVERY") {
      addResultNode({
        id: result.element.id,
        name: result.element.name,
        emoji: result.element.emoji,
        categoryName: result.element.elementType,
      }, request.collisionPosition);
      return;
    }
    recoverCombine(request.sourceNodeId, request.targetNodeId);
  }, [addResultNode, handleCraft, recoverCombine]);

  const canvasCombine = useCanvasCombine({ canvas, onCombineRequest: handleCombineRequest });

  return {
    ...canvasCombine,
    craftResult: craft.craftResult,
    craftError: craft.craftError,
    isSubmitting: craft.isSubmitting,
    handleReset: craft.handleReset,
    dismissError: craft.dismissError,
  };
}
