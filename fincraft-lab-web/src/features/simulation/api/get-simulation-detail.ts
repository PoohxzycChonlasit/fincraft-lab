import { backendFetch } from "@/lib/api/backend-fetch.server";
import type { SimulationDetail } from "../types/simulation.types";

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export async function getSimulationDetail(
  simulationId: string,
): Promise<SimulationDetail | null> {
  const res = await backendFetch(`/simulations/${simulationId}`, {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    return null;
  }

  if (isRecord(res.data) && isRecord(res.data.data)) {
    return res.data.data as SimulationDetail;
  }

  return null;
}
