import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

type RegisterRequestBody = {
  displayName?: string;
  email?: string;
  password?: string;
};

type RegisterResponseBody = {
  data?: {
    user?: unknown;
    accessToken?: string;
  };
};

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

    const res = await backendFetch("/auth/register", {
      method: "POST",
      body: { displayName, email, password },
      requireAuth: false,
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error || "Registration failed" }, { status: res.status });
    }

    const json = res.data as RegisterResponseBody;
    const user = json.data?.user ?? json.data;
    if (json.data?.accessToken) {
      await setSessionCookie(json.data.accessToken);
    }

    return NextResponse.json({ data: { user } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Network or server error during registration" }, { status: 500 });
  }
}
