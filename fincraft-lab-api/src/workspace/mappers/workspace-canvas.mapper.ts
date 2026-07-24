import type { ElementType } from '../../database/generated/prisma/client';
import type {
  CanvasSnapshotResponse,
  JsonObject,
  JsonValue,
} from '../types/canvas-snapshot-response.type';

export interface RawDbWorkspaceNode {
  id: string;
  elementId: string;
  positionX: number;
  positionY: number;
  valueData: unknown;
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

export interface RawDbWorkspaceEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label: string;
}

/**
 * Maps raw database workspace nodes and edges into the public CanvasSnapshotResponse shape.
 */
export function mapCanvasSnapshotResponse(
  workspaceId: string,
  workspaceUpdatedAt: Date,
  nodes: RawDbWorkspaceNode[],
  edges: RawDbWorkspaceEdge[],
): CanvasSnapshotResponse {
  return {
    workspaceId,
    workspaceUpdatedAt: workspaceUpdatedAt.toISOString(),
    nodes: nodes.map((n) => {
      const rawValData = n.valueData;
      let valDataObj: JsonObject = {};

      if (
        typeof rawValData === 'object' &&
        rawValData !== null &&
        !Array.isArray(rawValData)
      ) {
        valDataObj = rawValData as Record<string, JsonValue>;
      }

      return {
        id: n.id,
        workspaceId,
        elementId: n.elementId,
        positionX: n.positionX,
        positionY: n.positionY,
        valueData: valDataObj,
        element: {
          id: n.element.id,
          name: n.element.name,
          slug: n.element.slug,
          emoji: n.element.emoji,
          iconUrl: n.element.iconUrl,
          elementType: n.element.elementType,
          isStarter: n.element.isStarter,
        },
      };
    }),
    edges: edges.map((e) => ({
      id: e.id,
      workspaceId,
      sourceNodeId: e.sourceNodeId,
      targetNodeId: e.targetNodeId,
      label: e.label,
    })),
  };
}
