import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const backendRes = await fetch(`${BACKEND_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!backendRes.ok) {
      cookieStore.delete("access_token");
      return NextResponse.json({ error: "Session expired or invalid" }, { status: 401 });
    }

    const data = (await backendRes.json()) as { data: unknown };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Network error verifying session" }, { status: 500 });
  }
}
