import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { SaveWorkspacePayloadNode } from "@/features/workspace/types/workspace.type";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type SaveCanvasRequestBody = {
  nodes?: SaveWorkspacePayloadNode[];
  edges?: unknown[];
};

function parseErrorMessage(data: { message?: string | string[] }): string {
  if (Array.isArray(data.message)) return data.message.join(". ");
  return typeof data.message === "string" ? data.message : "Failed to save workspace canvas";
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
    }

    const { workspaceId } = await params;
    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    const body = (await request.json()) as SaveCanvasRequestBody;
    const nodes = Array.isArray(body.nodes) ? body.nodes : [];
    const edges = Array.isArray(body.edges) ? body.edges : [];

    const backendRes = await fetch(`${BACKEND_URL}/workspaces/${workspaceId}/canvas`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nodes, edges }),
    });

    if (backendRes.status === 401) {
      return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
    }

    if (!backendRes.ok) {
      const errorData = (await backendRes.json().catch(() => ({}))) as { message?: string | string[] };
      return NextResponse.json({ error: parseErrorMessage(errorData) }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Network or server error during workspace save" }, { status: 500 });
  }
}
