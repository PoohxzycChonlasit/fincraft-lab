import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  try {
    const { workspaceId } = await params;
    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    const body: unknown = await request.json();
    if (!isRecord(body) || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "At least one workspace field is required" }, { status: 400 });
    }

    const response = await backendFetch(`/workspaces/${workspaceId}`, {
      method: "PATCH",
      body,
    });
    if (!response.ok) {
      return NextResponse.json({ error: response.error }, { status: response.status });
    }
    return NextResponse.json(response.data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Invalid workspace update request" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await params;
  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
  }

  const response = await backendFetch(`/workspaces/${workspaceId}`, { method: "DELETE" });
  if (!response.ok) {
    return NextResponse.json({ error: response.error }, { status: response.status });
  }
  return NextResponse.json(response.data, { status: response.status });
}
