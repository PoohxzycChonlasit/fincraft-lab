import { Sparkles, Heart } from "lucide-react";
import type { PetProfile } from "../types/pet.types";
import { getSpeciesEmoji, getSpeciesLabel } from "../types/pet.types";

function AvatarImage({ pet }: { pet: PetProfile }) {
  const emoji = getSpeciesEmoji(pet.species);
  if (pet.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={pet.avatarUrl}
        alt={`${pet.name}'s avatar`}
        className="h-full w-full object-cover"
        onError={(e) => {
          (e.target as HTMLElement).style.display = "none";
        }}
      />
    );
  }
  return <span className="text-3xl select-none">{emoji}</span>;
}

function WelcomeBanner({ pet }: { pet: PetProfile }) {
  const goal = pet.learningGoal || "financial literacy discovery";
  return (
    <div className="surface-paper flex items-center gap-2.5 rounded-xl border border-[var(--border-subtle)] p-3 text-xs text-foreground">
      <Sparkles className="h-4 w-4 shrink-0 text-[var(--accent-orange)]" />
      <span>
        <strong>{pet.name}</strong> is ready to help you explore {goal}.
      </span>
    </div>
  );
}

export function PetHeader({ pet }: { pet: PetProfile }) {
  return (
    <div className="space-y-4 border-b border-[var(--border-subtle)] pb-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-solid)] overflow-hidden shadow-xs">
            <AvatarImage pet={pet} />
          </div>
          <div>
            <h2 className="font-section-title text-foreground">{pet.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-solid)] px-2.5 py-0.5 text-xs font-bold text-foreground border border-[var(--border-subtle)]">
                <Heart className="h-3 w-3 text-rose-500" />
                {getSpeciesLabel(pet.species)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <WelcomeBanner pet={pet} />
    </div>
  );
}
