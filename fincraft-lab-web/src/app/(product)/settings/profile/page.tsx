import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { ProfileForm } from "@/features/profile/components/profile-form";

export const metadata: Metadata = {
  title: "Profile Settings | FinCraft Lab",
  description: "View and manage your FinCraft Lab user profile settings.",
};

export default async function ProfileSettingsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your display name, profile avatar, and account identity preferences.
        </p>
      </div>

      <div className="flex justify-center sm:justify-start">
        <ProfileForm initialUser={user} />
      </div>
    </div>
  );
}
