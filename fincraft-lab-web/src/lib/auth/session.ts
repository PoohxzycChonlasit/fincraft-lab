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

type MeResponseBody = {
  data?: UserProfile;
};

export async function getSessionUser(): Promise<UserProfile | null> {
  const res = await backendFetch("/auth/me", {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    return null;
  }

  const json = res.data as MeResponseBody;
  return json.data ?? null;
}
