"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import type { PetProfile, PetSpecies } from "../types/pet.types";
import { SPECIES_OPTIONS } from "../types/pet.types";
import { updatePetApi } from "../api/pet.client";
import { CompanionAvatar } from "./pet-header";

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

function Feedback({ errorMsg, successMsg }: { errorMsg: string | null; successMsg: string | null }) {
  if (errorMsg) return <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive"><AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /><span>{errorMsg}</span></div>;
  if (successMsg) return <div role="status" className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-700 dark:text-emerald-300"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /><span>{successMsg}</span></div>;
  return null;
}

function SpeciesSelect({ value, onChange, disabled }: { value: PetSpecies; onChange: (species: PetSpecies) => void; disabled: boolean }) {
  return <div className="space-y-1.5"><label htmlFor="species" className="block text-xs font-semibold text-foreground">Species</label><select id="species" value={value} disabled={disabled} onChange={(event) => { const option = SPECIES_OPTIONS.find((item) => item.value === event.target.value); if (option) onChange(option.value); }} className="min-h-[44px] w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]">{SPECIES_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>;
}

function Field({ id, label, value, onChange, error, hint, placeholder, type = "text", maxLength = 200, disabled }: { id: string; label: string; value: string; onChange: (value: string) => void; error?: string; hint?: string; placeholder?: string; type?: "text" | "url"; maxLength?: number; disabled: boolean }) {
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  return <div className="space-y-1.5"><label htmlFor={id} className="block text-xs font-semibold text-foreground">{label}</label><input id={id} type={type} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : hint ? helpId : undefined} className={`min-h-[44px] w-full rounded-xl border bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${error ? "border-destructive focus-visible:ring-destructive" : "border-[var(--border-subtle)] focus-visible:border-[var(--brand-accent)]"}`} />{(error || hint) && <p id={error ? errorId : helpId} className={`text-[11px] ${error ? "font-medium text-destructive" : "text-muted-foreground"}`}>{error || hint}</p>}</div>;
}

function useEditState(initialPet: PetProfile, onUpdated: (pet: PetProfile) => void) {
  const [persistedPet, setPersistedPet] = useState(initialPet);
  const [name, setName] = useState(initialPet.name);
  const [species, setSpecies] = useState<PetSpecies>(initialPet.species);
  const [avatarUrl, setAvatarUrl] = useState(initialPet.avatarUrl || "");
  const [personality, setPersonality] = useState(initialPet.personality || "");
  const [learningGoal, setLearningGoal] = useState(initialPet.learningGoal || "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const submitGuard = useRef(false);
  const isBusy = isPending || isSubmitting;
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitGuard.current || isBusy) return;
    const errors = validate(name, avatarUrl);
    setFieldErrors(errors);
    setErrorMsg(null);
    setSuccessMsg(null);
    if (Object.keys(errors).length > 0) return;
    submitGuard.current = true;
    setIsSubmitting(true);
    startTransition(async () => {
      try {
        const result = await updatePetApi({ name: name.trim(), species, avatarUrl: avatarUrl.trim() || null, personality: personality.trim() || null, learningGoal: learningGoal.trim() || null });
        if (!result.success) setErrorMsg(result.errorMessage);
        else { setPersistedPet(result.data); setName(result.data.name); setSpecies(result.data.species); setAvatarUrl(result.data.avatarUrl || ""); setPersonality(result.data.personality || ""); setLearningGoal(result.data.learningGoal || ""); setSuccessMsg("Companion saved. The same profile is used in Workspace."); onUpdated(result.data); }
      } finally {
        setIsSubmitting(false);
        submitGuard.current = false;
      }
    });
  };
  const handleReset = () => { setName(persistedPet.name); setSpecies(persistedPet.species); setAvatarUrl(persistedPet.avatarUrl || ""); setPersonality(persistedPet.personality || ""); setLearningGoal(persistedPet.learningGoal || ""); setFieldErrors({}); setErrorMsg(null); setSuccessMsg(null); };
  return { persistedPet, name, setName, species, setSpecies, avatarUrl, setAvatarUrl, personality, setPersonality, learningGoal, setLearningGoal, fieldErrors, setFieldErrors, errorMsg, successMsg, isBusy, handleSubmit, handleReset };
}

export function PetEditForm({ pet, onUpdated }: { pet: PetProfile; onUpdated: (pet: PetProfile) => void }) {
  const form = useEditState(pet, onUpdated);
  const clearError = (field: keyof FieldErrors) => form.setFieldErrors((current) => ({ ...current, [field]: undefined }));
  const preview = { name: form.name || form.persistedPet.name, species: form.species, avatarUrl: form.avatarUrl.trim() || null };
  return <form onSubmit={form.handleSubmit} className="space-y-4" noValidate><Feedback errorMsg={form.errorMsg} successMsg={form.successMsg} /><fieldset disabled={form.isBusy} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field id="name" label="Companion Name *" value={form.name} onChange={(value) => { form.setName(value); clearError("name"); }} error={form.fieldErrors.name} hint="Keep the name between 1 and 50 characters." maxLength={50} disabled={form.isBusy} /><SpeciesSelect value={form.species} onChange={form.setSpecies} disabled={form.isBusy} /></div><div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]"><Field id="avatarUrl" label="Avatar Image URL (Optional)" type="url" value={form.avatarUrl} onChange={(value) => { form.setAvatarUrl(value); clearError("avatarUrl"); }} error={form.fieldErrors.avatarUrl} hint="Leave blank to use the species fallback." placeholder="https://example.com/avatar.png" maxLength={2048} disabled={form.isBusy} /><div className="flex items-end gap-3 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface-inset)] p-3"><CompanionAvatar pet={preview} className="h-12 w-12 rounded-xl after:rounded-xl" /><span className="sr-only">Companion avatar preview</span></div></div><Field id="personality" label="Personality Trait (Optional)" value={form.personality} onChange={form.setPersonality} placeholder="e.g. Cautious saver" disabled={form.isBusy} /><Field id="learningGoal" label="Learning Focus / Goal (Optional)" value={form.learningGoal} onChange={form.setLearningGoal} placeholder="e.g. Master compound interest" disabled={form.isBusy} /></fieldset><div className="flex flex-col-reverse gap-2 border-t border-[var(--border-subtle)] pt-4 sm:flex-row sm:justify-end"><button type="button" onClick={form.handleReset} disabled={form.isBusy} className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-4 text-xs font-semibold text-foreground transition-colors hover:bg-[var(--surface-raised)] disabled:opacity-50">Reset</button><button type="submit" disabled={form.isBusy} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[var(--color-action-hover)] disabled:opacity-50">{form.isBusy ? <><RefreshCw aria-hidden="true" className="h-3.5 w-3.5 animate-spin" /><span>Saving...</span></> : "Save Changes"}</button></div></form>;
}
