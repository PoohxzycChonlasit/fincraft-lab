import { backendFetch } from "@/lib/api/backend-fetch.server";
import type { CanvasSnapshot, WorkspaceSummary } from "../types/workspace.type";

export type FetchWorkspaceResult =
  | { success: true; workspaceId: string; snapshot: CanvasSnapshot }
  | { success: false; redirectLogin: true }
  | { success: false; errorMessage: string };

type WorkspaceListEnvelope = { data?: WorkspaceSummary[] };
type WorkspaceDetailEnvelope = { data?: WorkspaceSummary };
type CanvasSnapshotEnvelope = { data?: CanvasSnapshot };

async function getOrCreateWorkspaceId(): Promise<string | null> {
  const getRes = await backendFetch("/workspaces", { method: "GET", requireAuth: true });
  if (!getRes.ok) return null;

  const workspaces = (getRes.data as WorkspaceListEnvelope).data ?? [];
  if (workspaces.length > 0) {
    return workspaces[0].id;
  }

  const createRes = await backendFetch("/workspaces", {
    method: "POST",
    body: { name: "Default Workspace" },
    requireAuth: true,
  });

  if (!createRes.ok) return null;

  const createJson = createRes.data as WorkspaceDetailEnvelope;
  return createJson.data?.id ?? null;
}

export async function fetchUserWorkspaceCanvas(): Promise<FetchWorkspaceResult> {
  try {
    const workspaceId = await getOrCreateWorkspaceId();
    if (!workspaceId) {
      return {
        success: false,
        errorMessage: "Unable to retrieve or create user workspace.",
      };
    }

    const canvasRes = await backendFetch(`/workspaces/${workspaceId}/canvas`, {
      method: "GET",
      requireAuth: true,
    });

    if (!canvasRes.ok) {
      if (canvasRes.status === 401) {
        return { success: false, redirectLogin: true };
      }
      return {
        success: false,
        errorMessage: canvasRes.error || `Failed to load workspace canvas (HTTP ${canvasRes.status}).`,
      };
    }

    const canvasJson = canvasRes.data as CanvasSnapshotEnvelope;
    const snapshot = canvasJson.data ?? {
      workspaceId,
      workspaceUpdatedAt: new Date().toISOString(),
      nodes: [],
      edges: [],
    };

    return {
      success: true,
      workspaceId,
      snapshot,
    };
  } catch {
    return {
      success: false,
      errorMessage: "Backend connection error while loading workspace.",
    };
  }
}
