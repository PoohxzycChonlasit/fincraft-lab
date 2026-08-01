import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ elementId: string }> },
) {
  try {
    const { elementId } = await params;
    if (!elementId) {
      return NextResponse.json({ error: "Element ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const res = await backendFetch(`/admin/elements/${elementId}/detail`, {
      method: "PUT",
      body,
      requireAuth: true,
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data);
  } catch {
    return NextResponse.json({ error: "Invalid discovery detail payload" }, { status: 400 });
  }
}
