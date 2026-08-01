import type { UserProfile } from "@/lib/auth/session";
import { HomeStoryScenes } from "./home-story-scenes";

export function HomeStory({ user }: { user: UserProfile | null }) {
  return (
    <div className="home-story" data-home-scroll-owner="document">
      <HomeStoryScenes user={user} />
    </div>
  );
}
