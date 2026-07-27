import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

type CraftRequestBody = {
  inputElementIds?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CraftRequestBody;
    const { inputElementIds } = body;

    if (!Array.isArray(inputElementIds) || inputElementIds.length !== 2) {
      return NextResponse.json({ error: "Exactly two element IDs are required" }, { status: 400 });
    }

    const [a, b] = inputElementIds as [string, string];
    if (a === b) {
      return NextResponse.json({ error: "Both input elements must be distinct" }, { status: 400 });
    }

    const res = await backendFetch("/craft", {
      method: "POST",
      body: { inputElementIds },
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data);
  } catch {
    return NextResponse.json({ error: "Network or server error during craft" }, { status: 500 });
  }
}
