import type { PetProfile, PetSpecies } from "../types/pet.types";

export type PetMutationPayload = {
  name: string;
  species: PetSpecies;
  avatarUrl: string | null;
  personality: string | null;
  learningGoal: string | null;
};

type PetApiSuccess = { success: true; data: PetProfile };
type PetApiFailure = { success: false; errorMessage: string; status: number };
export type PetApiResult = PetApiSuccess | PetApiFailure;

const supportedSpecies: PetSpecies[] = ["CAT", "DOG", "RABBIT", "TURTLE", "BIRD"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPetSpecies(value: unknown): value is PetSpecies {
  return typeof value === "string" && supportedSpecies.some((species) => species === value);
}

function readPet(value: unknown): PetProfile | null {
  if (!isRecord(value) || !isRecord(value.data)) return null;
  const pet = value.data;
  if (
    typeof pet.id !== "string" ||
    typeof pet.name !== "string" ||
    !isPetSpecies(pet.species) ||
    (pet.avatarUrl !== null && typeof pet.avatarUrl !== "string") ||
    (pet.personality !== null && typeof pet.personality !== "string") ||
    (pet.learningGoal !== null && typeof pet.learningGoal !== "string") ||
    typeof pet.createdAt !== "string" ||
    typeof pet.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    avatarUrl: pet.avatarUrl,
    personality: pet.personality,
    learningGoal: pet.learningGoal,
    createdAt: pet.createdAt,
    updatedAt: pet.updatedAt,
  };
}

function readPetApiError(value: unknown, fallback: string): string {
  if (!isRecord(value)) return fallback;
  if (typeof value.error === "string" && value.error.trim()) return value.error;
  if (typeof value.message === "string" && value.message.trim()) return value.message;
  if (Array.isArray(value.message) && value.message.every((item) => typeof item === "string")) {
    return value.message.join(". ");
  }
  return fallback;
}

async function requestPet(path: string, method: "POST" | "PATCH", payload: PetMutationPayload, fallback: string): Promise<PetApiResult> {
  try {
    const response = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      return { success: false, status: response.status, errorMessage: readPetApiError(body, fallback) };
    }
    const data = readPet(body);
    return data
      ? { success: true, data }
      : { success: false, status: response.status, errorMessage: "Companion response was invalid." };
  } catch {
    return { success: false, status: 0, errorMessage: "Network error while saving your Companion." };
  }
}

export function createPetApi(payload: PetMutationPayload): Promise<PetApiResult> {
  return requestPet("/api/pets/me", "POST", payload, "Failed to create Companion.");
}

export function updatePetApi(payload: PetMutationPayload): Promise<PetApiResult> {
  return requestPet("/api/pets/me", "PATCH", payload, "Failed to update Companion.");
}
