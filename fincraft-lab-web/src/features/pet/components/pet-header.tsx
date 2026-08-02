import { Bird, Cat, Dog, Heart, Rabbit, Sparkles, Turtle, type LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PetProfile, PetSpecies } from "../types/pet.types";
import { getSpeciesLabel } from "../types/pet.types";

export type CompanionAvatarData = Pick<PetProfile, "name" | "species" | "avatarUrl">;

const speciesIcons: Record<PetSpecies, LucideIcon> = { CAT: Cat, DOG: Dog, RABBIT: Rabbit, TURTLE: Turtle, BIRD: Bird };

export function SpeciesIcon({ species, className }: { species: PetSpecies; className?: string }) {
  const Icon = speciesIcons[species];
  return <Icon aria-hidden="true" className={className} />;
}

export function CompanionAvatar({ pet, className = "" }: { pet: CompanionAvatarData; className?: string }) {
  return (
    <Avatar className={`h-16 w-16 rounded-2xl after:rounded-2xl ${className}`}>
      <AvatarImage src={pet.avatarUrl || undefined} alt={`${pet.name || "Companion"} avatar`} className="rounded-2xl" />
      <AvatarFallback className="rounded-2xl bg-(--surface-inset) text-(--brand-primary)">
        <SpeciesIcon species={pet.species} className="h-7 w-7" />
      </AvatarFallback>
    </Avatar>
  );
}

function WelcomeBanner({ pet }: { pet: PetProfile }) {
  const goal = pet.learningGoal || "financial literacy discovery";
  return (
    <div className="surface-paper flex items-start gap-2.5 rounded-xl border border-(--border-subtle) p-3 text-xs text-foreground">
      <Sparkles aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-(--accent-orange)" />
      <span><strong>{pet.name}</strong> is ready to help you explore {goal}.</span>
    </div>
  );
}

export function PetHeader({ pet }: { pet: PetProfile }) {
  return (
    <div className="space-y-4 border-b border-(--border-subtle) pb-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <CompanionAvatar pet={pet} />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-foreground">{pet.name}</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-(--border-subtle) bg-(--surface-solid) px-2.5 py-0.5 text-xs font-bold text-foreground">
                <Heart aria-hidden="true" className="h-3 w-3 text-rose-500" />
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
