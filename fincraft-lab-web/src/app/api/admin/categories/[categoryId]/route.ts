import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

type RouteProps = {
  params: Promise<{ categoryId: string }>;
};

export async function GET(_req: Request, { params }: RouteProps) {
  const { categoryId } = await params;
  const res = await backendFetch(`/admin/categories/${categoryId}`, {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: res.status });
  }

  return NextResponse.json(res.data);
}

export async function PATCH(req: Request, { params }: RouteProps) {
  try {
    const { categoryId } = await params;
    const body = await req.json();
    const res = await backendFetch(`/admin/categories/${categoryId}`, {
      method: "PATCH",
      body,
      requireAuth: true,
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data);
  } catch {
    return NextResponse.json({ error: "Invalid category update payload" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: RouteProps) {
  const { categoryId } = await params;
  const res = await backendFetch(`/admin/categories/${categoryId}`, {
    method: "DELETE",
    requireAuth: true,
  });

  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: res.status });
  }

  return NextResponse.json(res.data);
}
