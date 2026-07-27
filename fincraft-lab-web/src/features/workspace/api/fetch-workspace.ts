import { cookies } from "next/headers";
import type { CanvasSnapshot, WorkspaceSummary } from "../types/workspace.type";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type FetchWorkspaceResult =
  | { success: true; workspaceId: string; snapshot: CanvasSnapshot }
  | { success: false; redirectLogin: true }
  | { success: false; errorMessage: string };

async function getOrCreateWorkspaceId(token: string): Promise<string | null> {
  const getRes = await fetch(`${BACKEND_URL}/workspaces`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!getRes.ok) return null;

  const json = (await getRes.json()) as { data?: WorkspaceSummary[] };
  const workspaces = json.data ?? [];

  if (workspaces.length > 0) {
    return workspaces[0].id;
  }

  const createRes = await fetch(`${BACKEND_URL}/workspaces`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "Default Workspace" }),
  });

  if (!createRes.ok) return null;

  const createJson = (await createRes.json()) as { data?: WorkspaceSummary };
  return createJson.data?.id ?? null;
}

export async function fetchUserWorkspaceCanvas(): Promise<FetchWorkspaceResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return { success: false, redirectLogin: true };
  }

  try {
    const workspaceId = await getOrCreateWorkspaceId(token);
    if (!workspaceId) {
      return {
        success: false,
        errorMessage: "Unable to retrieve or create user workspace.",
      };
    }

    const canvasRes = await fetch(`${BACKEND_URL}/workspaces/${workspaceId}/canvas`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (canvasRes.status === 401) {
      return { success: false, redirectLogin: true };
    }

    if (!canvasRes.ok) {
      return {
        success: false,
        errorMessage: `Failed to load workspace canvas (HTTP ${canvasRes.status}).`,
      };
    }

    const canvasJson = (await canvasRes.json()) as { data?: CanvasSnapshot };
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
