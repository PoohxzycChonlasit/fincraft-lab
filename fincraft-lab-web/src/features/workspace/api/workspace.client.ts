import type {
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
  WorkspaceSummary,
} from "../types/workspace.type";

type WorkspaceApiSuccess<T> = {
  success: true;
  data: T;
};

type WorkspaceApiFailure = {
  success: false;
  errorMessage: string;
  status: number;
};

export type WorkspaceApiResult<T> = WorkspaceApiSuccess<T> | WorkspaceApiFailure;

type DeleteWorkspaceResponse = {
  id: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readWorkspace(value: unknown): WorkspaceSummary | null {
  if (!isRecord(value) || !isRecord(value.data)) return null;
  const workspace = value.data;
  if (
    typeof workspace.id !== "string" ||
    typeof workspace.name !== "string" ||
    typeof workspace.status !== "string" ||
    typeof workspace.createdAt !== "string" ||
    typeof workspace.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    id: workspace.id,
    name: workspace.name,
    status: workspace.status,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  };
}

function readDeletedWorkspace(value: unknown): DeleteWorkspaceResponse | null {
  if (!isRecord(value) || !isRecord(value.data) || typeof value.data.id !== "string") {
    return null;
  }
  return { id: value.data.id };
}

export function readWorkspaceApiError(value: unknown, fallback: string): string {
  if (!isRecord(value)) return fallback;
  if (typeof value.error === "string" && value.error.trim().length > 0) return value.error;
  if (typeof value.message === "string" && value.message.trim().length > 0) return value.message;
  if (Array.isArray(value.message) && value.message.every((item) => typeof item === "string")) {
    return value.message.join(". ");
  }
  return fallback;
}

async function readResponseBody(response: Response): Promise<unknown> {
  const body: unknown = await response.json().catch(() => null);
  return body;
}

async function requestWorkspace<T>(
  path: string,
  options: RequestInit,
  readData: (body: unknown) => T | null,
  fallback: string,
): Promise<WorkspaceApiResult<T>> {
  try {
    const response = await fetch(path, options);
    const body = await readResponseBody(response);
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        errorMessage: readWorkspaceApiError(body, fallback),
      };
    }

    const data = readData(body);
    if (!data) {
      return {
        success: false,
        status: response.status,
        errorMessage: "Workspace response was invalid.",
      };
    }
    return { success: true, data };
  } catch {
    return { success: false, status: 0, errorMessage: "Network error while managing workspace." };
  }
}

export function createWorkspaceApi(
  payload: CreateWorkspacePayload,
): Promise<WorkspaceApiResult<WorkspaceSummary>> {
  return requestWorkspace(
    "/api/workspaces",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    readWorkspace,
    "Failed to create workspace.",
  );
}

export function updateWorkspaceApi(
  workspaceId: string,
  payload: UpdateWorkspacePayload,
): Promise<WorkspaceApiResult<WorkspaceSummary>> {
  return requestWorkspace(
    `/api/workspaces/${workspaceId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    readWorkspace,
    "Failed to update workspace.",
  );
}

export function deleteWorkspaceApi(
  workspaceId: string,
): Promise<WorkspaceApiResult<DeleteWorkspaceResponse>> {
  return requestWorkspace(
    `/api/workspaces/${workspaceId}`,
    { method: "DELETE" },
    readDeletedWorkspace,
    "Failed to delete workspace.",
  );
}
