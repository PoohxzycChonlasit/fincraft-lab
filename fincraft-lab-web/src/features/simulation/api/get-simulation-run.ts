import { backendFetch } from "@/lib/api/backend-fetch.server";
import type { SimulationRunResult } from "../types/simulation.types";

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export async function getSimulationRun(
  runId: string,
): Promise<SimulationRunResult | null> {
  const res = await backendFetch(`/simulation-runs/${runId}`, {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    return null;
  }

  if (isRecord(res.data) && isRecord(res.data.data)) {
    return res.data.data as SimulationRunResult;
  }

  return null;
}
