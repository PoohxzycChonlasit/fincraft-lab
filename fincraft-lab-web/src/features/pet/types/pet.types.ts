export type PetSpecies = "CAT" | "DOG" | "RABBIT" | "TURTLE" | "BIRD";

export type PetProfile = {
  id: string;
  name: string;
  species: PetSpecies;
  avatarUrl: string | null;
  personality: string | null;
  learningGoal: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SpeciesOption = {
  value: PetSpecies;
  label: string;
  emoji: string;
  description: string;
};

export const SPECIES_OPTIONS: SpeciesOption[] = [
  { value: "CAT", label: "Cat Companion", emoji: "🐱", description: "Curious, agile, and cautious with financial safety." },
  { value: "DOG", label: "Dog Companion", emoji: "🐶", description: "Loyal, energetic, and dedicated to achieving goals." },
  { value: "RABBIT", label: "Rabbit Companion", emoji: "🐰", description: "Quick-thinking, observant, and great at budget hops." },
  { value: "TURTLE", label: "Turtle Companion", emoji: "🐢", description: "Steady, patient, and focused on long-term compound growth." },
  { value: "BIRD", label: "Bird Companion", emoji: "🐦", description: "High-flying perspective on market discovery and trends." },
];

export function getSpeciesEmoji(species?: PetSpecies | null): string {
  const match = SPECIES_OPTIONS.find((s) => s.value === species);
  return match ? match.emoji : "🐾";
}

export function getSpeciesLabel(species?: PetSpecies | null): string {
  const match = SPECIES_OPTIONS.find((s) => s.value === species);
  return match ? match.label : "Financial Companion";
}
