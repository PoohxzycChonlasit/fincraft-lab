import { ArrowRight, CircleDollarSign, CreditCard, Percent, ShieldAlert, Wallet } from "lucide-react";

type RecipeExample = {
  id: string;
  inputA: { label: string; icon: typeof CircleDollarSign; type: string };
  inputB: { label: string; icon: typeof CreditCard; type: string };
  output: { label: string; icon: typeof Wallet; type: string; category: string };
};

const REAL_RECIPES: RecipeExample[] = [
  {
    id: "cash-flow",
    inputA: { label: "Income", icon: CircleDollarSign, type: "BASE" },
    inputB: { label: "Expense", icon: CreditCard, type: "BASE" },
    output: { label: "Net Cash Flow", icon: Wallet, type: "DISCOVERY", category: "Cash Flow" },
  },
  {
    id: "debt-pressure",
    inputA: { label: "Debt", icon: CreditCard, type: "BASE" },
    inputB: { label: "Interest", icon: Percent, type: "BASE" },
    output: { label: "Debt Pressure", icon: ShieldAlert, type: "RISK", category: "Liabilities" },
  },
];

export function HomeRecipePreview() {
  return (
    <section aria-labelledby="home-recipes-title" className="home-section home-recipe-section">
      <div className="home-section-header">
        <p className="home-kicker">Act II — Money Moves</p>
        <h2 id="home-recipes-title">Every financial concept shapes another.</h2>
        <p className="home-section-subtitle">
          Observe how order-independent combinations reveal real economic relationships grounded in verified seed data.
        </p>
      </div>

      <div className="home-recipe-grid">
        {REAL_RECIPES.map((recipe) => {
          const IconA = recipe.inputA.icon;
          const IconB = recipe.inputB.icon;
          const IconOut = recipe.output.icon;

          return (
            <div key={recipe.id} className="home-recipe-card surface-solid">
              <div className="home-recipe-equation">
                <div className="home-recipe-chip">
                  <IconA size={16} />
                  <span>{recipe.inputA.label}</span>
                </div>
                <span className="home-recipe-plus">+</span>
                <div className="home-recipe-chip">
                  <IconB size={16} />
                  <span>{recipe.inputB.label}</span>
                </div>
                <ArrowRight size={18} className="home-recipe-arrow" />
                <div className="home-recipe-chip home-recipe-chip-output">
                  <IconOut size={16} />
                  <span>{recipe.output.label}</span>
                </div>
              </div>
              <div className="home-recipe-meta">
                <span className="font-caption">Commutative Craft Recipe</span>
                <span className="font-label">{recipe.output.category}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
