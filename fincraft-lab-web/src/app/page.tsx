import { ProductShell } from "@/components/brand/product-shell";
import { HomeFinalCta } from "@/features/home/components/home-final-cta";
import { HomeHero } from "@/features/home/components/home-hero";
import { HomeNarrativeSections } from "@/features/home/components/home-narrative-sections";
import { HomeRecipePreview } from "@/features/home/components/home-recipe-preview";
import { getSessionUser } from "@/lib/auth/session";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <ProductShell activeTab="home" contentMode="wide" user={user}>
      <div className="home-page">
        <div className="home-content">
          <HomeHero user={user} />
          <HomeRecipePreview />
          <HomeNarrativeSections />
          <HomeFinalCta user={user} />
        </div>
      </div>
    </ProductShell>
  );
}
