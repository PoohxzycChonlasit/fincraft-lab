import "server-only";

import { backendFetch } from "@/lib/api/backend-fetch.server";
import type { CanvasSnapshot, WorkspaceSummary } from "../types/workspace.type";

export type FetchWorkspaceResult =
  | {
      success: true;
      workspaceId: string;
      workspaces: WorkspaceSummary[];
      selectedWorkspace: WorkspaceSummary;
      snapshot: CanvasSnapshot;
    }
  | { success: false; redirectLogin: true }
  | { success: false; errorMessage: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isWorkspaceSummary(value: unknown): value is WorkspaceSummary {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.status === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function readWorkspaceList(value: unknown): WorkspaceSummary[] | null {
  if (!isRecord(value) || !Array.isArray(value.data)) return null;
  const entries: unknown[] = Array.from(value.data);
  return entries.every(isWorkspaceSummary) ? entries.filter(isWorkspaceSummary) : null;
}

function readWorkspace(value: unknown): WorkspaceSummary | null {
  if (!isRecord(value) || !isWorkspaceSummary(value.data)) return null;
  return value.data;
}

function isCanvasSnapshot(value: unknown): value is CanvasSnapshot {
  if (!isRecord(value)) return false;
  if (
    typeof value.workspaceId !== "string" ||
    typeof value.workspaceUpdatedAt !== "string" ||
    !Array.isArray(value.nodes) ||
    !Array.isArray(value.edges)
  ) {
    return false;
  }

  const validNodes = value.nodes.every((node) => {
    if (!isRecord(node)) return false;
    return (
      typeof node.id === "string" &&
      typeof node.elementId === "string" &&
      typeof node.positionX === "number" &&
      typeof node.positionY === "number" &&
      (node.valueData === undefined || isRecord(node.valueData))
    );
  });
  const validEdges = value.edges.every((edge) => {
    if (!isRecord(edge)) return false;
    return (
      typeof edge.id === "string" &&
      typeof edge.sourceNodeId === "string" &&
      typeof edge.targetNodeId === "string" &&
      typeof edge.label === "string"
    );
  });

  return validNodes && validEdges;
}

type WorkspaceListResult =
  | { success: true; workspaces: WorkspaceSummary[] }
  | { success: false; redirectLogin: true }
  | { success: false; errorMessage: string };

function backendFailure(
  status: number,
  error: string,
): WorkspaceListResult {
  if (status === 401) return { success: false, redirectLogin: true };
  return { success: false, errorMessage: error || `Workspace request failed (HTTP ${status}).` };
}

async function loadWorkspaceList(): Promise<WorkspaceListResult> {
  const listResponse = await backendFetch("/workspaces", { method: "GET" });
  if (!listResponse.ok) return backendFailure(listResponse.status, listResponse.error);

  const workspaces = readWorkspaceList(listResponse.data);
  if (!workspaces) {
    return { success: false, errorMessage: "Workspace list response was invalid." };
  }
  if (workspaces.length > 0) return { success: true, workspaces };

  const createResponse = await backendFetch("/workspaces", {
    method: "POST",
    body: { name: "Default Workspace" },
  });
  if (!createResponse.ok) {
    return backendFailure(createResponse.status, createResponse.error);
  }

  const createdWorkspace = readWorkspace(createResponse.data);
  if (!createdWorkspace) {
    return { success: false, errorMessage: "Created workspace response was invalid." };
  }
  return { success: true, workspaces: [createdWorkspace] };
}

export async function fetchUserWorkspaceCanvas(
  requestedWorkspaceId?: string,
): Promise<FetchWorkspaceResult> {
  try {
    const listResult = await loadWorkspaceList();
    if (!listResult.success) return listResult;

    const selectedWorkspace =
      listResult.workspaces.find((workspace) => workspace.id === requestedWorkspaceId) ??
      listResult.workspaces[0];

    if (!selectedWorkspace) {
      return { success: false, errorMessage: "No workspace is available." };
    }

    const canvasResponse = await backendFetch(
      `/workspaces/${selectedWorkspace.id}/canvas`,
      { method: "GET" },
    );
    if (!canvasResponse.ok) {
      if (canvasResponse.status === 401) return { success: false, redirectLogin: true };
      return {
        success: false,
        errorMessage:
          canvasResponse.error ||
          `Failed to load workspace canvas (HTTP ${canvasResponse.status}).`,
      };
    }

    const canvasEnvelope = isRecord(canvasResponse.data) ? canvasResponse.data.data : null;
    if (!isCanvasSnapshot(canvasEnvelope)) {
      return { success: false, errorMessage: "Workspace canvas response was invalid." };
    }

    return {
      success: true,
      workspaceId: selectedWorkspace.id,
      workspaces: listResult.workspaces,
      selectedWorkspace,
      snapshot: canvasEnvelope,
    };
  } catch {
    return {
      success: false,
      errorMessage: "Backend connection error while loading workspace.",
    };
  }
}
