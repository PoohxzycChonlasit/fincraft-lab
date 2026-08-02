"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({ menuItem = false }: { menuItem?: boolean }) {
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

  const button = (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={isSubmitting}
      className={menuItem
        ? "flex min-h-11 w-full items-center rounded-xl px-3 text-sm font-semibold text-destructive outline-none transition-colors hover:bg-destructive/10 focus-visible:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
        : "min-h-11 rounded-lg border border-(--border-subtle) px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-(--surface-inset)/50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-(--ring) disabled:cursor-not-allowed disabled:opacity-50"}
    >
      {isSubmitting ? "Logging out..." : "Log out"}
      {errorMessage ? <span role="alert" className="sr-only">{errorMessage}</span> : null}
    </button>
  );

  return menuItem ? button : <span className="inline-flex items-center gap-2">{button}</span>;
}
