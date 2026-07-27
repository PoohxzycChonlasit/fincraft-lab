import type { Node } from "@xyflow/react";

export type CanvasElementInput = {
  id: string;
  name: string;
  emoji?: string;
  categoryName?: string;
};

export type ElementNodeData = {
  elementId: string;
  name: string;
  emoji: string;
  categoryName: string;
  isCombineTarget?: boolean;
  isCombining?: boolean;
  isSelectedForCombine?: boolean;
};

export type ElementCanvasNode = Node<ElementNodeData, "elementNode">;

export type PersistableCanvasNode = {
  id: string;
  elementId: string;
  positionX: number;
  positionY: number;
};
