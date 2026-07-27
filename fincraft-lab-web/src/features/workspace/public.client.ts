export { WorkspaceManager } from "./components/workspace-manager";
export {
  createWorkspaceApi,
  deleteWorkspaceApi,
  updateWorkspaceApi,
  type WorkspaceApiResult,
} from "./api/workspace.client";
export { saveWorkspaceCanvasApi } from "./api/save-workspace.client";
export type {
  CanvasSnapshot,
  CreateWorkspacePayload,
  SaveWorkspacePayloadNode,
  UpdateWorkspacePayload,
  WorkspaceSummary,
} from "./types/workspace.type";
