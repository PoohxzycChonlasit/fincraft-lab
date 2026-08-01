"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  AuthField,
  AuthFormError,
  AuthFormNotice,
  AuthHeading,
  AuthPasswordField,
  AuthSubmitButton,
} from "./auth-form-primitives";
import { buildAuthHref, getLoginErrorMessage, isValidEmail } from "../utils/auth-utils";

type LoginField = "email" | "password";
type LoginFieldErrors = Partial<Record<LoginField, string>>;

function validateLogin(email: string, password: string): LoginFieldErrors {
  const errors: LoginFieldErrors = {};
  const trimmedEmail = email.trim();
  if (!trimmedEmail) errors.email = "Email address is required";
  else if (!isValidEmail(trimmedEmail)) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";
  else if (password.length < 8) errors.password = "Password must be at least 8 characters long";
  else if (password.length > 72) errors.password = "Password must be 72 characters or fewer";
  return errors;
}

export function LoginForm({ isRegistered = false, returnTo = "/lab" }: { isRegistered?: boolean; returnTo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const validationErrors = validateLogin(email, password);
    setFieldErrors(validationErrors);
    setErrorMessage(null);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data: unknown = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErrorMessage(getLoginErrorMessage(response.status, data));
        return;
      }
      router.push(returnTo);
      router.refresh();
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="surface-resting space-y-6 rounded-2xl p-6 sm:p-8">
      <AuthHeading title="Welcome back" description="Continue your saved financial worlds and learning progress." />
      {isRegistered ? <AuthFormNotice message="Account created. Please sign in to continue." /> : null}
      {errorMessage ? <AuthFormError message={errorMessage} /> : null}
      <div className="space-y-5">
        <AuthField id="login-email" name="email" label="Email address" value={email} onChange={setEmail} type="email" autoComplete="email" placeholder="you@example.com" error={fieldErrors.email} />
        <AuthPasswordField id="login-password" name="password" label="Password" value={password} onChange={setPassword} autoComplete="current-password" placeholder="Enter your password" helperText="Use the password for your FinCraft account." error={fieldErrors.password} />
      </div>
      <AuthSubmitButton isSubmitting={isSubmitting} label="Log in" pendingLabel="Signing in…" />
      <div className="space-y-3 border-t border-[var(--border-subtle)] pt-5 text-center text-sm text-muted-foreground">
        <p>New to FinCraft Lab? <Link href={buildAuthHref("/register", returnTo)} className="font-bold text-[var(--color-action-primary)] underline-offset-4 hover:underline">Create an account</Link></p>
        <p>Want to try the Lab first? <Link href="/lab" className="font-bold text-[var(--color-action-primary)] underline-offset-4 hover:underline">Explore as Guest</Link></p>
      </div>
    </form>
  );
}
