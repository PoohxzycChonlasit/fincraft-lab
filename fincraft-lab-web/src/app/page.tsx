import { ProductShell } from "@/components/brand/product-shell";
import { HomeConceptCombination } from "@/features/home/components/home-concept-combination";
import { HomeFinalCta } from "@/features/home/components/home-final-cta";
import { HomeFinancialOutcomes } from "@/features/home/components/home-financial-outcomes";
import { HomeHero } from "@/features/home/components/home-hero";
import { HomeHowItWorks } from "@/features/home/components/home-how-it-works";
import { getSessionUser } from "@/lib/auth/session";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <ProductShell activeTab="home" contentMode="wide" user={user}>
      <div className="home-page">
        <div className="home-content">
          <HomeHero user={user} />
          <HomeConceptCombination />
          <HomeHowItWorks />
          <HomeFinancialOutcomes />
          <HomeFinalCta />
        </div>
      </div>
    </ProductShell>
  );
}
