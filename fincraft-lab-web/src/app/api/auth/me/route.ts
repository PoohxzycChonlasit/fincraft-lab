import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

export async function GET() {
  const res = await backendFetch("/auth/me", {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    return NextResponse.json({ error: "Session expired or invalid" }, { status: 401 });
  }

  return NextResponse.json(res.data);
}
