import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function GET() {
  const response = await backendFetch("/workspaces", { method: "GET" });
  if (!response.ok) {
    return NextResponse.json({ error: response.error }, { status: response.status });
  }
  return NextResponse.json(response.data, { status: response.status });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!isRecord(body) || typeof body.name !== "string" || body.name.trim().length === 0) {
      return NextResponse.json({ error: "Workspace name is required" }, { status: 400 });
    }

    const response = await backendFetch("/workspaces", {
      method: "POST",
      body: { name: body.name },
    });
    if (!response.ok) {
      return NextResponse.json({ error: response.error }, { status: response.status });
    }
    return NextResponse.json(response.data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Invalid workspace request" }, { status: 400 });
  }
}
