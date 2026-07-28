import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HomeFinalCta() {
  return (
    <section aria-labelledby="home-final-cta-title" className="home-final-cta">
      <div>
        <p className="home-kicker">Ready to Experiment?</p>
        <h2 id="home-final-cta-title">Explore what happens when financial ideas connect.</h2>
        <p>Move from explanation into the Craft Lab and test the relationships for yourself.</p>
      </div>
      <Link href="/lab" className="home-button home-button-primary">
        Start Crafting
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
