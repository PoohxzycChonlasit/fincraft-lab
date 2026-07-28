import { Gauge, ShieldCheck, Sprout, type LucideIcon } from "lucide-react";
import Image from "next/image";

import { GlassSurface, type GlassSurfaceVariant } from "@/components/ui/glass-surface";

const OUTCOMES = [
  {
    title: "Prepared & Resilient",
    description: "A safety buffer protects cash-flow stability when an unexpected cost arrives.",
    state: "Stable",
    variant: "green",
    icon: ShieldCheck,
    imageSource: "/images/home/cards/prepared-resilient.png",
  },
  {
    title: "High Income, High Pressure",
    description: "Lifestyle load and debt pressure can leave little room for a financial surprise.",
    state: "Risky",
    variant: "amber",
    icon: Gauge,
    imageSource: "/images/home/cards/high-income-high-pressure.png",
  },
  {
    title: "Modest & Mindful",
    description: "Controlled spending can gradually create resilience and more future options.",
    state: "Growing",
    variant: "aqua",
    icon: Sprout,
    imageSource: "/images/home/cards/modest-mindful.png",
  },
] satisfies ReadonlyArray<{
  title: string;
  description: string;
  state: string;
  variant: GlassSurfaceVariant;
  icon: LucideIcon;
  imageSource: string;
}>;

export function HomeFinancialOutcomes() {
  return (
    <section aria-labelledby="financial-outcomes-title" className="home-section">
      <div className="home-section-heading">
        <h2 id="financial-outcomes-title" className="home-kicker">Same Income, Different Outcomes</h2>
        <p className="home-section-summary">Your choices shape your financial world.</p>
      </div>

      <div className="home-outcomes-grid">
        {OUTCOMES.map(({ description, icon: Icon, imageSource, state, title, variant }) => (
          <GlassSurface key={title} as="article" variant={variant} className="home-outcome-card">
            <div className="home-card-artwork home-outcome-visual" aria-hidden="true">
              <Image
                src={imageSource}
                alt=""
                width={1448}
                height={1086}
                loading="lazy"
                sizes="(max-width: 779px) calc(100vw - 64px), (max-width: 1279px) 30vw, 390px"
              />
            </div>
            <div className="home-outcome-title">
              <Icon size={16} strokeWidth={1.7} aria-hidden="true" />
              <h3>{title}</h3>
            </div>
            <p>{description}</p>
            <strong className="home-outcome-state">{state}</strong>
          </GlassSurface>
        ))}
      </div>
    </section>
  );
}
