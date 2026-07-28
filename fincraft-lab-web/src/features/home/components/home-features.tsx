import { BookOpenCheck, Boxes, Link2, PanelsTopLeft, type LucideIcon } from "lucide-react";

import { GlassSurface, type GlassSurfaceVariant } from "@/components/ui/glass-surface";

const FEATURES = [
  {
    title: "Craft Financial Ideas",
    description: "Drag financial Elements onto the Canvas and combine them to create new discoveries.",
    evidence: ["Category Element Library", "Native drag", "Canvas placement", "Collision Craft"],
    icon: Boxes,
    visualIcon: PanelsTopLeft,
    variant: "aqua",
    visual: "craft",
  },
  {
    title: "Learn Through Connections",
    description: "Explore meanings, examples, trade-offs, risks, suggested connections and trusted reference sources.",
    evidence: ["Element Info", "Discovery Detail", "Progressive no-recipe guidance", "International official references"],
    icon: Link2,
    visualIcon: BookOpenCheck,
    variant: "amber",
    visual: "connections",
  },
  {
    title: "Build Your Workspace",
    description: "Save Nodes, connections and discoveries in personal Workspaces and continue learning across sessions.",
    evidence: ["Workspace CRUD", "Canvas node and connection persistence", "Auto-save", "Last Discovery restoration", "Tidy Canvas"],
    icon: PanelsTopLeft,
    visualIcon: Boxes,
    variant: "green",
    visual: "workspace",
  },
] satisfies ReadonlyArray<{
  title: string;
  description: string;
  evidence: readonly string[];
  icon: LucideIcon;
  visualIcon: LucideIcon;
  variant: GlassSurfaceVariant;
  visual: "craft" | "connections" | "workspace";
}>;

function FeatureVisual({ kind, Icon }: { kind: (typeof FEATURES)[number]["visual"]; Icon: LucideIcon }) {
  if (kind === "workspace") {
    return (
      <div className="home-feature-visual home-feature-visual-workspace" aria-hidden="true">
        <div className="home-workspace-toolbar"><span /><span /><span /></div>
        <div className="home-workspace-row"><Icon size={17} /><span /><b /></div>
        <div className="home-workspace-row"><Icon size={17} /><span /><b /></div>
        <div className="home-workspace-row"><Icon size={17} /><span /><b /></div>
      </div>
    );
  }

  return (
    <div className={`home-feature-visual home-feature-visual-${kind}`} aria-hidden="true">
      <span className="home-feature-connection home-feature-connection-one" />
      <span className="home-feature-connection home-feature-connection-two" />
      <span className="home-feature-node home-feature-node-one"><Icon size={17} /></span>
      <span className="home-feature-node home-feature-node-two"><Icon size={17} /></span>
      <span className="home-feature-node home-feature-node-three"><Icon size={17} /></span>
    </div>
  );
}

export function HomeFeatures() {
  return (
    <section aria-labelledby="home-features-title" className="home-features home-section">
      <div className="home-features-heading">
        <div>
          <p className="home-kicker">The FinCraft loop</p>
          <h2 id="home-features-title">Three ways to learn by making connections.</h2>
        </div>
        <p>Each step keeps the learning practical, visible and grounded in the product you can use today.</p>
      </div>

      <div className="home-feature-grid">
        {FEATURES.map(({ description, evidence, icon: Icon, title, variant, visual, visualIcon: VisualIcon }) => (
          <GlassSurface key={title} as="article" variant={variant} className="home-feature-card">
            <FeatureVisual kind={visual} Icon={VisualIcon} />
            <div className="home-feature-title">
              <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
              <h3>{title}</h3>
            </div>
            <p>{description}</p>
            <ul aria-label={`${title} evidence`}>
              {evidence.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </GlassSurface>
        ))}
      </div>
    </section>
  );
}
