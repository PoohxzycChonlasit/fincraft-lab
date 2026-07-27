"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  autoComplete: string;
};

function validateInputs(displayName: string, email: string, password: string, confirmPassword: string): string | null {
  if (!displayName.trim()) return "Display name is required";
  if (!email.trim()) return "Email address is required";
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (password !== confirmPassword) return "Password confirmation does not match";
  return null;
}

function FormHeader() {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-bold tracking-tight text-foreground">Create Account</h2>
      <p className="text-xs text-muted-foreground">Sign up to get started with FinCraft Lab.</p>
    </div>
  );
}

function FormErrorMessage({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 p-3.5 text-xs font-semibold text-[var(--color-text-danger)]">
      {message}
    </div>
  );
}

function FormField({ id, label, type, value, placeholder, onChange, autoComplete }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-foreground">{label}</label>
      <input
        id={id}
        type={type}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-[44px] w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--border-interactive)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
      />
    </div>
  );
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="min-h-[44px] w-full cursor-pointer rounded-xl bg-[var(--color-action-primary)] px-4 py-3 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[var(--color-action-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSubmitting ? "Creating account..." : "Sign Up"}
    </button>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateInputs(displayName, email, password, confirmPassword);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: displayName.trim(), email: email.trim().toLowerCase(), password }),
      });
      const data: unknown = await response.json().catch(() => ({}));
      const error = typeof data === "object" && data !== null && "error" in data && typeof data.error === "string"
        ? data.error
        : "Registration failed";

      if (!response.ok) {
        setErrorMessage(error);
        setIsSubmitting(false);
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setErrorMessage("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="surface-resting space-y-5 rounded-2xl border border-[var(--border-subtle)] p-6 shadow-xs sm:p-8">
      <FormHeader />
      {errorMessage ? <FormErrorMessage message={errorMessage} /> : null}
      <FormField id="display-name-input" label="Display Name" type="text" value={displayName} placeholder="FinCrafter" onChange={setDisplayName} autoComplete="name" />
      <FormField id="email-input" label="Email address" type="email" value={email} placeholder="user@example.com" onChange={setEmail} autoComplete="email" />
      <FormField id="password-input" label="Password" type="password" value={password} placeholder="At least 8 characters" onChange={setPassword} autoComplete="new-password" />
      <FormField id="confirm-password-input" label="Confirm Password" type="password" value={confirmPassword} placeholder="Re-enter your password" onChange={setConfirmPassword} autoComplete="new-password" />
      <SubmitButton isSubmitting={isSubmitting} />
      <div className="pt-1 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--color-action-primary)] hover:underline">
          Log in
        </Link>
      </div>
    </form>
  );
}
