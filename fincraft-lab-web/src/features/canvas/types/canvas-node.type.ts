import type { Node } from "@xyflow/react";

export type CanvasElementInput = {
  id: string;
  name: string;
  emoji?: string;
  categoryName?: string;
};

export type CanvasCombineRequest = {
  sourceNodeId: string;
  targetNodeId: string;
  sourceElementId: string;
  targetElementId: string;
  collisionPosition: { x: number; y: number };
};

export type ElementNodeData = {
  elementId: string;
  name: string;
  emoji: string;
  categoryName: string;
  isCombineTarget?: boolean;
  isCombining?: boolean;
  isSelectedForCombine?: boolean;
  valueData?: Record<string, unknown>;
};

export type ElementCanvasNode = Node<ElementNodeData, "elementNode">;

export type PersistableCanvasNode = {
  id: string;
  elementId: string;
  positionX: number;
  positionY: number;
  valueData?: Record<string, unknown>;
};
