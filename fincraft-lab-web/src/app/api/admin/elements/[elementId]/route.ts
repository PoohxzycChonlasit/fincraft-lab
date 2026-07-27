import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function parseErrorMessage(data: { message?: string | string[] }): string {
  if (Array.isArray(data.message)) return data.message.join(". ");
  return typeof data.message === "string" ? data.message : "Request failed";
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ elementId: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
    }

    const { elementId } = await params;
    if (!elementId) {
      return NextResponse.json({ error: "Element ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/admin/elements/${elementId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = (await res.json().catch(() => ({}))) as { message?: string | string[] };
      return NextResponse.json({ error: parseErrorMessage(errorData) }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Network error updating admin element" }, { status: 500 });
  }
}
