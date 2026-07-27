"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        setErrorMessage("Unable to log out. Please try again.");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setErrorMessage("Unable to log out. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={isSubmitting}
        className="min-h-[44px] rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-[var(--surface-inset)]/50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Logging out..." : "Log Out"}
      </button>
      {errorMessage ? <span role="alert" className="sr-only">{errorMessage}</span> : null}
    </span>
  );
}
