import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

export async function GET() {
  const res = await backendFetch("/admin/recipes", {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: res.status });
  }

  return NextResponse.json(res.data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await backendFetch("/admin/recipes", {
      method: "POST",
      body,
      requireAuth: true,
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid recipe payload" }, { status: 400 });
  }
}
