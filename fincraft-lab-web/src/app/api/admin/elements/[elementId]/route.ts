import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ elementId: string }> },
) {
  const { elementId } = await params;
  if (!elementId) {
    return NextResponse.json({ error: "Element ID is required" }, { status: 400 });
  }

  const res = await backendFetch(`/admin/elements/${elementId}`, {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: res.status });
  }

  return NextResponse.json(res.data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ elementId: string }> },
) {
  try {
    const { elementId } = await params;
    if (!elementId) {
      return NextResponse.json({ error: "Element ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const res = await backendFetch(`/admin/elements/${elementId}`, {
      method: "PATCH",
      body,
      requireAuth: true,
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data);
  } catch {
    return NextResponse.json({ error: "Network error updating admin element" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ elementId: string }> },
) {
  try {
    const { elementId } = await params;
    if (!elementId) {
      return NextResponse.json({ error: "Element ID is required" }, { status: 400 });
    }

    const res = await backendFetch(`/admin/elements/${elementId}`, {
      method: "DELETE",
      requireAuth: true,
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data);
  } catch {
    return NextResponse.json({ error: "Network error archiving admin element" }, { status: 500 });
  }
}
