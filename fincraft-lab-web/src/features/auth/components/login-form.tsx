"use client";

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

function FormHeader() {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-bold tracking-tight text-foreground">Log In</h2>
      <p className="text-xs text-muted-foreground">Enter your account credentials to access Craft Lab.</p>
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
      {isSubmitting ? "Logging in..." : "Log In"}
    </button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setErrorMessage(data.error || "Invalid email or password");
        setIsSubmitting(false);
        return;
      }

      router.push("/lab");
      router.refresh();
    } catch {
      setErrorMessage("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="surface-resting rounded-2xl p-6 sm:p-8 space-y-5 border border-[var(--border-subtle)] shadow-xs">
      <FormHeader />
      {errorMessage ? <FormErrorMessage message={errorMessage} /> : null}
      <FormField id="email-input" label="Email address" type="email" value={email} placeholder="user@example.com" onChange={setEmail} autoComplete="email" />
      <FormField id="password-input" label="Password" type="password" value={password} placeholder="••••••••" onChange={setPassword} autoComplete="current-password" />
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
}
