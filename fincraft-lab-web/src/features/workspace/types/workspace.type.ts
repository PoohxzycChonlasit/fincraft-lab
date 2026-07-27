export type WorkspaceSummary = {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateWorkspacePayload = {
  name: string;
};

export type UpdateWorkspacePayload = {
  name?: string;
  status?: "ACTIVE" | "ARCHIVED";
};

export type CanvasNodeElementMetadata = {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  iconUrl: string | null;
  elementType: string;
  isStarter: boolean;
};

export type PersistedCanvasNode = {
  id: string;
  elementId: string;
  positionX: number;
  positionY: number;
  valueData?: Record<string, unknown>;
  element?: CanvasNodeElementMetadata;
};

export type CanvasSnapshot = {
  workspaceId: string;
  workspaceUpdatedAt: string;
  nodes: PersistedCanvasNode[];
  edges: Array<{ id: string; sourceNodeId: string; targetNodeId: string; label: string }>;
};

export type SaveWorkspacePayloadNode = {
  id: string;
  elementId: string;
  positionX: number;
  positionY: number;
  valueData?: Record<string, unknown>;
};
