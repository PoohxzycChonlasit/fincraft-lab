import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ recipeId: string }> },
) {
  const { recipeId } = await params;
  const res = await backendFetch(`/admin/recipes/${recipeId}`, {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: res.status });
  }

  return NextResponse.json(res.data);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ recipeId: string }> },
) {
  try {
    const { recipeId } = await params;
    const body = await req.json();
    const res = await backendFetch(`/admin/recipes/${recipeId}`, {
      method: "PATCH",
      body,
      requireAuth: true,
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data);
  } catch {
    return NextResponse.json({ error: "Invalid update payload" }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ recipeId: string }> },
) {
  const { recipeId } = await params;
  const res = await backendFetch(`/admin/recipes/${recipeId}`, {
    method: "DELETE",
    requireAuth: true,
  });

  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: res.status });
  }

  return NextResponse.json(res.data);
}
