import Link from "next/link";
import { Heart, Sparkles, PlusCircle, ArrowRight } from "lucide-react";
import type { PetProfile } from "../types/pet.types";
import { getSpeciesEmoji, getSpeciesLabel } from "../types/pet.types";

function ExistingPetWidget({ pet }: { pet: PetProfile }) {
  const emoji = getSpeciesEmoji(pet.species);
  const goal = pet.learningGoal || "Exploring financial literacy";

  return (
    <div className="surface-card flex flex-col gap-3 rounded-2xl border border-[var(--border-subtle)] p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] overflow-hidden">
          {pet.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pet.avatarUrl}
              alt={`${pet.name}'s avatar`}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <span className="text-2xl select-none">{emoji}</span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-foreground truncate">{pet.name}</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-inset)] px-2 py-0.5 text-[10px] font-semibold text-foreground border border-[var(--border-subtle)]">
              <Heart className="h-2.5 w-2.5 text-rose-500" />
              {getSpeciesLabel(pet.species)}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
            Focus: <span className="text-foreground font-medium">{goal}</span>
          </p>
        </div>
      </div>

      <Link
        href="/settings/pet"
        className="inline-flex min-h-[36px] shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-3.5 text-xs font-semibold text-foreground hover:bg-[var(--surface-raised)] transition-colors"
      >
        <span>Manage Companion</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function NoPetWidget() {
  return (
    <div className="surface-card flex flex-col gap-3 rounded-2xl border border-[var(--border-subtle)] p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-inset)] text-[var(--brand-accent)] border border-[var(--border-subtle)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-foreground">Create your Companion</h3>
          <p className="text-[11px] text-muted-foreground">
            Pair with a Financial Companion to personalize your discovery lab experience.
          </p>
        </div>
      </div>

      <Link
        href="/settings/pet"
        className="inline-flex min-h-[36px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[var(--color-action-primary)] px-4 text-xs font-semibold text-white hover:bg-[var(--color-action-hover)] transition-colors shadow-xs"
      >
        <PlusCircle className="h-3.5 w-3.5" />
        <span>Create Companion</span>
      </Link>
    </div>
  );
}

export function CompanionWidget({ pet }: { pet: PetProfile | null }) {
  if (pet) {
    return <ExistingPetWidget pet={pet} />;
  }
  return <NoPetWidget />;
}
