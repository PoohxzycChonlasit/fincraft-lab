import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

export async function GET(
  _request: Request,
  props: { params: Promise<{ elementId: string }> },
) {
  try {
    const { elementId } = await props.params;
    if (!elementId) {
      return NextResponse.json({ error: "Element ID is required" }, { status: 400 });
    }

    const res = await backendFetch(`/elements/${encodeURIComponent(elementId)}/guidance`, {
      method: "GET",
      requireAuth: false,
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch element guidance" }, { status: 500 });
  }
}
