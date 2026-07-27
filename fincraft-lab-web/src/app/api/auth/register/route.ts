import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type RegisterRequestBody = {
  displayName?: string;
  email?: string;
  password?: string;
};

function parseBackendError(errorData: { message?: string | string[] }): string {
  if (Array.isArray(errorData.message)) {
    return errorData.message.join(". ");
  }
  return typeof errorData.message === "string" ? errorData.message : "Registration failed";
}

async function setSessionCookie(accessToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterRequestBody;
    const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = body.password;

    if (!displayName) return NextResponse.json({ error: "Display name is required" }, { status: 400 });
    if (!email) return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, email, password }),
    });

    if (!backendRes.ok) {
      const errorData = (await backendRes.json().catch(() => ({}))) as { message?: string | string[] };
      return NextResponse.json({ error: parseBackendError(errorData) }, { status: backendRes.status });
    }

    const data = (await backendRes.json()) as { data?: { user?: unknown; accessToken?: string } };
    const user = data.data?.user ?? data.data;
    if (data.data?.accessToken) {
      await setSessionCookie(data.data.accessToken);
    }

    return NextResponse.json({ data: { user } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Network or server error during registration" }, { status: 500 });
  }
}
