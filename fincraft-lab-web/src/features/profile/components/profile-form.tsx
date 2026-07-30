"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import type { UserProfile } from "@/lib/auth/session";

type ProfileFormProps = {
  initialUser: UserProfile;
};

export function ProfileForm({ initialUser }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [displayName, setDisplayName] = useState(initialUser.displayName);
  const [avatarUrl, setAvatarUrl] = useState(initialUser.avatarUrl || "");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ displayName?: string; avatarUrl?: string }>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const errors: { displayName?: string; avatarUrl?: string } = {};

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

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          displayName: displayName.trim(),
          avatarUrl: avatarUrl.trim() === "" ? null : avatarUrl.trim(),
        };

        const res = await fetch("/api/users/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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

  const currentAvatarPreview = avatarUrl.trim();

  return (
    <div className="surface-card w-full max-w-2xl rounded-2xl border border-[var(--border-subtle)] p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border-subtle)] pb-5">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] overflow-hidden">
            {currentAvatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentAvatarPreview}
                alt={`${displayName}'s avatar`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <User className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{initialUser.displayName}</h2>
            <p className="text-xs text-muted-foreground">{initialUser.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-inset)] px-3 py-1 text-xs font-semibold text-foreground border border-[var(--border-subtle)]">
            <Shield className="h-3.5 w-3.5 text-[var(--brand-accent)]" />
            {initialUser.role}
          </span>
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {initialUser.status}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {errorMsg ? (
          <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        ) : null}

        {successMsg ? (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        ) : null}

        {/* Read-only Account Email */}
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
          <p className="text-[11px] text-muted-foreground">
            Email address cannot be modified from profile settings.
          </p>
        </div>

        {/* Display Name */}
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
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              if (fieldErrors.displayName) {
                setFieldErrors((prev) => ({ ...prev, displayName: undefined }));
              }
            }}
            placeholder="e.g. FinCrafter"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium text-foreground bg-[var(--surface-flat)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-colors ${
              fieldErrors.displayName
                ? "border-destructive focus-visible:ring-destructive"
                : "border-[var(--border-subtle)] focus-visible:border-[var(--brand-accent)]"
            }`}
          />
          {fieldErrors.displayName ? (
            <p className="text-[11px] font-medium text-destructive">{fieldErrors.displayName}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Your name as displayed in learning workspaces and community activities.
            </p>
          )}
        </div>

        {/* Avatar URL */}
        <div className="space-y-1.5">
          <label htmlFor="avatarUrl" className="block text-xs font-semibold text-foreground">
            Avatar Image URL (Optional)
          </label>
          <input
            id="avatarUrl"
            type="url"
            maxLength={2048}
            value={avatarUrl}
            onChange={(e) => {
              setAvatarUrl(e.target.value);
              if (fieldErrors.avatarUrl) {
                setFieldErrors((prev) => ({ ...prev, avatarUrl: undefined }));
              }
            }}
            placeholder="https://example.com/my-avatar.png"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium text-foreground bg-[var(--surface-flat)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-colors ${
              fieldErrors.avatarUrl
                ? "border-destructive focus-visible:ring-destructive"
                : "border-[var(--border-subtle)] focus-visible:border-[var(--brand-accent)]"
            }`}
          />
          {fieldErrors.avatarUrl ? (
            <p className="text-[11px] font-medium text-destructive">{fieldErrors.avatarUrl}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Direct HTTPS URL to an avatar image (leave blank to clear).
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={handleReset}
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
      </form>
    </div>
  );
}
