import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";
import type { SaveWorkspacePayloadNode } from "@/features/workspace/types/workspace.type";

type SaveCanvasRequestBody = {
  nodes?: SaveWorkspacePayloadNode[];
  edges?: unknown[];
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  try {
    const { workspaceId } = await params;
    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    const body = (await request.json()) as SaveCanvasRequestBody;
    const nodes = Array.isArray(body.nodes) ? body.nodes : [];
    const edges = Array.isArray(body.edges) ? body.edges : [];

    const res = await backendFetch(`/workspaces/${workspaceId}/canvas`, {
      method: "PUT",
      body: { nodes, edges },
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data);
  } catch {
    return NextResponse.json({ error: "Network or server error during workspace save" }, { status: 500 });
  }
}
