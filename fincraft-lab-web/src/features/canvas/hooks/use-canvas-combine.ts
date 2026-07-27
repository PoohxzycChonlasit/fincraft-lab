"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useCraft } from "@/features/craft/hooks/use-craft";
import type { AvailableElement } from "@/features/craft/types/craft-element.type";
import type { CraftElementResult } from "@/features/craft/types/craft-result.type";
import type { ElementCanvasNode, CanvasElementInput } from "../types/canvas-node.type";
import type { useCanvasNodes } from "./use-canvas-nodes";

type CanvasController = ReturnType<typeof useCanvasNodes>;

type UseCanvasCombineOptions = {
  canvas: CanvasController;
  isAuthenticated: boolean;
  onDiscovery?: (element: CraftElementResult, isNew: boolean) => void;
};

function nodeToElement(node: ElementCanvasNode): AvailableElement {
  return { id: node.data.elementId, name: node.data.name, emoji: node.data.emoji, elementType: node.data.categoryName, isStarter: false, slug: "", iconUrl: null };
}

function useRunCombine(canvas: CanvasController, isAuthenticated: boolean, onDiscovery?: (el: CraftElementResult, isNew: boolean) => void) {
  const craft = useCraft({ onDiscovery, isAuthenticated });
  const runCombine = useCallback(
    async (source: ElementCanvasNode, target: ElementCanvasNode) => {
      canvas.setCombineTarget(null);
      canvas.setCombiningState([source.id, target.id], true);
      await craft.handleCraft(nodeToElement(source), nodeToElement(target));
      canvas.setCombiningState([source.id, target.id], false);
    },
    [canvas, craft],
  );
  return { craft, runCombine };
}

function useTapCombine(canvas: CanvasController, runCombine: (s: ElementCanvasNode, t: ElementCanvasNode) => Promise<void>) {
  const tapRef = useRef<ElementCanvasNode | null>(null);
  const [tapSelectedId, setTapSelectedId] = useState<string | null>(null);

  const handleNodeTap = useCallback(
    (node: ElementCanvasNode) => {
      const prev = tapRef.current;
      if (!prev) {
        tapRef.current = node;
        setTapSelectedId(node.id);
        canvas.setSelectedForCombine(node.id);
        toast.info(`"${node.data.name}" selected. Tap another element to combine.`, { duration: 2500 });
        return;
      }
      if (prev.id === node.id) {
        tapRef.current = null;
        setTapSelectedId(null);
        canvas.setSelectedForCombine(null);
        return;
      }
      tapRef.current = null;
      setTapSelectedId(null);
      canvas.setSelectedForCombine(null);
      void runCombine(prev, node);
    },
    [canvas, runCombine],
  );

  const handleClearTapSelection = useCallback(() => {
    tapRef.current = null;
    setTapSelectedId(null);
    canvas.setSelectedForCombine(null);
  }, [canvas]);

  return { tapSelectedId, handleNodeTap, handleClearTapSelection };
}

export function useCanvasCombine({ canvas, isAuthenticated, onDiscovery }: UseCanvasCombineOptions) {
  const { craft, runCombine } = useRunCombine(canvas, isAuthenticated, onDiscovery);
  const tap = useTapCombine(canvas, runCombine);

  const handleDropOnCanvas = useCallback(
    (el: CanvasElementInput, pos: { x: number; y: number }) => canvas.addNodeAtPosition(el, pos),
    [canvas],
  );
  const handleTargetHighlight = useCallback((id: string | null) => canvas.setCombineTarget(id), [canvas]);
  const handleCombineNodes = useCallback((s: ElementCanvasNode, t: ElementCanvasNode) => { void runCombine(s, t); }, [runCombine]);

  return {
    tapSelectedId: tap.tapSelectedId,
    craftResult: craft.craftResult,
    craftError: craft.craftError,
    isSubmitting: craft.isSubmitting,
    handleReset: craft.handleReset,
    dismissError: craft.dismissError,
    handleDropOnCanvas,
    handleTargetHighlight,
    handleCombineNodes,
    handleNodeTap: tap.handleNodeTap,
    handleClearTapSelection: tap.handleClearTapSelection,
  };
}
