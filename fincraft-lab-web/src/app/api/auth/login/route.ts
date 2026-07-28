import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readLoginResponse(value: unknown): { accessToken?: string; user?: unknown } {
  if (!isRecord(value)) return {};
  const nested = isRecord(value.data) ? value.data : null;
  const accessToken = typeof value.accessToken === "string"
    ? value.accessToken
    : typeof nested?.accessToken === "string" ? nested.accessToken : undefined;
  const user = "user" in value ? value.user : nested?.user;
  return { accessToken, user };
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const email = isRecord(body) && typeof body.email === "string" ? body.email : undefined;
    const password = isRecord(body) && typeof body.password === "string" ? body.password : undefined;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const res = await backendFetch("/auth/login", {
      method: "POST",
      body: { email, password },
      requireAuth: false,
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error || "Invalid email or password" }, { status: res.status });
    }

    const { accessToken, user } = readLoginResponse(res.data);

    if (!accessToken) {
      return NextResponse.json({ error: "Invalid response from auth server" }, { status: 500 });
    }

    const cookieStore = await cookies();
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ data: { user } });
  } catch {
    return NextResponse.json({ error: "Network or server error during authentication" }, { status: 500 });
  }
}
