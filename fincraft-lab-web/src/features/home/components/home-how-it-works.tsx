import { BookOpenCheck, GitMerge, PanelsTopLeft, type LucideIcon } from "lucide-react";

import { GlassSurface, type GlassSurfaceVariant } from "@/components/ui/glass-surface";

const STEPS = [
  {
    step: "1",
    title: "Place Elements",
    description: "Choose starter financial ideas from the library and place them on your canvas.",
    icon: PanelsTopLeft,
    variant: "aqua",
  },
  {
    step: "2",
    title: "Combine",
    description: "Bring two elements together to reveal how their financial relationships work.",
    icon: GitMerge,
    variant: "amber",
  },
  {
    step: "3",
    title: "Learn",
    description: "Explore practical lessons, trade-offs, and real-life insights behind each discovery.",
    icon: BookOpenCheck,
    variant: "green",
  },
] satisfies ReadonlyArray<{
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
  variant: GlassSurfaceVariant;
}>;

export function HomeHowItWorks() {
  return (
    <section aria-labelledby="how-it-works-title" className="home-section">
      <div className="home-section-heading">
        <p className="home-kicker">How It Works</p>
        <h2 id="how-it-works-title">A simple lab for connecting financial ideas.</h2>
      </div>
      <div className="home-how-grid">
        {STEPS.map(({ description, icon: Icon, step, title, variant }) => (
          <GlassSurface key={step} as="article" variant={variant} className="home-how-card">
            <div className="home-step-visual" aria-hidden="true">
              <span>{step}</span>
              <Icon size={30} strokeWidth={1.7} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
          </GlassSurface>
        ))}
      </div>
    </section>
  );
}
