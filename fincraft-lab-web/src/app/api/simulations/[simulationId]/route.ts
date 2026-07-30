import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

type RouteProps = {
  params: Promise<{ simulationId: string }>;
};

export async function GET(_req: Request, { params }: RouteProps) {
  const { simulationId } = await params;
  const res = await backendFetch(`/simulations/${simulationId}`, {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: res.status });
  }

  return NextResponse.json(res.data);
}
