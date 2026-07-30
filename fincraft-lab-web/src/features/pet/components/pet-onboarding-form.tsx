"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import type { PetProfile, PetSpecies } from "../types/pet.types";
import { SPECIES_OPTIONS } from "../types/pet.types";

function SpeciesGrid({
  selected,
  onSelect,
}: {
  selected: PetSpecies;
  onSelect: (s: PetSpecies) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-foreground">
        Choose Companion Species <span className="text-destructive">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {SPECIES_OPTIONS.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                isSelected
                  ? "border-[var(--brand-accent)] bg-[var(--surface-inset)] ring-2 ring-[var(--brand-accent)]"
                  : "border-[var(--border-subtle)] bg-[var(--surface-flat)] hover:bg-[var(--surface-inset)]"
              }`}
            >
              <span className="text-2xl select-none">{opt.emoji}</span>
              <div>
                <div className="text-xs font-bold text-foreground">{opt.label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{opt.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NameInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Penny, Finny, Barnaby"
        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]"
      />
    </div>
  );
}

function GoalInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="learningGoal" className="block text-xs font-semibold text-foreground">
        Learning Focus / Goal
      </label>
      <input
        id="learningGoal"
        type="text"
        maxLength={200}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Build emergency savings, Understand interest rates"
        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]"
      />
    </div>
  );
}

export function PetOnboardingForm({
  onCreated,
}: {
  onCreated: (pet: PetProfile) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [species, setSpecies] = useState<PetSpecies>("CAT");
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
  const [learningGoal, setLearningGoal] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Please enter a Companion name.");
      return;
    }
    setErrorMsg(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/pets/me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            species,
            personality: personality.trim() || null,
            learningGoal: learningGoal.trim() || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || "Failed to create Companion.");
          return;
        }
        onCreated(data.data);
      } catch {
        setErrorMsg("Network error connecting to server.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg ? (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : null}

      <SpeciesGrid selected={species} onSelect={setSpecies} />
      <NameInput value={name} onChange={setName} />
      
      <div className="space-y-1.5">
        <label htmlFor="personality" className="block text-xs font-semibold text-foreground">
          Personality Trait (Optional)
        </label>
        <input
          id="personality"
          type="text"
          maxLength={200}
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          placeholder="e.g. Cautious saver, Energetic budgeter"
          className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]"
        />
      </div>

      <GoalInput value={learningGoal} onChange={setLearningGoal} />

      <button
        type="submit"
        disabled={isPending}
        className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--color-action-hover)] transition-colors disabled:opacity-50"
      >
        {isPending ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Creating Companion...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Create Companion</span>
          </>
        )}
      </button>
    </form>
  );
}
