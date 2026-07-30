import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { UserProfile } from "@/lib/auth/session";

type HomeFinalCtaProps = {
  user: UserProfile | null;
};

export function HomeFinalCta({ user }: HomeFinalCtaProps) {
  return (
    <section aria-labelledby="home-final-cta-title" className="home-section home-final-cta surface-paper">
      <div className="home-final-cta-copy">
        <p className="home-kicker">Act VII — Enter the Lab</p>
        <h2 id="home-final-cta-title" className="font-page-title">Start discovering how money ideas connect.</h2>
        <p className="font-body">
          Open the Craft Lab to experiment with relationships and build a clearer understanding of everyday financial decisions.
        </p>

        <div className="home-safety-disclaimer">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>Education Only — Simulation Only — Not Financial Advice</span>
        </div>
      </div>

      <div className="home-final-actions">
        <Link href="/lab" className="home-button home-button-primary">
          Open Craft Lab
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
        {user ? (
          <Link href="/workspace" className="home-button home-button-secondary">Open Workspace</Link>
        ) : (
          <Link href="/register" className="home-button home-button-secondary">Create Account</Link>
        )}
      </div>
    </section>
  );
}
