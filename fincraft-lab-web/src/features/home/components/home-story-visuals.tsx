import {
  ArrowRight,
  BookOpenCheck,
  CircleDollarSign,
  CreditCard,
  Layers3,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";

function StoryNode({
  className,
  label,
  detail,
  children,
}: {
  className?: string;
  label: string;
  detail: string;
  children: ReactNode;
}) {
  return (
    <span className={`home-story-node${className ? ` ${className}` : ""}`}>
      <span className="home-story-node-icon">{children}</span>
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
    </span>
  );
}

export function CraftStoryVisual() {
  return (
    <div className="home-story-visual home-story-craft-visual">
      <p className="home-story-visual-label">Verified active recipe</p>
      <div className="home-story-equation">
        <StoryNode label="Income" detail="BASE">
          <CircleDollarSign size={20} aria-hidden="true" />
        </StoryNode>
        <span className="home-story-operator" aria-hidden="true">+</span>
        <StoryNode label="Expense" detail="BASE">
          <CreditCard size={20} aria-hidden="true" />
        </StoryNode>
        <ArrowRight className="home-story-equation-arrow" size={22} aria-hidden="true" />
        <StoryNode className="home-story-node-output" label="Net Cash Flow" detail="DISCOVERY">
          <Wallet size={22} aria-hidden="true" />
        </StoryNode>
      </div>
      <div className="home-story-instruction">
        <span className="home-story-instruction-mark" aria-hidden="true">01</span>
        <span>Choose two Elements, then overlap them on the Canvas.</span>
      </div>
    </div>
  );
}

export function DiscoveryStoryVisual() {
  return (
    <div className="home-story-visual home-story-discovery-visual">
      <div className="home-story-visual-label-row">
        <p className="home-story-visual-label">Discovery detail</p>
        <span className="home-story-status-mark">Source-backed</span>
      </div>
      <h3>Net Cash Flow</h3>
      <p className="home-story-visual-summary">The difference between cash inflows and outflows over a defined period.</p>
      <dl className="home-story-detail-list">
        <div><dt>Real lesson</dt><dd>Positive cash flow creates margin and flexibility.</dd></div>
        <div><dt>Example</dt><dd>GBP 2,500 income − GBP 2,000 costs = GBP 500 surplus.</dd></div>
        <div><dt>Trade-off</dt><dd>A surplus requires capping immediate optional spending.</dd></div>
      </dl>
      <div className="home-story-safety-line"><ShieldCheck size={16} aria-hidden="true" /><span>Education Only · OECD source trail</span></div>
    </div>
  );
}

export function WorkspaceStoryVisual() {
  return (
    <div className="home-story-visual home-story-workspace-visual">
      <div className="home-story-visual-label-row">
        <p className="home-story-visual-label">Authenticated workspace</p>
        <span className="home-story-status-mark">Autosave on</span>
      </div>
      <div className="home-story-workspace-map">
        <span className="home-story-map-edge home-story-map-edge-one" />
        <span className="home-story-map-edge home-story-map-edge-two" />
        <span className="home-story-map-edge home-story-map-edge-three" />
        <StoryNode className="home-story-map-node-one" label="Income" detail="Node">
          <CircleDollarSign size={18} aria-hidden="true" />
        </StoryNode>
        <StoryNode className="home-story-map-node-two" label="Cash Flow" detail="Node">
          <Wallet size={18} aria-hidden="true" />
        </StoryNode>
        <StoryNode className="home-story-map-node-three" label="Workspace" detail="Saved">
          <Layers3 size={18} aria-hidden="true" />
        </StoryNode>
      </div>
      <p className="home-story-workspace-caption">Nodes, positions and Edges restore when you return.</p>
    </div>
  );
}

export function SimulationStoryVisual() {
  return (
    <div className="home-story-visual home-story-simulation-visual">
      <div className="home-story-visual-label-row">
        <p className="home-story-visual-label">Survival Months model</p>
        <span className="home-story-status-mark">Illustrative</span>
      </div>
      <div className="home-story-formula">
        <span>Reserve</span><strong>÷</strong><span>Essential monthly costs</span><ArrowRight size={18} aria-hidden="true" /><strong>Runway</strong>
      </div>
      <div className="home-story-timeline" aria-hidden="true">
        <span className="home-story-timeline-line" />
        <span className="home-story-timeline-point home-story-timeline-point-start"><b>0</b><small>today</small></span>
        <span className="home-story-timeline-point home-story-timeline-point-middle"><b>2</b><small>months</small></span>
        <span className="home-story-timeline-point home-story-timeline-point-end"><b>4</b><small>months</small></span>
      </div>
      <div className="home-story-safety-line"><BookOpenCheck size={16} aria-hidden="true" /><span>An educational estimate, not a prediction or advice.</span></div>
    </div>
  );
}
