import type { UserProfile } from "@/lib/auth/session";

export type ProfileUpdatePayload = {
  displayName: string;
  avatarUrl: string | null;
};

type ProfileApiSuccess = {
  success: true;
  data: UserProfile;
};

type ProfileApiFailure = {
  success: false;
  errorMessage: string;
  status: number;
};

export type ProfileApiResult = ProfileApiSuccess | ProfileApiFailure;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readProfile(value: unknown): UserProfile | null {
  if (!isRecord(value) || !isRecord(value.data)) return null;
  const user = value.data;
  if (
    typeof user.id !== "string" ||
    typeof user.email !== "string" ||
    typeof user.displayName !== "string" ||
    (user.avatarUrl !== null && typeof user.avatarUrl !== "string") ||
    typeof user.role !== "string" ||
    typeof user.status !== "string" ||
    typeof user.createdAt !== "string" ||
    typeof user.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function readProfileApiError(value: unknown, fallback: string): string {
  if (!isRecord(value)) return fallback;
  if (typeof value.error === "string" && value.error.trim()) return value.error;
  if (typeof value.message === "string" && value.message.trim()) return value.message;
  if (Array.isArray(value.message) && value.message.every((item) => typeof item === "string")) {
    return value.message.join(". ");
  }
  return fallback;
}

export async function updateProfileApi(payload: ProfileUpdatePayload): Promise<ProfileApiResult> {
  try {
    const response = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        errorMessage: readProfileApiError(body, "Profile could not be saved."),
      };
    }

    const data = readProfile(body);
    return data
      ? { success: true, data }
      : { success: false, status: response.status, errorMessage: "Profile response was invalid." };
  } catch {
    return { success: false, status: 0, errorMessage: "Network error while saving your profile." };
  }
}
