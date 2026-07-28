import type { CraftDiscoveryResult } from "@/features/craft/public";
import type { SaveWorkspacePayloadNode } from "../types/workspace.type";
import { readWorkspaceApiError } from "./workspace.client";

export type SaveWorkspacePayloadEdge = {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
};

export async function saveWorkspaceCanvasApi(
  workspaceId: string,
  nodes: SaveWorkspacePayloadNode[],
  edges: SaveWorkspacePayloadEdge[] = [],
  lastDiscovery?: CraftDiscoveryResult | null,
): Promise<{ success: true } | { success: false; errorMessage: string }> {
  try {
    const res = await fetch(`/api/workspaces/${workspaceId}/canvas`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodes, edges, lastDiscovery: lastDiscovery ?? null }),
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
