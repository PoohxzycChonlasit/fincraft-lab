import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import type { ThemePreference } from "@/features/theme/types/theme-types";
import type { UserProfile } from "@/lib/auth/session";
import { HomeArtwork } from "./home-artwork";

type HomeHeroProps = {
  initialThemePreference: ThemePreference;
  user: UserProfile | null;
};

export function HomeHero({ initialThemePreference, user }: HomeHeroProps) {
  return (
    <section aria-labelledby="home-hero-title" className="home-hero">
      <div className="home-hero-copy">
        <p className="home-eyebrow">
          Financial Literacy Discovery Lab
        </p>
        <h1 id="home-hero-title" className="home-hero-title">
          Learn finance by connecting ideas.
        </h1>
        <p className="home-hero-description">
          Combine everyday financial concepts, discover how they relate, and build a clearer understanding of real-life money decisions.
        </p>

        <div className="home-hero-actions">
          <Link
            href="/lab"
            className="home-button home-button-primary"
          >
            Start Crafting
          </Link>
          {user ? (
            <Link
              href="/lab"
              className="home-button home-button-secondary"
            >
              Continue to Lab
            </Link>
          ) : (
            <Link href="/login" className="home-button home-button-secondary">
              Sign In to Save
            </Link>
          )}
          {!user ? <Link href="/register" className="home-text-link">Create Account</Link> : null}
        </div>

        <div className="home-safety-note" role="note">
          <ShieldCheck size={17} aria-hidden="true" />
          <span>Education Only — Simulation Only — Not Financial Advice</span>
        </div>
      </div>

      <HomeArtwork initialThemePreference={initialThemePreference} />
    </section>
  );
}
