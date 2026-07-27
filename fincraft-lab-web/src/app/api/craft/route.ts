import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type CraftRequestBody = {
  inputElementIds?: unknown;
};

function parseErrorMessage(data: { message?: string | string[] }): string {
  if (Array.isArray(data.message)) return data.message.join(". ");
  return typeof data.message === "string" ? data.message : "Craft request failed";
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
    }

    const body = (await request.json()) as CraftRequestBody;
    const { inputElementIds } = body;

    if (!Array.isArray(inputElementIds) || inputElementIds.length !== 2) {
      return NextResponse.json({ error: "Exactly two element IDs are required" }, { status: 400 });
    }

    const [a, b] = inputElementIds as [string, string];
    if (a === b) {
      return NextResponse.json({ error: "Both input elements must be distinct" }, { status: 400 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/craft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ inputElementIds }),
    });

    if (backendRes.status === 401) {
      return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
    }

    if (!backendRes.ok) {
      const errorData = (await backendRes.json().catch(() => ({}))) as { message?: string | string[] };
      return NextResponse.json({ error: parseErrorMessage(errorData) }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Network or server error during craft" }, { status: 500 });
  }
}
