import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, User } from "lucide-react";

import { getSessionUser } from "@/lib/auth/session";
import { getInitialPet } from "@/features/pet/api/get-initial-pet";
import { PetPageClient } from "@/features/pet/components/pet-page-client";

export const metadata: Metadata = {
  title: "Financial Companion | FinCraft Lab",
  description: "Manage your financial companion pet profile.",
};

function SettingsSubNav({ activeTab }: { activeTab: "profile" | "pet" }) {
  return (
    <nav aria-label="Settings sub-navigation" className="flex items-center gap-4 border-b border-[var(--border-subtle)] pb-2 mb-6">
      <Link
        href="/settings/profile"
        className={`inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-xs font-bold transition-colors ${
          activeTab === "profile"
            ? "text-[var(--accent-orange)] border-b-2 border-[var(--accent-orange)]"
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
            ? "text-[var(--accent-orange)] border-b-2 border-[var(--accent-orange)]"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Heart size={15} aria-hidden="true" />
        <span>Financial Companion</span>
      </Link>
    </nav>
  );
}

export default async function PetSettingsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?returnTo=/settings/pet");
  }

  const initialPet = await getInitialPet();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SettingsSubNav activeTab="pet" />

      <header className="space-y-1">
        <h1 className="font-page-title text-foreground">Financial Companion</h1>
        <p className="font-body-small text-muted-foreground">
          Your personal learning partner in FinCraft Lab.
        </p>
      </header>

      <PetPageClient initialPet={initialPet} />
    </div>
  );
}
