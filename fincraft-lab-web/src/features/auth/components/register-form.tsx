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
  onChange: (val: string) => void;
  autoComplete: string;
};

function validateInputs(displayName: string, email: string, pass: string, confirm: string): string | null {
  if (!displayName.trim()) return "Display name is required";
  if (!email.trim()) return "Email address is required";
  if (pass.length < 8) return "Password must be at least 8 characters long";
  if (pass !== confirm) return "Password confirmation does not match";
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
    <div
      role="alert"
      className="rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 p-3.5 text-xs font-semibold text-[var(--color-text-danger)]"
    >
      {message}
    </div>
  );
}

function FormField({ id, label, type, value, placeholder, onChange, autoComplete }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--border-interactive)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20 min-h-[44px]"
      />
    </div>
  );
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full rounded-xl bg-[var(--color-action-primary)] px-4 py-3 text-xs font-semibold text-white shadow-xs hover:bg-[var(--color-action-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-50 transition-colors min-h-[44px] cursor-pointer"
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validateInputs(displayName, email, password, confirmPassword);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setErrorMessage(data.error || "Registration failed");
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
    <form onSubmit={handleSubmit} className="surface-resting rounded-2xl p-6 sm:p-8 space-y-5 border border-[var(--border-subtle)] shadow-xs">
      <FormHeader />
      {errorMessage ? <FormErrorMessage message={errorMessage} /> : null}
      <FormField id="display-name-input" label="Display Name" type="text" value={displayName} placeholder="FinCrafter" onChange={setDisplayName} autoComplete="name" />
      <FormField id="email-input" label="Email address" type="email" value={email} placeholder="user@example.com" onChange={setEmail} autoComplete="email" />
      <FormField id="password-input" label="Password" type="password" value={password} placeholder="••••••••" onChange={setPassword} autoComplete="new-password" />
      <FormField id="confirm-password-input" label="Confirm Password" type="password" value={confirmPassword} placeholder="••••••••" onChange={setConfirmPassword} autoComplete="new-password" />
      <SubmitButton isSubmitting={isSubmitting} />
      <div className="text-center text-xs text-muted-foreground pt-1">
        มีบัญชีแล้ว?{" "}
        <Link href="/login" className="font-semibold text-[var(--color-action-primary)] hover:underline">
          เข้าสู่ระบบ
        </Link>
      </div>
    </form>
  );
}
