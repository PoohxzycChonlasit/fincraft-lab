import type { SaveWorkspacePayloadNode } from "../types/workspace.type";

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
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      return { success: false, errorMessage: json.error || "Failed to save workspace." };
    }

    return { success: true };
  } catch {
    return { success: false, errorMessage: "Network error while saving workspace." };
  }
}
