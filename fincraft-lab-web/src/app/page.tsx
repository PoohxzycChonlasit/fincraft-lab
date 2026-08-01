import { ProductShell } from "@/components/brand/product-shell";
import { HomeStory } from "@/features/home/components/home-story";
import { getSessionUser } from "@/lib/auth/session";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <ProductShell activeTab="home" contentMode="wide" layoutMode="home" user={user}>
      <HomeStory user={user} />
    </ProductShell>
  );
}
