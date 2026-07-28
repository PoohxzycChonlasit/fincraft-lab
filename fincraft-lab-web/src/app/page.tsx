import { ProductShell } from "@/components/brand/product-shell";
import { HomeAbout } from "@/features/home/components/home-about";
import { HomeFinalCta } from "@/features/home/components/home-final-cta";
import { HomeFeatures } from "@/features/home/components/home-features";
import { HomeHero } from "@/features/home/components/home-hero";
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
          <HomeAbout />
          <HomeFeatures />
          <HomeFinalCta user={user} />
        </div>
      </div>
    </ProductShell>
  );
}
