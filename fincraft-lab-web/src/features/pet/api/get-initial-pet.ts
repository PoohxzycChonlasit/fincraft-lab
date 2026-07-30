import { backendFetch } from "@/lib/api/backend-fetch.server";
import type { PetProfile } from "../types/pet.types";

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export async function getInitialPet(): Promise<PetProfile | null> {
  const res = await backendFetch("/pets/me", {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    return null;
  }

  if (isRecord(res.data) && isRecord(res.data.data)) {
    return res.data.data as PetProfile;
  }

  return null;
}
