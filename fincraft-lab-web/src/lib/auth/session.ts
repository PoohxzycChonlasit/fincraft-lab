import { backendFetch } from "@/lib/api/backend-fetch.server";

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUserProfile(value: unknown): value is UserProfile {
  return isRecord(value)
    && typeof value.id === "string"
    && typeof value.email === "string"
    && typeof value.displayName === "string"
    && (value.avatarUrl === null || typeof value.avatarUrl === "string")
    && typeof value.role === "string"
    && typeof value.status === "string"
    && typeof value.createdAt === "string"
    && typeof value.updatedAt === "string";
}

export async function getSessionUser(): Promise<UserProfile | null> {
  const res = await backendFetch("/auth/me", {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    return null;
  }

  if (!isRecord(res.data)) return null;
  return isUserProfile(res.data.data) ? res.data.data : null;
}
