import type { SaveWorkspacePayloadNode } from "../types/workspace.type";
import { readWorkspaceApiError } from "./workspace.client";

export async function saveWorkspaceCanvasApi(
  workspaceId: string,
  nodes: SaveWorkspacePayloadNode[],
): Promise<{ success: true } | { success: false; errorMessage: string }> {
  try {
    const res = await fetch(`/api/workspaces/${workspaceId}/canvas`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodes, edges: [] }),
    });

    if (!res.ok) {
      const body: unknown = await res.json().catch(() => null);
      return { success: false, errorMessage: readWorkspaceApiError(body, "Failed to save workspace.") };
    }

    return { success: true };
  } catch {
    return { success: false, errorMessage: "Network error while saving workspace." };
  }
}
