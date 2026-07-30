"use client";

import { useState, useTransition, type FormEvent } from "react";
import { RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import type { PetProfile, PetSpecies } from "../types/pet.types";
import { SPECIES_OPTIONS } from "../types/pet.types";

function FormActions({ isPending, onReset }: { isPending: boolean; onReset: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
      <button
        type="button"
        onClick={onReset}
        disabled={isPending}
        className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-4 text-xs font-semibold text-foreground hover:bg-[var(--surface-raised)] transition-colors disabled:opacity-50"
      >
        Reset
      </button>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--color-action-hover)] transition-colors disabled:opacity-50"
      >
        {isPending ? (
          <>
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </div>
  );
}

function SpeciesSelect({ value, onChange }: { value: PetSpecies; onChange: (val: PetSpecies) => void }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="species" className="block text-xs font-semibold text-foreground">Species</label>
      <select
        id="species"
        value={value}
        onChange={(e) => onChange(e.target.value as PetSpecies)}
        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]"
      >
        {SPECIES_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.emoji} {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FormFeedback({ errorMsg, successMsg }: { errorMsg: string | null; successMsg: string | null }) {
  if (errorMsg) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{errorMsg}</span>
      </div>
    );
  }
  if (successMsg) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>{successMsg}</span>
      </div>
    );
  }
  return null;
}

function submitPetUpdate(
  payload: { name: string; species: PetSpecies; avatarUrl: string; personality: string; learningGoal: string },
  onSuccess: (pet: PetProfile) => void,
  onError: (err: string) => void,
) {
  fetch("/api/pets/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name.trim(),
      species: payload.species,
      avatarUrl: payload.avatarUrl.trim() === "" ? null : payload.avatarUrl.trim(),
      personality: payload.personality.trim() === "" ? null : payload.personality.trim(),
      learningGoal: payload.learningGoal.trim() === "" ? null : payload.learningGoal.trim(),
    }),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || "Failed to update Companion.");
      } else {
        onSuccess(data.data);
      }
    })
    .catch(() => onError("Network error connecting to server."));
}

function usePetEditFormState(initialPet: PetProfile, onUpdated: (pet: PetProfile) => void) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialPet.name);
  const [species, setSpecies] = useState<PetSpecies>(initialPet.species);
  const [avatarUrl, setAvatarUrl] = useState(initialPet.avatarUrl || "");
  const [personality, setPersonality] = useState(initialPet.personality || "");
  const [learningGoal, setLearningGoal] = useState(initialPet.learningGoal || "");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Companion name cannot be empty.");
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(() => {
      submitPetUpdate(
        { name, species, avatarUrl, personality, learningGoal },
        (updated) => {
          setSuccessMsg("Companion profile updated successfully!");
          onUpdated(updated);
        },
        setErrorMsg,
      );
    });
  };

  const handleReset = () => {
    setName(initialPet.name);
    setSpecies(initialPet.species);
    setAvatarUrl(initialPet.avatarUrl || "");
    setPersonality(initialPet.personality || "");
    setLearningGoal(initialPet.learningGoal || "");
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return { name, setName, species, setSpecies, avatarUrl, setAvatarUrl, personality, setPersonality, learningGoal, setLearningGoal, errorMsg, successMsg, isPending, handleSubmit, handleReset };
}

export function PetEditForm({ pet, onUpdated }: { pet: PetProfile; onUpdated: (pet: PetProfile) => void }) {
  const form = usePetEditFormState(pet, onUpdated);

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <FormFeedback errorMsg={form.errorMsg} successMsg={form.successMsg} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-xs font-semibold text-foreground">
            Companion Name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            minLength={1}
            maxLength={50}
            value={form.name}
            onChange={(e) => form.setName(e.target.value)}
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]"
          />
        </div>
        <SpeciesSelect value={form.species} onChange={form.setSpecies} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="avatarUrl" className="block text-xs font-semibold text-foreground">Avatar Image URL (Optional)</label>
        <input
          id="avatarUrl"
          type="url"
          maxLength={2048}
          value={form.avatarUrl}
          onChange={(e) => form.setAvatarUrl(e.target.value)}
          placeholder="https://example.com/avatar.png"
          className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="personality" className="block text-xs font-semibold text-foreground">Personality Trait (Optional)</label>
        <input
          id="personality"
          type="text"
          maxLength={200}
          value={form.personality}
          onChange={(e) => form.setPersonality(e.target.value)}
          placeholder="e.g. Cautious saver"
          className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="learningGoal" className="block text-xs font-semibold text-foreground">Learning Focus / Goal (Optional)</label>
        <input
          id="learningGoal"
          type="text"
          maxLength={200}
          value={form.learningGoal}
          onChange={(e) => form.setLearningGoal(e.target.value)}
          placeholder="e.g. Master compound interest"
          className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]"
        />
      </div>

      <FormActions isPending={form.isPending} onReset={form.handleReset} />
    </form>
  );
}
