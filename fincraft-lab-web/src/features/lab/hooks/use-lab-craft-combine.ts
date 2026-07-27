"use client";

import { useCallback, useState } from "react";
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
  const [lastFailedPair, setLastFailedPair] = useState<{ sourceId: string; targetId: string } | null>(null);

  const handleCombineRequest = useCallback(async (request: CanvasCombineRequest) => {
    const result = await handleCraft(
      { id: request.sourceElementId },
      { id: request.targetElementId },
    );
    if (result?.outcome === "DISCOVERY") {
      setLastFailedPair(null);
      addResultNode({
        id: result.element.id,
        name: result.element.name,
        emoji: result.element.emoji,
        categoryName: result.element.elementType,
      }, request.collisionPosition);
      return;
    }
    if (result?.outcome === "NO_RECIPE") {
      setLastFailedPair({ sourceId: request.sourceElementId, targetId: request.targetElementId });
    }
    recoverCombine(request.sourceNodeId, request.targetNodeId);
  }, [addResultNode, handleCraft, recoverCombine]);

  const canvasCombine = useCanvasCombine({ canvas, onCombineRequest: handleCombineRequest });

  const handleResetAll = () => {
    craft.handleReset();
    setLastFailedPair(null);
  };

  return {
    ...canvasCombine,
    craftResult: craft.craftResult,
    craftError: craft.craftError,
    isSubmitting: craft.isSubmitting,
    lastFailedPair,
    handleReset: handleResetAll,
    dismissError: craft.dismissError,
  };
}
