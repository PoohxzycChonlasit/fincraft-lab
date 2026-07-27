import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

type LoginRequestBody = {
  email?: string;
  password?: string;
};

type LoginResponseBody = {
  user?: unknown;
  accessToken?: string;
  data?: {
    user?: unknown;
    accessToken?: string;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequestBody;
    const { email, password } = body;

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

    const json = res.data as LoginResponseBody;
    const accessToken = json.accessToken ?? json.data?.accessToken;
    const user = json.user ?? json.data?.user;

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
