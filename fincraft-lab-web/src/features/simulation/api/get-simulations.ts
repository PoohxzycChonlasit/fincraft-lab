import { backendFetch } from "@/lib/api/backend-fetch.server";
import type { SimulationSummary } from "../types/simulation.types";

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export async function getSimulations(): Promise<SimulationSummary[]> {
  const res = await backendFetch("/simulations", {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  if (isRecord(res.data) && Array.isArray(res.data.data)) {
    return res.data.data as SimulationSummary[];
  }

  throw new Error("Simulation list response was not valid.");
}
