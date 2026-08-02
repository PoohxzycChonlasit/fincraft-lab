import Link from "next/link";
import { ArrowRight, Heart, PlusCircle, Sparkles } from "lucide-react";
import type { PetProfile } from "../types/pet.types";
import { getSpeciesLabel } from "../types/pet.types";
import { CompanionAvatar } from "./pet-header";

function ExistingPetWidget({ pet }: { pet: PetProfile }) {
  const goal = pet.learningGoal || "Exploring financial literacy";
  return (
    <section aria-label="Companion context" className="surface-card flex flex-col gap-3 rounded-2xl border border-(--border-subtle) p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3.5">
        <CompanionAvatar pet={pet} className="h-12 w-12 rounded-xl after:rounded-xl" />
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="truncate text-xs font-bold text-foreground">{pet.name}</h3>
            <span className="inline-flex items-center gap-1 rounded-full border border-(--border-subtle) bg-(--surface-inset) px-2 py-0.5 text-[10px] font-semibold text-foreground">
              <Heart aria-hidden="true" className="h-2.5 w-2.5 text-rose-500" />
              {getSpeciesLabel(pet.species)}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Focus: <span className="font-medium text-foreground">{goal}</span></p>
        </div>
      </div>
      <Link href="/settings/pet" className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-inset) px-3.5 text-xs font-semibold text-foreground transition-colors hover:bg-(--surface-raised)">
        <span>Manage Companion</span><ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}

function NoPetWidget() {
  return (
    <section aria-label="Companion context" className="surface-card flex flex-col gap-3 rounded-2xl border border-(--border-subtle) p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-inset) text-(--brand-accent)"><Sparkles aria-hidden="true" className="h-5 w-5" /></div>
        <div><h3 className="text-xs font-bold text-foreground">Create your Companion</h3><p className="text-[11px] text-muted-foreground">Pair with a Financial Companion to personalize your discovery lab experience.</p></div>
      </div>
      <Link href="/settings/pet" className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-(--color-action-primary) px-4 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-(--color-action-hover)"><PlusCircle aria-hidden="true" className="h-3.5 w-3.5" /><span>Create Companion</span></Link>
    </section>
  );
}

export function CompanionWidget({ pet }: { pet: PetProfile | null }) {
  return pet ? <ExistingPetWidget pet={pet} /> : <NoPetWidget />;
}
