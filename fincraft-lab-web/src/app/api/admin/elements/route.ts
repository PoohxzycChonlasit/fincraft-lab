import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

export async function GET() {
  const res = await backendFetch("/admin/elements", {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: res.status });
  }

  return NextResponse.json(res.data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await backendFetch("/admin/elements", {
      method: "POST",
      body,
      requireAuth: true,
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Network error creating admin element" }, { status: 500 });
  }
}
