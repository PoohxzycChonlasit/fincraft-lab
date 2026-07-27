import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

function isDistinctElementPair(value: unknown): value is [string, string] {
  return Array.isArray(value)
    && value.length === 2
    && value.every((item): item is string => typeof item === "string")
    && value[0] !== value[1];
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const inputElementIds = typeof body === "object" && body !== null && "inputElementIds" in body
      ? body.inputElementIds
      : undefined;

    if (!isDistinctElementPair(inputElementIds)) {
      return NextResponse.json({ error: "Exactly two distinct element IDs are required" }, { status: 400 });
    }

    const res = await backendFetch("/craft/preview", {
      method: "POST",
      body: { inputElementIds },
      requireAuth: false,
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data);
  } catch {
    return NextResponse.json({ error: "Network or server error during craft preview" }, { status: 500 });
  }
}
