"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { PetProfile } from "../types/pet.types";
import { PetHeader } from "./pet-header";
import { PetOnboardingForm } from "./pet-onboarding-form";
import { PetEditForm } from "./pet-edit-form";

function OnboardingCard({ onCreated }: { onCreated: (pet: PetProfile) => void }) {
  return (
    <div className="surface-card w-full max-w-2xl rounded-2xl border border-[var(--border-subtle)] p-5 sm:p-7 shadow-sm space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-5 space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-inset)] px-3 py-1 text-xs font-semibold text-foreground border border-[var(--border-subtle)]">
          <Sparkles className="h-3.5 w-3.5 text-[var(--brand-accent)]" />
          <span>Financial Companion Onboarding</span>
        </div>
        <h2 className="text-xl font-bold text-foreground">Meet Your Financial Companion</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Create a personalized Financial Companion to encourage and guide your financial literacy discovery in FinCraft Lab. Choose a species and give your companion a name to get started.
        </p>
      </div>

      <PetOnboardingForm onCreated={onCreated} />
    </div>
  );
}

function ExistingPetCard({
  pet,
  onUpdated,
}: {
  pet: PetProfile;
  onUpdated: (updated: PetProfile) => void;
}) {
  return (
    <div className="surface-card w-full max-w-2xl rounded-2xl border border-[var(--border-subtle)] p-5 sm:p-7 shadow-sm space-y-6">
      <PetHeader pet={pet} />

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Edit Companion Details
        </h3>
        <PetEditForm pet={pet} onUpdated={onUpdated} />
      </div>
    </div>
  );
}

export function PetPageClient({ initialPet }: { initialPet: PetProfile | null }) {
  const router = useRouter();
  const [pet, setPet] = useState<PetProfile | null>(initialPet);

  const handleCreated = (newPet: PetProfile) => {
    setPet(newPet);
    router.refresh();
  };

  const handleUpdated = (updatedPet: PetProfile) => {
    setPet(updatedPet);
    router.refresh();
  };

  if (!pet) {
    return <OnboardingCard onCreated={handleCreated} />;
  }

  return <ExistingPetCard pet={pet} onUpdated={handleUpdated} />;
}
