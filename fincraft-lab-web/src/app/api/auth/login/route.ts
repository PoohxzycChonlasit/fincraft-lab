import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!backendRes.ok) {
      const errorData = (await backendRes.json().catch(() => ({}))) as { message?: string };
      return NextResponse.json(
        { error: errorData.message || "Invalid email or password" },
        { status: backendRes.status }
      );
    }

    const data = (await backendRes.json()) as {
      data?: { user: unknown; accessToken: string };
    };

    const accessToken = data.data?.accessToken;
    const user = data.data?.user;

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
