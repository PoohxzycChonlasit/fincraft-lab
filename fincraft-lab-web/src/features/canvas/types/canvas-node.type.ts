import type { Node } from "@xyflow/react";

export type ElementNodeData = {
  elementId: string;
  name: string;
  emoji: string;
  categoryName: string;
};

export type ElementCanvasNode = Node<ElementNodeData, "elementNode">;
