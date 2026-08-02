"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  AuthField,
  AuthFormError,
  AuthHeading,
  AuthPasswordField,
  AuthSubmitButton,
} from "./auth-form-primitives";
import { buildAuthHref, getRegisterErrorMessage, isValidEmail } from "../utils/auth-utils";

type RegisterField = "displayName" | "email" | "password" | "confirmPassword";
type RegisterFieldErrors = Partial<Record<RegisterField, string>>;

function validateRegister(displayName: string, email: string, password: string, confirmPassword: string): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};
  const trimmedName = displayName.trim();
  const trimmedEmail = email.trim();
  if (!trimmedName) errors.displayName = "Display name is required";
  else if (trimmedName.length > 100) errors.displayName = "Display name must be 100 characters or fewer";
  if (!trimmedEmail) errors.email = "Email address is required";
  else if (!isValidEmail(trimmedEmail)) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";
  else if (password.length < 8) errors.password = "Password must be at least 8 characters long";
  else if (password.length > 72) errors.password = "Password must be 72 characters or fewer";
  if (password !== confirmPassword) errors.confirmPassword = "Password confirmation does not match";
  return errors;
}

export function RegisterForm({ returnTo = "/lab" }: { returnTo?: string }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const validationErrors = validateRegister(displayName, email, password, confirmPassword);
    setFieldErrors(validationErrors);
    setErrorMessage(null);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: displayName.trim(), email: email.trim().toLowerCase(), password }),
      });
      const data: unknown = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErrorMessage(getRegisterErrorMessage(response.status, data));
        return;
      }
      router.push(buildAuthHref("/login", returnTo, true));
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="surface-resting space-y-6 rounded-2xl p-6 sm:p-8">
      <AuthHeading title="Create your account" description="Save your financial worlds and keep your learning progress available when you return." />
      {errorMessage ? <AuthFormError message={errorMessage} /> : null}
      <div className="space-y-5">
        <AuthField id="register-display-name" name="displayName" label="Display name" value={displayName} onChange={setDisplayName} autoComplete="name" placeholder="Your learning name" error={fieldErrors.displayName} />
        <AuthField id="register-email" name="email" label="Email address" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" error={fieldErrors.email} />
        <AuthPasswordField id="register-password" name="password" label="Password" value={password} onChange={setPassword} autoComplete="new-password" placeholder="At least 8 characters" helperText="Use 8–72 characters. Your password stays masked by default." error={fieldErrors.password} />
        <AuthPasswordField id="register-confirm-password" name="confirmPassword" label="Confirm password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" placeholder="Re-enter your password" error={fieldErrors.confirmPassword} />
      </div>
      <AuthSubmitButton isSubmitting={isSubmitting} label="Create account" pendingLabel="Creating account…" />
      <div className="space-y-3 border-t border-(--border-subtle) pt-5 text-center text-sm text-muted-foreground">
        <p>Already have an account? <Link href={buildAuthHref("/login", returnTo)} className="font-bold text-(--color-action-primary) underline-offset-4 hover:underline">Log in</Link></p>
        <p>Not ready to sign up? <Link href="/lab" className="font-bold text-(--color-action-primary) underline-offset-4 hover:underline">Explore as Guest</Link></p>
      </div>
    </form>
  );
}
