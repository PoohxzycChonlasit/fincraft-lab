import Link from "next/link";
import type { UserProfile } from "@/lib/auth/session";

type HomeHeroProps = {
  user: UserProfile | null;
};

export function HomeHero({ user }: HomeHeroProps) {
  return (
    <section
      aria-label="Hero Introduction"
      className="relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-resting)] p-6 sm:p-10 space-y-6 text-center sm:text-left shadow-xs"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40 dark:opacity-20"
        style={{ backgroundImage: "url('/images/hero-constellation.svg')" }}
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-3 max-w-2xl">
        <span className="inline-block rounded-full bg-[var(--color-craft-accent)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--color-craft-accent)] border border-[var(--border-subtle)]">
          Financial Literacy Discovery Lab
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          Learn finance by combining ideas.
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
          Place financial elements on an interactive canvas, combine them, and discover how money concepts connect in real life.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
        <Link
          href="/lab"
          className="min-h-[44px] inline-flex items-center justify-center rounded-xl bg-[var(--color-action-primary)] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[var(--color-action-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        >
          Start Crafting
        </Link>
        {user ? (
          <Link
            href="/lab"
            className="min-h-[44px] inline-flex items-center justify-center rounded-xl border border-[var(--border-interactive)] bg-[var(--surface-resting)] px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-[var(--surface-inset)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            Continue to Lab
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="min-h-[44px] inline-flex items-center justify-center rounded-xl border border-[var(--border-interactive)] bg-[var(--surface-resting)] px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-[var(--surface-inset)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              Sign In to Save
            </Link>
            <Link href="/register" className="text-xs font-medium text-muted-foreground hover:text-foreground underline hover:no-underline">
              Create Account
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
