import { ArrowRight, CircleDollarSign, CreditCard, RefreshCw } from "lucide-react";

import { GlassSurface } from "@/components/ui/glass-surface";

function AboutNode({ kind, label }: { kind: "income" | "expense" | "result"; label: string }) {
  const Icon = kind === "income" ? CircleDollarSign : kind === "expense" ? CreditCard : RefreshCw;

  return (
    <span className={`home-about-node home-about-node-${kind}`}>
      <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export function HomeAbout() {
  return (
    <section aria-labelledby="home-about-title" className="home-about home-section">
      <div className="home-about-copy">
        <p className="home-kicker">Why FinCraft Lab</p>
        <h2 id="home-about-title">Financial concepts are easier to understand when you can see how they connect.</h2>
        <p>
          FinCraft Lab turns abstract topics such as income, expenses, saving, debt and risk into an interactive discovery experience.
        </p>
        <p>
          Instead of memorising definitions, learners experiment, combine concepts and observe their relationships.
        </p>
      </div>

      <GlassSurface as="div" variant="neutral" intensity="medium" className="home-about-demo" role="group" aria-label="Income plus Expense creates Net Cash Flow">
        <div className="home-about-demo-heading">
          <span className="home-kicker">One connection at a time</span>
          <span>See the relationship, then test it.</span>
        </div>
        <div className="home-about-equation">
          <AboutNode kind="income" label="Income" />
          <span className="home-about-operator" aria-hidden="true">+</span>
          <AboutNode kind="expense" label="Expense" />
          <ArrowRight className="home-about-arrow" size={20} aria-hidden="true" />
          <AboutNode kind="result" label="Net Cash Flow" />
        </div>
        <p className="home-about-caption">Income + Expense → Net Cash Flow</p>
      </GlassSurface>
    </section>
  );
}
