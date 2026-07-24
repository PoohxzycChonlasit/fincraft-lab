import type { ElementType, Prisma } from '../database/generated/prisma/client';
import type {
  CanvasSnapshotResponse,
  JsonObject,
} from './types/canvas-snapshot-response.type';

export interface RawCommittedNode {
  id: string;
  elementId: string;
  positionX: number;
  positionY: number;
  valueData: Prisma.JsonValue;
  element: {
    id: string;
    name: string;
    slug: string;
    emoji: string;
    iconUrl: string | null;
    elementType: ElementType;
    isStarter: boolean;
  };
}

export interface RawCommittedEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label: string;
}

/**
 * Maps database query results into public CanvasSnapshotResponse shape.
 */
export function mapCanvasSnapshotResponse(
  workspaceId: string,
  updatedAt: Date,
  nodes: RawCommittedNode[],
  edges: RawCommittedEdge[],
): CanvasSnapshotResponse {
  return {
    workspaceId,
    workspaceUpdatedAt: updatedAt.toISOString(),
    nodes: nodes.map((node) => ({
      id: node.id,
      elementId: node.elementId,
      element: {
        id: node.element.id,
        name: node.element.name,
        slug: node.element.slug,
        emoji: node.element.emoji,
        iconUrl: node.element.iconUrl,
        elementType: node.element.elementType,
        isStarter: node.element.isStarter,
      },
      positionX: node.positionX,
      positionY: node.positionY,
      valueData: (node.valueData as JsonObject) ?? {},
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sourceNodeId: edge.sourceNodeId,
      targetNodeId: edge.targetNodeId,
      label: edge.label,
    })),
  };
}
