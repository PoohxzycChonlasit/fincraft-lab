import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

export async function GET() {
  const res = await backendFetch("/simulations", {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: res.status });
  }

  return NextResponse.json(res.data);
}
