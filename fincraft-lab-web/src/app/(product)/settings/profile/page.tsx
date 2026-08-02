import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, User } from "lucide-react";

import { getSessionUser } from "@/lib/auth/session";
import { ProfileForm } from "@/features/profile/components/profile-form";

export const metadata: Metadata = {
  title: "Profile Settings | FinCraft Lab",
  description: "View and manage your FinCraft Lab user profile settings.",
};

function SettingsSubNav({ activeTab }: { activeTab: "profile" | "pet" }) {
  return (
    <nav aria-label="Settings sub-navigation" className="flex items-center gap-4 border-b border-(--border-subtle) pb-2 mb-6">
      <Link
        href="/settings/profile"
        className={`inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-xs font-bold transition-colors ${
          activeTab === "profile"
            ? "text-(--accent-orange) border-b-2 border-(--accent-orange)"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <User size={15} aria-hidden="true" />
        <span>Profile Settings</span>
      </Link>
      <Link
        href="/settings/pet"
        className={`inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-xs font-bold transition-colors ${
          activeTab === "pet"
            ? "text-(--accent-orange) border-b-2 border-(--accent-orange)"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Heart size={15} aria-hidden="true" />
        <span>Financial Companion</span>
      </Link>
    </nav>
  );
}

export default async function ProfileSettingsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SettingsSubNav activeTab="profile" />

      <header className="space-y-1">
        <h1 className="font-page-title text-foreground">Profile Settings</h1>
        <p className="font-body-small text-muted-foreground">
          Manage your display identity, avatar, and read-only account credentials.
        </p>
      </header>

      <div className="flex justify-center sm:justify-start">
        <ProfileForm initialUser={user} />
      </div>
    </div>
  );
}
