import { ProductShell } from "@/components/brand/product-shell";
import { HomeConceptCombination } from "@/features/home/components/home-concept-combination";
import { HomeFinalCta } from "@/features/home/components/home-final-cta";
import { HomeFinancialOutcomes } from "@/features/home/components/home-financial-outcomes";
import { HomeHero } from "@/features/home/components/home-hero";
import { HomeHowItWorks } from "@/features/home/components/home-how-it-works";
import { THEME_COOKIE_NAME } from "@/features/theme/constants/theme-constants";
import { parseThemePreference } from "@/features/theme/types/theme-types";
import { getSessionUser } from "@/lib/auth/session";
import { cookies } from "next/headers";

export default async function HomePage() {
  const [user, cookieStore] = await Promise.all([getSessionUser(), cookies()]);
  const themePreference = parseThemePreference(cookieStore.get(THEME_COOKIE_NAME)?.value);

  return (
    <ProductShell activeTab="home" contentMode="wide" user={user}>
      <div className="home-page">
        <div className="home-content">
          <HomeHero user={user} initialThemePreference={themePreference} />
          <HomeConceptCombination />
          <HomeHowItWorks />
          <HomeFinancialOutcomes />
          <HomeFinalCta />
        </div>
      </div>
    </ProductShell>
  );
}
