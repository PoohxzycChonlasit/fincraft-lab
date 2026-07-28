import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  try {
    const { workspaceId } = await params;
    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    const body: unknown = await request.json();
    if (!isRecord(body)) {
      return NextResponse.json({ error: "Canvas payload must be an object" }, { status: 400 });
    }

    const nodes = Array.isArray(body.nodes) ? body.nodes : [];
    const edges = Array.isArray(body.edges) ? body.edges : [];
    if ("lastDiscovery" in body && body.lastDiscovery !== null && !isRecord(body.lastDiscovery)) {
      return NextResponse.json({ error: "Last discovery must be an object or null" }, { status: 400 });
    }

    const res = await backendFetch(`/workspaces/${workspaceId}/canvas`, {
      method: "PUT",
      body: { nodes, edges, lastDiscovery: body.lastDiscovery },
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data);
  } catch {
    return NextResponse.json({ error: "Network or server error during workspace save" }, { status: 500 });
  }
}
