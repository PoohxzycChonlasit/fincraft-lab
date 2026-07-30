import Link from "next/link";
import { BookOpen, Layers, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

function ActCraftRitual() {
  return (
    <section aria-labelledby="home-act3-title" className="home-section home-act-section">
      <div className="home-act-content surface-paper">
        <div className="home-act-badge">
          <Sparkles size={16} />
          <span>Act III — Craft Ritual</span>
        </div>
        <h2 id="home-act3-title" className="font-section-title">Drag, combine, and discover.</h2>
        <p className="font-body">
          Learning in FinCraft Lab happens through direct action. Select Base elements from your library, position them on the infinite canvas, and overlap any two compatible ideas to unlock new financial concepts.
        </p>
        <div className="home-steps-grid">
          <div className="home-step-item">
            <span className="home-step-number">01</span>
            <h4>Select Elements</h4>
            <p className="font-caption">Browse base concepts in your element library.</p>
          </div>
          <div className="home-step-item">
            <span className="home-step-number">02</span>
            <h4>Position on Canvas</h4>
            <p className="font-caption">Arrange ideas visually to explore relationships.</p>
          </div>
          <div className="home-step-item">
            <span className="home-step-number">03</span>
            <h4>Discover Insights</h4>
            <p className="font-caption">Combine two nodes to trigger immediate discovery.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActConsequenceJournal() {
  return (
    <section aria-labelledby="home-act4-title" className="home-section home-act-section">
      <div className="home-act-content surface-paper">
        <div className="home-act-badge">
          <BookOpen size={16} />
          <span>Act IV — Read the Consequences</span>
        </div>
        <h2 id="home-act4-title" className="font-section-title">Beyond definitions: complete financial context.</h2>
        <p className="font-body">
          Every unlocked concept reveals detailed educational guidance: real-life lessons, practical examples, potential benefits, trade-offs, hidden risks, and verified international sources.
        </p>
        <div className="home-evidence-grid">
          <div className="home-evidence-pill">Real Lesson</div>
          <div className="home-evidence-pill">Practical Example</div>
          <div className="home-evidence-pill">Possible Benefit</div>
          <div className="home-evidence-pill">Trade-off & Risk</div>
          <div className="home-evidence-pill">Safety Label</div>
          <div className="home-evidence-pill">Verified Sources</div>
        </div>
      </div>
    </section>
  );
}

function ActWorkspaceLineage() {
  return (
    <section aria-labelledby="home-act5-title" className="home-section home-act-section">
      <div className="home-act-content surface-solid">
        <div className="home-act-badge">
          <Layers size={16} />
          <span>Act V — Personal World Archive</span>
        </div>
        <h2 id="home-act5-title" className="font-section-title">Save your canvas, build your lineage.</h2>
        <p className="font-body">
          Authenticated users can organize their discoveries into persistent Workspaces. Save node positions, connection edges, and companion goals across sessions.
        </p>
        <div className="home-workspace-cta-row">
          <Link href="/lab" className="home-button home-button-primary">Try Guest Lab</Link>
          <Link href="/register" className="home-button home-button-secondary">Create Account to Save</Link>
        </div>
      </div>
    </section>
  );
}

function ActSimulationPreview() {
  return (
    <section aria-labelledby="home-act6-title" className="home-section home-act-section">
      <div className="home-act-content surface-solid">
        <div className="home-act-badge">
          <TrendingUp size={16} />
          <span>Act VI — Financial Consequence Instrument</span>
        </div>
        <h2 id="home-act6-title" className="font-section-title">Test assumptions with Emergency Fund Runway.</h2>
        <p className="font-body">
          Run real financial simulations to calculate survival months, analyze expense baselines, and understand buffer limitations under realistic scenarios.
        </p>
        <div className="home-sim-preview">
          <div className="home-sim-stat">
            <span className="font-label">Target Simulation</span>
            <span className="font-section-title">Emergency Fund Runway</span>
          </div>
          <Link href="/simulations" className="home-button home-button-secondary">
            Open Simulations
          </Link>
        </div>
        <div className="home-safety-banner">
          <ShieldCheck size={16} />
          <span>Education Only — Simulation Only — Not Financial Advice</span>
        </div>
      </div>
    </section>
  );
}

export function HomeNarrativeSections() {
  return (
    <div className="home-narrative-flow">
      <ActCraftRitual />
      <ActConsequenceJournal />
      <ActWorkspaceLineage />
      <ActSimulationPreview />
    </div>
  );
}
