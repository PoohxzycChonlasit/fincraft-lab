import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import type { UserProfile } from "@/lib/auth/session";
import { HomeSystemVisual } from "./home-system-visual";

type HomeHeroProps = {
  user: UserProfile | null;
};

export function HomeHero({ user }: HomeHeroProps) {
  return (
    <section aria-labelledby="home-hero-title" className="home-hero">
      <div className="home-hero-copy">
        <div className="home-eyebrow-badge">
          <Sparkles size={14} aria-hidden="true" />
          <span>Financial Literacy Discovery Lab</span>
        </div>

        <h1 id="home-hero-title" className="home-hero-title">
          Money is a living system. Learn by connecting its parts.
        </h1>

        <p className="home-hero-description">
          Combine everyday financial concepts, observe cause and effect, and trace how small decisions compound into real-life outcomes.
        </p>

        <div className="home-hero-actions">
          <Link href="/lab" className="home-button home-button-primary">
            Enter Craft Lab
          </Link>
          {user ? (
            <Link href="/workspace" className="home-button home-button-secondary">
              Open Workspace
            </Link>
          ) : (
            <Link href="/simulations" className="home-button home-button-secondary">
              Explore Simulations
            </Link>
          )}
        </div>

        <div className="home-safety-note" role="note">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>Education Only — Simulation Only — Not Financial Advice</span>
        </div>
      </div>

      <HomeSystemVisual />
    </section>
  );
}
