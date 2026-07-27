import { ProductShell } from "@/components/brand/product-shell";
import { getSessionUser } from "@/lib/auth/session";
import { HomeHero } from "@/features/home/components/home-hero";
import { HomeVisualDemo } from "@/features/home/components/home-visual-demo";
import { HomeHowItWorks } from "@/features/home/components/home-how-it-works";
import { HomeCoreExperiences } from "@/features/home/components/home-core-experiences";
import { HomeAccountExplanation } from "@/features/home/components/home-account-explanation";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <ProductShell activeTab="home" user={user}>
      <div className="mx-auto max-w-4xl space-y-12 py-2 sm:py-6">
        <HomeHero user={user} />
        <HomeVisualDemo />
        <HomeHowItWorks />
        <HomeCoreExperiences />
        <HomeAccountExplanation />
      </div>
    </ProductShell>
  );
}
