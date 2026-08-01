import { BookOpenCheck, CircleDollarSign, CreditCard, Layers3, ShieldCheck, Wallet } from "lucide-react";
import type { ReactNode } from "react";

function EquationElement({ label, kind, children }: { label: string; kind: string; children: ReactNode }) {
  return (
    <span className="home-equation-element">
      <span className="home-equation-icon" aria-hidden="true">{children}</span>
      <span><strong>{label}</strong><small>{kind}</small></span>
    </span>
  );
}

export function CraftEquation() {
  return (
    <div className="home-craft-equation" aria-label="Income plus Expense creates Net Cash Flow">
      <span className="sr-only">Income plus Expense creates Net Cash Flow.</span>
      <EquationElement label="Income" kind="Element"><CircleDollarSign size={19} /></EquationElement>
      <span className="home-equation-operator" aria-hidden="true">+</span>
      <EquationElement label="Expense" kind="Element"><CreditCard size={19} /></EquationElement>
      <span className="home-equation-arrow" aria-hidden="true">→</span>
      <EquationElement label="Net Cash Flow" kind="Discovery"><Wallet size={19} /></EquationElement>
    </div>
  );
}

const discoveryFields = [
  ["Real lesson", "Cash inflows and outflows become meaningful when compared over the same period."],
  ["Trade-off", "More room later can require limiting optional spending now."],
  ["Risk", "A positive period does not remove uncertainty or guarantee future cash flow."],
  ["Sources", "Reviewed learning content keeps its source trail and safety language."],
] as const;

export function DiscoveryReadingPanel() {
  return (
    <article className="home-reading-panel">
      <div className="home-preview-heading"><span>Discovery detail</span><strong>Source-backed</strong></div>
      <h3>Net Cash Flow</h3>
      <p>The difference between cash inflows and outflows over a defined period.</p>
      <dl>{discoveryFields.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl>
      <p className="home-preview-safety"><ShieldCheck size={15} aria-hidden="true" />Education Only · OECD source trail</p>
    </article>
  );
}

export function WorkspacePreview({ authenticated }: { authenticated: boolean }) {
  return (
    <aside className="home-workspace-preview" aria-label="Workspace persistence preview">
      <div className="home-preview-heading"><span>Canvas snapshot</span><strong>{authenticated ? "Ready to save" : "Sign in required"}</strong></div>
      <div className="home-workspace-lineage" aria-hidden="true">
        <span><CircleDollarSign size={16} />Elements</span><i /><span><Layers3 size={16} />Canvas</span><i /><span><Wallet size={16} />Restore</span>
      </div>
      <p>{authenticated ? "Your authenticated Workspace can save Nodes, positions and Edges." : "Create an account to save Nodes, positions and Edges, then restore them when you return."}</p>
    </aside>
  );
}

export function SimulationPreview() {
  return (
    <aside className="home-simulation-preview" aria-label="Survival Months illustrative result">
      <div className="home-preview-heading"><span>Runtime-verified example</span><strong>Illustrative</strong></div>
      <div className="home-simulation-result"><span>$25,000 reserve</span><b>÷</b><span>$10,000 essential costs</span><output>2.50 months</output></div>
      <ol className="home-simulation-timeline"><li><b>0</b><span>Today</span></li><li><b>2</b><span>Whole months</span></li><li><b>2.5</b><span>Estimated runway</span></li></ol>
      <p className="home-preview-safety"><BookOpenCheck size={15} aria-hidden="true" />Estimate under fixed inputs—not a forecast or advice.</p>
    </aside>
  );
}
