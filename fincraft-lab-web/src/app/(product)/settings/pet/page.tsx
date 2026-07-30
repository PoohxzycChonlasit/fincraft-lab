import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getInitialPet } from "@/features/pet/api/get-initial-pet";
import { PetPageClient } from "@/features/pet/components/pet-page-client";

export const metadata: Metadata = {
  title: "Financial Companion | FinCraft Lab",
  description: "Manage your financial companion pet profile.",
};

export default async function PetSettingsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?returnTo=/settings/pet");
  }

  const initialPet = await getInitialPet();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-accent)]">
          Pet Profile
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Financial Companion
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Your learning discovery partner in FinCraft Lab.
        </p>
      </div>

      <PetPageClient initialPet={initialPet} />
    </div>
  );
}
