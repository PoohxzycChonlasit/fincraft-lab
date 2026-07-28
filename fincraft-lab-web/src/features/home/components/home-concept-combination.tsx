import { ArrowRight, CircleDollarSign, CreditCard, Plus, RefreshCw } from "lucide-react";

import { GlassSurface } from "@/components/ui/glass-surface";

function ElementTile({
  kind,
  title,
  type,
}: {
  kind: "income" | "expense" | "discovery";
  title: string;
  type: "Base" | "Discovery";
}) {
  const Icon = kind === "income" ? CircleDollarSign : kind === "expense" ? CreditCard : RefreshCw;

  return (
    <article className="home-element-tile" data-kind={kind}>
      <span className="home-element-icon" aria-hidden="true">
        <Icon size={22} strokeWidth={1.8} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{type}</small>
      </span>
    </article>
  );
}

function EquationOperator({ type }: { type: "plus" | "result" }) {
  const Icon = type === "plus" ? Plus : ArrowRight;

  return (
    <span className="home-equation-operator" data-operator={type}>
      <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
      <span className="sr-only">{type === "plus" ? "combined with" : "creates"}</span>
    </span>
  );
}

export function HomeConceptCombination() {
  return (
    <GlassSurface
      as="section"
      variant="neutral"
      intensity="medium"
      aria-labelledby="concept-combination-title"
      className="home-combination"
    >
      <h2 id="concept-combination-title" className="home-kicker">Interactive Concept Combination</h2>

      <div className="home-equation" role="group" aria-label="Earned Income combined with General Expense creates Net Cash Flow">
        <ElementTile kind="income" title="Earned Income" type="Base" />
        <EquationOperator type="plus" />
        <ElementTile kind="expense" title="General Expense" type="Base" />
        <EquationOperator type="result" />
        <ElementTile kind="discovery" title="Net Cash Flow" type="Discovery" />
      </div>

      <p className="home-combination-note">
        Combine financial elements in the Craft Lab to uncover practical lessons and trade-offs.
      </p>
    </GlassSurface>
  );
}
