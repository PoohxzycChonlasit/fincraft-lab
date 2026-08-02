"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { PetProfile } from "../types/pet.types";
import { PetEditForm } from "./pet-edit-form";
import { PetHeader } from "./pet-header";
import { PetOnboardingForm } from "./pet-onboarding-form";

function OnboardingCard({ onCreated }: { onCreated: (pet: PetProfile) => void }) {
  return (
    <div className="surface-card w-full max-w-2xl space-y-6 rounded-2xl border border-(--border-subtle) p-5 shadow-sm sm:p-7">
      <div className="space-y-2 border-b border-(--border-subtle) pb-5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-(--border-subtle) bg-(--surface-inset) px-3 py-1 text-xs font-semibold text-foreground"><Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-(--brand-accent)" /><span>Companion onboarding</span></div>
        <h2 className="text-xl font-bold text-foreground">Meet your Financial Companion</h2>
        <p className="text-xs leading-relaxed text-muted-foreground">Choose one supported species, name your learning partner, and set the focus that should shape its welcome message.</p>
      </div>
      <PetOnboardingForm onCreated={onCreated} />
    </div>
  );
}

function ExistingPetCard({ pet, onUpdated }: { pet: PetProfile; onUpdated: (pet: PetProfile) => void }) {
  return (
    <div className="surface-card w-full max-w-2xl space-y-6 rounded-2xl border border-(--border-subtle) p-5 shadow-sm sm:p-7">
      <PetHeader pet={pet} />
      <div className="space-y-3"><h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Edit Companion Details</h3><PetEditForm pet={pet} onUpdated={onUpdated} /></div>
    </div>
  );
}

export function PetPageClient({ initialPet }: { initialPet: PetProfile | null }) {
  const router = useRouter();
  const [pet, setPet] = useState<PetProfile | null>(initialPet);
  const handleCreated = (created: PetProfile) => { setPet(created); router.refresh(); };
  const handleUpdated = (updated: PetProfile) => { setPet(updated); router.refresh(); };

  return (
    <div data-document-page="companion" className="w-full">
      {pet ? <ExistingPetCard pet={pet} onUpdated={handleUpdated} /> : <OnboardingCard onCreated={handleCreated} />}
    </div>
  );
}
