"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type FieldBaseProps = {
  id: string;
  label: string;
  name: string;
  type?: "text" | "email";
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder: string;
  error?: string;
  helperText?: string;
};

function fieldDescriptionId(id: string, error?: string, helperText?: string): string | undefined {
  if (error) return `${id}-error`;
  if (helperText) return `${id}-help`;
  return undefined;
}

export function AuthHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-2">
      <p className="font-label text-(--color-craft-accent)">FinCraft account gateway</p>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

export function AuthField({ id, label, name, type = "text", value, onChange, autoComplete, placeholder, error, helperText }: FieldBaseProps) {
  const descriptionId = fieldDescriptionId(id, error, helperText);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">{label}</label>
      {helperText ? <p id={`${id}-help`} className="text-xs leading-5 text-muted-foreground">{helperText}</p> : null}
      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className="min-h-11 w-full rounded-xl border border-(--border-subtle) bg-(--surface-inset) px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-(--border-interactive) focus:outline-none focus:ring-2 focus:ring-(--focus-ring)/25"
      />
      {error ? <p id={`${id}-error`} className="text-xs font-semibold leading-5 text-(--color-text-danger)">{error}</p> : null}
    </div>
  );
}

export function AuthPasswordField({ id, label, name, value, onChange, autoComplete, placeholder, error, helperText }: FieldBaseProps) {
  const [isVisible, setIsVisible] = useState(false);
  const descriptionId = fieldDescriptionId(id, error, helperText);
  const visibilityLabel = isVisible ? "Hide password" : "Show password";
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">{label}</label>
      {helperText ? <p id={`${id}-help`} className="text-xs leading-5 text-muted-foreground">{helperText}</p> : null}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={isVisible ? "text" : "password"}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          className="min-h-11 w-full rounded-xl border border-(--border-subtle) bg-(--surface-inset) py-2.5 pl-3.5 pr-14 text-sm text-foreground placeholder:text-muted-foreground focus:border-(--border-interactive) focus:outline-none focus:ring-2 focus:ring-(--focus-ring)/25"
        />
        <button
          type="button"
          aria-label={visibilityLabel}
          aria-pressed={isVisible}
          onClick={() => setIsVisible((previous) => !previous)}
          className="absolute right-1 top-1 inline-flex min-h-9 min-w-11 items-center justify-center rounded-lg text-xs font-semibold text-(--color-action-primary) transition-colors hover:bg-(--surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
        >
          {isVisible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          <span className="sr-only">{visibilityLabel}</span>
        </button>
      </div>
      {error ? <p id={`${id}-error`} className="text-xs font-semibold leading-5 text-(--color-text-danger)">{error}</p> : null}
    </div>
  );
}

export function AuthFormError({ message }: { message: string }) {
  return (
    <div role="alert" className="surface-inset rounded-xl border-(--color-text-danger)/40 p-3.5 text-sm font-semibold leading-5 text-(--color-text-danger)">
      {message}
    </div>
  );
}

export function AuthFormNotice({ message }: { message: string }) {
  return (
    <div role="status" className="surface-inset rounded-xl border-(--border-interactive)/40 p-3.5 text-sm font-semibold leading-5 text-(--color-action-primary)">
      {message}
    </div>
  );
}

export function AuthSubmitButton({ isSubmitting, label, pendingLabel }: { isSubmitting: boolean; label: string; pendingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="min-h-11 w-full rounded-xl bg-(--color-action-primary) px-4 py-3 text-sm font-bold text-(--color-text-inverse) shadow-sm transition-colors hover:bg-(--color-action-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSubmitting ? pendingLabel : label}
    </button>
  );
}
