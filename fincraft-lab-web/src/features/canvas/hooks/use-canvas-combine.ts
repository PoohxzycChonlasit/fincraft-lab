"use client";

import { useCallback, useRef } from "react";
import { toast } from "sonner";
import type { ElementCanvasNode, CanvasCombineRequest, CanvasElementInput } from "../types/canvas-node.type";
import type { useCanvasNodes } from "./use-canvas-nodes";

type CanvasController = ReturnType<typeof useCanvasNodes>;

type UseCanvasCombineOptions = {
  canvas: CanvasController;
  onCombineRequest: (request: CanvasCombineRequest) => Promise<void> | void;
};

function midpoint(source: ElementCanvasNode, target: ElementCanvasNode): { x: number; y: number } {
  return {
    x: (source.position.x + target.position.x) / 2,
    y: (source.position.y + target.position.y) / 2,
  };
}

function useCombineRequest(
  canvas: CanvasController,
  onCombineRequest: (request: CanvasCombineRequest) => Promise<void> | void,
) {
  const requestLockRef = useRef(false);

  const requestCombine = useCallback((source: ElementCanvasNode, target: ElementCanvasNode, collisionPosition: { x: number; y: number }) => {
    if (requestLockRef.current) return false;
    requestLockRef.current = true;
    canvas.setCombineTarget(null);
    canvas.setCombiningState([source.id, target.id], true);
    const request: CanvasCombineRequest = {
      sourceNodeId: source.id,
      targetNodeId: target.id,
      sourceElementId: source.data.elementId,
      targetElementId: target.data.elementId,
      collisionPosition,
    };
    void Promise.resolve(onCombineRequest(request)).finally(() => {
      canvas.clearInteractionState();
      requestLockRef.current = false;
    });
    return true;
  }, [canvas, onCombineRequest]);

  const isLocked = useCallback(() => requestLockRef.current, []);
  return { requestCombine, isLocked };
}

function useTapCombine(
  canvas: CanvasController,
  requestCombine: (source: ElementCanvasNode, target: ElementCanvasNode, collisionPosition: { x: number; y: number }) => boolean,
  isLocked: () => boolean,
) {
  const tapRef = useRef<ElementCanvasNode | null>(null);
  const handleNodeTap = useCallback((node: ElementCanvasNode) => {
    if (isLocked()) return;
    const previous = tapRef.current;
    if (!previous) {
      tapRef.current = node;
      canvas.setSelectedForCombine(node.id);
      toast.info(`"${node.data.name}" selected. Tap another element to combine.`, { duration: 2500 });
      return;
    }
    tapRef.current = null;
    canvas.setSelectedForCombine(null);
    if (previous.id !== node.id) requestCombine(previous, node, midpoint(previous, node));
  }, [canvas, isLocked, requestCombine]);

  const handleClearTapSelection = useCallback(() => {
    tapRef.current = null;
    canvas.setSelectedForCombine(null);
  }, [canvas]);

  return { handleNodeTap, handleClearTapSelection };
}

export function useCanvasCombine({ canvas, onCombineRequest }: UseCanvasCombineOptions) {
  const { requestCombine, isLocked } = useCombineRequest(canvas, onCombineRequest);
  const tap = useTapCombine(canvas, requestCombine, isLocked);

  const handleDropOnCanvas = useCallback((element: CanvasElementInput, position: { x: number; y: number }) => {
    canvas.addNodeAtPosition(element, position);
  }, [canvas]);
  const handleTargetHighlight = useCallback((id: string | null) => canvas.setCombineTarget(id), [canvas]);
  const handleCombineNodes = useCallback((source: ElementCanvasNode, target: ElementCanvasNode, collisionPosition: { x: number; y: number }) => {
    requestCombine(source, target, collisionPosition);
  }, [requestCombine]);

  return {
    handleDropOnCanvas,
    handleTargetHighlight,
    handleCombineNodes,
    handleNodeTap: tap.handleNodeTap,
    handleClearTapSelection: tap.handleClearTapSelection,
  };
}
