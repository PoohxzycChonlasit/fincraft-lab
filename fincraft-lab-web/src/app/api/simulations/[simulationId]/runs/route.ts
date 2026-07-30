import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

type RouteProps = {
  params: Promise<{ simulationId: string }>;
};

export async function POST(req: Request, { params }: RouteProps) {
  try {
    const { simulationId } = await params;
    const body = await req.json();
    const res = await backendFetch(`/simulations/${simulationId}/runs`, {
      method: "POST",
      body,
      requireAuth: true,
    });

    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
