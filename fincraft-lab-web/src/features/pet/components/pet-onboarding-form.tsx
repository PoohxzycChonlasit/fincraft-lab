"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import type { PetProfile, PetSpecies } from "../types/pet.types";
import { SPECIES_OPTIONS } from "../types/pet.types";
import { createPetApi } from "../api/pet.client";
import { CompanionAvatar, SpeciesIcon } from "./pet-header";

type FieldErrors = { name?: string; avatarUrl?: string };

function validate(name: string, avatarUrl: string): FieldErrors {
  const errors: FieldErrors = {};
  const trimmedName = name.trim();
  const trimmedAvatar = avatarUrl.trim();
  if (trimmedName.length < 1 || trimmedName.length > 50) errors.name = "Companion name must be between 1 and 50 characters.";
  if (trimmedAvatar.length > 2048) errors.avatarUrl = "Avatar URL must not exceed 2048 characters.";
  else if (trimmedAvatar) {
    try {
      const url = new URL(trimmedAvatar);
      if (url.protocol !== "http:" && url.protocol !== "https:") errors.avatarUrl = "Avatar URL must start with http:// or https://.";
    } catch { errors.avatarUrl = "Please enter a valid absolute HTTP or HTTPS URL."; }
  }
  return errors;
}

function Feedback({ message }: { message: string | null }) {
  return message ? <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive"><AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /><span>{message}</span></div> : null;
}

function SpeciesGrid({ selected, onSelect, disabled }: { selected: PetSpecies; onSelect: (species: PetSpecies) => void; disabled: boolean }) {
  return (
    <fieldset disabled={disabled} className="space-y-2">
      <legend className="block text-xs font-semibold text-foreground">Choose Companion Species <span className="text-destructive">*</span></legend>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SPECIES_OPTIONS.map((option) => {
          const isSelected = selected === option.value;
          return <button key={option.value} type="button" aria-pressed={isSelected} onClick={() => onSelect(option.value)} className={`flex min-h-[68px] items-start gap-3 rounded-xl border p-3 text-left transition-colors ${isSelected ? "border-[var(--brand-accent)] bg-[var(--surface-inset)] ring-2 ring-[var(--brand-accent)]" : "border-[var(--border-subtle)] bg-[var(--surface-flat)] hover:bg-[var(--surface-inset)]"}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-solid)] text-[var(--brand-primary)]"><SpeciesIcon species={option.value} className="h-5 w-5" /></span><span><span className="block text-xs font-bold text-foreground">{option.label}</span><span className="mt-0.5 block text-[11px] text-muted-foreground">{option.description}</span></span></button>;
        })}
      </div>
    </fieldset>
  );
}

function Field({ id, label, value, onChange, error, hint, placeholder, type = "text", maxLength = 200 }: { id: string; label: string; value: string; onChange: (value: string) => void; error?: string; hint?: string; placeholder: string; type?: "text" | "url"; maxLength?: number }) {
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  return <div className="space-y-1.5"><label htmlFor={id} className="block text-xs font-semibold text-foreground">{label}</label><input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : helpId} className={`min-h-[44px] w-full rounded-xl border bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${error ? "border-destructive focus-visible:ring-destructive" : "border-[var(--border-subtle)] focus-visible:border-[var(--brand-accent)]"}`} />{(error || hint) && <p id={error ? errorId : helpId} className={`text-[11px] ${error ? "font-medium text-destructive" : "text-muted-foreground"}`}>{error || hint}</p>}</div>;
}

function useOnboardingState(onCreated: (pet: PetProfile) => void) {
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitGuard = useRef(false);
  const [species, setSpecies] = useState<PetSpecies>("CAT");
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [personality, setPersonality] = useState("");
  const [learningGoal, setLearningGoal] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const isBusy = isPending || isSubmitting;
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitGuard.current || isBusy) return;
    const errors = validate(name, avatarUrl);
    setFieldErrors(errors);
    setErrorMsg(null);
    if (Object.keys(errors).length > 0) return;
    submitGuard.current = true;
    setIsSubmitting(true);
    startTransition(async () => {
      try {
        const result = await createPetApi({ name: name.trim(), species, avatarUrl: avatarUrl.trim() || null, personality: personality.trim() || null, learningGoal: learningGoal.trim() || null });
        if (result.success) onCreated(result.data);
        else setErrorMsg(result.errorMessage);
      } finally {
        setIsSubmitting(false);
        submitGuard.current = false;
      }
    });
  };
  return { species, setSpecies, name, setName, avatarUrl, setAvatarUrl, personality, setPersonality, learningGoal, setLearningGoal, fieldErrors, setFieldErrors, errorMsg, isBusy, handleSubmit };
}

export function PetOnboardingForm({ onCreated }: { onCreated: (pet: PetProfile) => void }) {
  const form = useOnboardingState(onCreated);
  const clearError = (field: keyof FieldErrors) => form.setFieldErrors((current) => ({ ...current, [field]: undefined }));
  const preview = { name: form.name.trim() || "Companion", species: form.species, avatarUrl: form.avatarUrl.trim() || null };
  return <form onSubmit={form.handleSubmit} className="space-y-5" noValidate><fieldset disabled={form.isBusy} className="space-y-5"><Feedback message={form.errorMsg} /><SpeciesGrid selected={form.species} onSelect={form.setSpecies} disabled={form.isBusy} /><Field id="name" label="Companion Name *" value={form.name} onChange={(value) => { form.setName(value); clearError("name"); }} error={form.fieldErrors.name} hint="Use a name you will recognize in your learning workspace." placeholder="e.g. Penny, Finny, Barnaby" maxLength={50} /><div className="grid gap-4 sm:grid-cols-2"><Field id="avatarUrl" label="Avatar Image URL (Optional)" type="url" value={form.avatarUrl} onChange={(value) => { form.setAvatarUrl(value); clearError("avatarUrl"); }} error={form.fieldErrors.avatarUrl} hint="HTTPS works best; leave blank for the species fallback." placeholder="https://example.com/avatar.png" maxLength={2048} /><div className="flex items-end gap-3 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface-inset)] p-3"><CompanionAvatar pet={preview} className="h-12 w-12 rounded-xl after:rounded-xl" /><p className="text-[11px] text-muted-foreground">Preview updates as you add an avatar URL.</p></div></div><div className="grid gap-4 sm:grid-cols-2"><Field id="personality" label="Personality Trait (Optional)" value={form.personality} onChange={form.setPersonality} placeholder="e.g. Cautious saver" /><Field id="learningGoal" label="Learning Focus / Goal (Optional)" value={form.learningGoal} onChange={form.setLearningGoal} placeholder="e.g. Build emergency savings" /></div><button type="submit" disabled={form.isBusy} className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[var(--color-action-hover)] disabled:opacity-50">{form.isBusy ? <><RefreshCw aria-hidden="true" className="h-4 w-4 animate-spin" /><span>Creating Companion...</span></> : <><Sparkles aria-hidden="true" className="h-4 w-4" /><span>Create Companion</span></>}</button></fieldset></form>;
}
