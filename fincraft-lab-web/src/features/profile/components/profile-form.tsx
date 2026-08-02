"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import type { UserProfile } from "@/lib/auth/session";
import { updateProfileApi } from "../api/profile.client";
import { ProfileHeader } from "./profile-header";

type FieldErrors = { displayName?: string; avatarUrl?: string };

function validateInputs(displayName: string, avatarUrl: string): FieldErrors {
  const errors: FieldErrors = {};
  const name = displayName.trim();
  const avatar = avatarUrl.trim();
  if (name.length < 2 || name.length > 50) {
    errors.displayName = "Display name must be between 2 and 50 characters.";
  }
  if (avatar.length > 2048) {
    errors.avatarUrl = "Avatar URL must not exceed 2048 characters.";
  } else if (avatar) {
    try {
      const url = new URL(avatar);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        errors.avatarUrl = "Avatar URL must start with http:// or https://.";
      }
    } catch {
      errors.avatarUrl = "Please enter a valid absolute HTTP or HTTPS URL.";
    }
  }
  return errors;
}

function FormFeedback({ errorMsg, successMsg }: { errorMsg: string | null; successMsg: string | null }) {
  if (errorMsg) {
    return <div role="alert" className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive"><AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" /><span>{errorMsg}</span></div>;
  }
  if (successMsg) {
    return <div role="status" className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-700 dark:text-emerald-300"><CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0" /><span>{successMsg}</span></div>;
  }
  return null;
}

function TextField({ id, label, value, onChange, error, hint, type = "text", placeholder }: {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  error?: string;
  hint: string;
  type?: "text" | "url";
  placeholder?: string;
}) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-foreground">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        placeholder={placeholder}
        maxLength={id === "avatarUrl" ? 2048 : 50}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : hintId}
        className={`min-h-[44px] w-full rounded-xl border bg-(--surface-flat) px-3.5 py-2.5 text-xs font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) ${error ? "border-destructive focus-visible:ring-destructive" : "border-(--border-subtle) focus-visible:border-(--brand-accent)"}`}
      />
      <p id={error ? errorId : hintId} className={`text-[11px] ${error ? "font-medium text-destructive" : "text-muted-foreground"}`}>{error || hint}</p>
    </div>
  );
}

function FormActions({ isBusy, onReset }: { isBusy: boolean; onReset: () => void }) {
  return (
    <div className="flex flex-col-reverse gap-2 border-t border-(--border-subtle) pt-4 sm:flex-row sm:justify-end">
      <button type="button" onClick={onReset} disabled={isBusy} className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-inset) px-4 text-xs font-semibold text-foreground transition-colors hover:bg-(--surface-raised) disabled:opacity-50">Reset</button>
      <button type="submit" disabled={isBusy} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-(--color-action-primary) px-5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-(--color-action-hover) disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring)">
        {isBusy ? <><RefreshCw aria-hidden="true" className="h-3.5 w-3.5 animate-spin" /><span>Saving...</span></> : "Save Changes"}
      </button>
    </div>
  );
}

function useProfileFormState(initialUser: UserProfile) {
  const router = useRouter();
  const [persistedUser, setPersistedUser] = useState(initialUser);
  const [displayName, setDisplayName] = useState(initialUser.displayName);
  const [avatarUrl, setAvatarUrl] = useState(initialUser.avatarUrl || "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const submitGuard = useRef(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitGuard.current || isSubmitting || isPending) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    const errors = validateInputs(displayName, avatarUrl);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    submitGuard.current = true;
    setIsSubmitting(true);
    startTransition(async () => {
      try {
        const result = await updateProfileApi({ displayName: displayName.trim(), avatarUrl: avatarUrl.trim() || null });
        if (!result.success) {
          setErrorMsg(result.errorMessage);
        } else {
          setPersistedUser(result.data);
          setDisplayName(result.data.displayName);
          setAvatarUrl(result.data.avatarUrl || "");
          setSuccessMsg("Profile saved. Your identity summary is up to date.");
          router.refresh();
        }
      } finally {
        setIsSubmitting(false);
        submitGuard.current = false;
      }
    });
  };

  const handleReset = () => {
    setDisplayName(persistedUser.displayName);
    setAvatarUrl(persistedUser.avatarUrl || "");
    setFieldErrors({});
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return { persistedUser, displayName, setDisplayName, avatarUrl, setAvatarUrl, fieldErrors, setFieldErrors, errorMsg, successMsg, isBusy: isPending || isSubmitting, handleSubmit, handleReset };
}

export function ProfileForm({ initialUser }: { initialUser: UserProfile }) {
  const form = useProfileFormState(initialUser);
  const clearError = (field: keyof FieldErrors) => form.setFieldErrors((current) => ({ ...current, [field]: undefined }));

  return (
    <div data-document-page="profile" className="surface-card w-full max-w-2xl rounded-2xl border border-(--border-subtle) p-4 shadow-sm sm:p-6">
      <ProfileHeader user={form.persistedUser} displayName={form.displayName} avatarPreview={form.avatarUrl.trim()} />
      <form onSubmit={form.handleSubmit} className="mt-6 space-y-5" noValidate>
        <FormFeedback errorMsg={form.errorMsg} successMsg={form.successMsg} />
        <fieldset disabled={form.isBusy} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-foreground">Account Email <span className="font-normal text-muted-foreground">(Read-Only)</span></label>
            <input id="email" type="email" value={form.persistedUser.email} readOnly aria-readonly="true" className="min-h-[44px] w-full cursor-default rounded-xl border border-(--border-subtle) bg-(--surface-inset) px-3.5 py-2.5 text-xs font-medium text-muted-foreground" />
          </div>
          <TextField id="displayName" label="Display Name *" value={form.displayName} onChange={(value) => { form.setDisplayName(value); clearError("displayName"); }} error={form.fieldErrors.displayName} hint="Shown in learning workspaces and community activities." placeholder="e.g. FinCrafter" />
          <TextField id="avatarUrl" label="Avatar Image URL (Optional)" type="url" value={form.avatarUrl} onChange={(value) => { form.setAvatarUrl(value); clearError("avatarUrl"); }} error={form.fieldErrors.avatarUrl} hint="Use an HTTP or HTTPS image URL, or leave blank for a deterministic fallback." placeholder="https://example.com/my-avatar.png" />
        </fieldset>
        <FormActions isBusy={form.isBusy} onReset={form.handleReset} />
      </form>
    </div>
  );
}
