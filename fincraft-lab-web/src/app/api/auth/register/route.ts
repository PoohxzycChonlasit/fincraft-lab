import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const displayName = typeof body === "object" && body !== null && "displayName" in body && typeof body.displayName === "string"
      ? body.displayName.trim()
      : "";
    const email = typeof body === "object" && body !== null && "email" in body && typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";
    const password = typeof body === "object" && body !== null && "password" in body && typeof body.password === "string"
      ? body.password
      : "";

    if (!displayName) return NextResponse.json({ error: "Display name is required" }, { status: 400 });
    if (!email) return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const res = await backendFetch("/auth/register", {
      method: "POST",
      body: { displayName, email, password },
      requireAuth: false,
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error || "Registration failed" }, { status: res.status });
    }

    return NextResponse.json(res.data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Network or server error during registration" }, { status: 500 });
  }
}
