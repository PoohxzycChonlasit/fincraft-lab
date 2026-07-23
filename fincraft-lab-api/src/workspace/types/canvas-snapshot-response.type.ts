import type { ElementType } from '../../database/generated/prisma/client';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | Record<string, unknown>;

export type JsonObject = Record<string, JsonValue>;

export interface CanvasNodeElementResponse {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  iconUrl: string | null;
  elementType: ElementType;
  isStarter: boolean;
}

export interface CanvasNodeResponse {
  id: string;
  elementId: string;
  element: CanvasNodeElementResponse;
  positionX: number;
  positionY: number;
  valueData: JsonObject;
}

export interface CanvasEdgeResponse {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label: string;
}

export interface CanvasSnapshotResponse {
  workspaceId: string;
  workspaceUpdatedAt: string;
  nodes: CanvasNodeResponse[];
  edges: CanvasEdgeResponse[];
}
