import { Gauge, ShieldCheck, Sprout, type LucideIcon } from "lucide-react";
import Image from "next/image";

import { GlassSurface, type GlassSurfaceVariant } from "@/components/ui/glass-surface";

const OUTCOMES = [
  {
    title: "Prepared & Resilient",
    description: "A safety buffer protects cash-flow stability when an unexpected cost arrives.",
    details: ["Safety buffer", "Stable cash flow"],
    state: "Stable",
    variant: "green",
    icon: ShieldCheck,
    imageSource: "/images/home/cards/prepared-resilient.png",
  },
  {
    title: "High Income, High Pressure",
    description: "Lifestyle load and debt pressure can leave little room for a financial surprise.",
    details: ["Debt pressure", "High lifestyle load"],
    state: "Risky",
    variant: "amber",
    icon: Gauge,
    imageSource: "/images/home/cards/high-income-high-pressure.png",
  },
  {
    title: "Modest & Mindful",
    description: "Controlled spending can gradually create resilience and more future options.",
    details: ["Controlled spending", "Growing options"],
    state: "Growing",
    variant: "aqua",
    icon: Sprout,
    imageSource: "/images/home/cards/modest-mindful.png",
  },
] satisfies ReadonlyArray<{
  title: string;
  description: string;
  details: readonly [string, string];
  state: string;
  variant: GlassSurfaceVariant;
  icon: LucideIcon;
  imageSource: string;
}>;

export function HomeFinancialOutcomes() {
  return (
    <section aria-labelledby="financial-outcomes-title" className="home-section">
      <div className="home-section-heading home-section-heading-split">
        <div>
          <p className="home-kicker">Same Income, Different Outcomes</p>
          <h2 id="financial-outcomes-title">Choices shape your financial world.</h2>
        </div>
        <p>Income is only one part of the picture. Spending, debt, buffers, and time change what becomes possible.</p>
      </div>

      <div className="home-outcomes-grid">
        {OUTCOMES.map(({ description, details, icon: Icon, imageSource, state, title, variant }) => (
          <GlassSurface key={title} as="article" variant={variant} className="home-outcome-card">
            <div className="home-card-artwork home-outcome-visual" aria-hidden="true">
              <Image
                src={imageSource}
                alt=""
                fill
                loading="lazy"
                sizes="(max-width: 779px) calc(100vw - 64px), (max-width: 1279px) 30vw, 390px"
              />
              <span className="home-card-icon"><Icon size={20} strokeWidth={1.6} /></span>
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <ul aria-label={`${title} financial factors`}>
              {details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
            <strong className="home-outcome-state">State: {state}</strong>
          </GlassSurface>
        ))}
      </div>
    </section>
  );
}
