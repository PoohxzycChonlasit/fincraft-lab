"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import type { UserProfile } from "@/lib/auth/session";
import { ProfileHeader } from "./profile-header";

type FieldErrors = { displayName?: string; avatarUrl?: string };

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

function DisplayNameField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="displayName" className="block text-xs font-semibold text-foreground">
        Display Name <span className="text-destructive">*</span>
      </label>
      <input
        id="displayName"
        type="text"
        required
        minLength={2}
        maxLength={50}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. FinCrafter"
        className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium text-foreground bg-[var(--surface-flat)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-colors ${
          error ? "border-destructive focus-visible:ring-destructive" : "border-[var(--border-subtle)] focus-visible:border-[var(--brand-accent)]"
        }`}
      />
      {error ? (
        <p className="text-[11px] font-medium text-destructive">{error}</p>
      ) : (
        <p className="text-[11px] text-muted-foreground">
          Your name as displayed in learning workspaces and community activities.
        </p>
      )}
    </div>
  );
}

function AvatarUrlField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="avatarUrl" className="block text-xs font-semibold text-foreground">
        Avatar Image URL (Optional)
      </label>
      <input
        id="avatarUrl"
        type="url"
        maxLength={2048}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/my-avatar.png"
        className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium text-foreground bg-[var(--surface-flat)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-colors ${
          error ? "border-destructive focus-visible:ring-destructive" : "border-[var(--border-subtle)] focus-visible:border-[var(--brand-accent)]"
        }`}
      />
      {error ? (
        <p className="text-[11px] font-medium text-destructive">{error}</p>
      ) : (
        <p className="text-[11px] text-muted-foreground">
          Direct HTTPS URL to an avatar image (leave blank to clear).
        </p>
      )}
    </div>
  );
}

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
        className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--color-action-hover)] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
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

function validateInputs(displayName: string, avatarUrl: string): FieldErrors {
  const errors: FieldErrors = {};
  const trimmedName = displayName.trim();
  if (trimmedName.length < 2 || trimmedName.length > 50) {
    errors.displayName = "Display name must be between 2 and 50 characters.";
  }
  const trimmedAvatar = avatarUrl.trim();
  if (trimmedAvatar.length > 0) {
    if (trimmedAvatar.length > 2048) {
      errors.avatarUrl = "Avatar URL must not exceed 2048 characters.";
    } else {
      try {
        const url = new URL(trimmedAvatar);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          errors.avatarUrl = "Avatar URL must start with http:// or https://";
        }
      } catch {
        errors.avatarUrl = "Please enter a valid absolute HTTP or HTTPS URL.";
      }
    }
  }
  return errors;
}

function useProfileFormState(initialUser: UserProfile) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [displayName, setDisplayName] = useState(initialUser.displayName);
  const [avatarUrl, setAvatarUrl] = useState(initialUser.avatarUrl || "");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    const errors = validateInputs(displayName, avatarUrl);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/users/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            displayName: displayName.trim(),
            avatarUrl: avatarUrl.trim() === "" ? null : avatarUrl.trim(),
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || "Failed to update profile. Please try again.");
          return;
        }

        setSuccessMsg("Profile updated successfully!");
        router.refresh();
      } catch {
        setErrorMsg("Network error connecting to server.");
      }
    });
  };

  const handleReset = () => {
    setDisplayName(initialUser.displayName);
    setAvatarUrl(initialUser.avatarUrl || "");
    setErrorMsg(null);
    setSuccessMsg(null);
    setFieldErrors({});
  };

  return {
    displayName,
    setDisplayName,
    avatarUrl,
    setAvatarUrl,
    errorMsg,
    fieldErrors,
    setFieldErrors,
    successMsg,
    isPending,
    handleSubmit,
    handleReset,
  };
}

export function ProfileForm({ initialUser }: { initialUser: UserProfile }) {
  const form = useProfileFormState(initialUser);

  return (
    <div className="surface-card w-full max-w-2xl rounded-2xl border border-[var(--border-subtle)] p-4 sm:p-6 shadow-sm">
      <ProfileHeader user={initialUser} avatarPreview={form.avatarUrl.trim()} />

      <form onSubmit={form.handleSubmit} className="mt-6 space-y-5">
        <FormFeedback errorMsg={form.errorMsg} successMsg={form.successMsg} />

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground">
            Account Email (Read-Only)
          </label>
          <input
            id="email"
            type="email"
            value={initialUser.email}
            disabled
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-3.5 py-2.5 text-xs font-medium text-muted-foreground cursor-not-allowed opacity-80"
          />
        </div>

        <DisplayNameField
          value={form.displayName}
          onChange={(val) => {
            form.setDisplayName(val);
            if (form.fieldErrors.displayName) form.setFieldErrors((prev) => ({ ...prev, displayName: undefined }));
          }}
          error={form.fieldErrors.displayName}
        />

        <AvatarUrlField
          value={form.avatarUrl}
          onChange={(val) => {
            form.setAvatarUrl(val);
            if (form.fieldErrors.avatarUrl) form.setFieldErrors((prev) => ({ ...prev, avatarUrl: undefined }));
          }}
          error={form.fieldErrors.avatarUrl}
        />

        <FormActions isPending={form.isPending} onReset={form.handleReset} />
      </form>
    </div>
  );
}
