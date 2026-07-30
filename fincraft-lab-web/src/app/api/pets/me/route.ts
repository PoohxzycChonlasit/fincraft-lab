import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

export async function GET() {
  const res = await backendFetch("/pets/me", {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    if (res.status === 404) {
      return NextResponse.json({ data: null }, { status: 200 });
    }
    return NextResponse.json({ error: res.error }, { status: res.status });
  }

  return NextResponse.json(res.data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await backendFetch("/pets", {
      method: "POST",
      body,
      requireAuth: true,
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const res = await backendFetch("/pets/me", {
      method: "PATCH",
      body,
      requireAuth: true,
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data);
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
