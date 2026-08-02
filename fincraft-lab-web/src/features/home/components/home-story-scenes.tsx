import type { UserProfile } from "@/lib/auth/session";
import { CraftScene, DiscoverScene } from "./home-learning-scenes";
import { GraphScene, SimulateConsequencesScene } from "./home-product-scenes";
import { EnterTheLabScene, LivingFinancialWorld } from "./home-world-scenes";

export function HomeStoryScenes({ user }: { user: UserProfile | null }) {
  return (
    <>
      <LivingFinancialWorld />
      <CraftScene />
      <DiscoverScene />
      <GraphScene />
      <SimulateConsequencesScene />
      <EnterTheLabScene user={user} />
    </>
  );
}
