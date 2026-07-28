import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { UserProfile } from "@/lib/auth/session";

type HomeFinalCtaProps = {
  user: UserProfile | null;
};

export function HomeFinalCta({ user }: HomeFinalCtaProps) {
  return (
    <section aria-labelledby="home-final-cta-title" className="home-final-cta">
      <div>
        <p className="home-kicker">Your next discovery</p>
        <h2 id="home-final-cta-title">Start discovering how money ideas connect.</h2>
        <p>Open the Craft Lab to experiment with relationships and build a clearer picture of everyday financial decisions.</p>
        <p className="home-disclaimer" role="note">
          <span>Education Only</span>
          <span>Simulation Only</span>
          <span>Not Financial Advice</span>
        </p>
      </div>
      <div className="home-final-actions">
        <Link href="/lab" className="home-button home-button-primary">
          Open Craft Lab
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
        {user ? (
          <Link href="/workspace" className="home-button home-button-secondary">Open Workspace</Link>
        ) : (
          <Link href="/register" className="home-button home-button-secondary">Create an Account</Link>
        )}
      </div>
    </section>
  );
}
