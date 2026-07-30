import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch.server";

type RouteProps = {
  params: Promise<{ runId: string }>;
};

export async function GET(_req: Request, { params }: RouteProps) {
  const { runId } = await params;
  const res = await backendFetch(`/simulation-runs/${runId}`, {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: res.status });
  }

  return NextResponse.json(res.data);
}
