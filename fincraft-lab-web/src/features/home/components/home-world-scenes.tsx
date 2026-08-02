import { ChevronDown } from "lucide-react";
import type { UserProfile } from "@/lib/auth/session";
import { WorkspaceMotionGraphic } from "./home-motion-graphics";
import { HomeStoryMedia } from "./home-story-media";
import { StoryActions, StorySafetyNote } from "./home-story-ui";

const worldMedia = {
  desktopPoster: "/images/home/world/home-world-light-desktop.webp",
  mobilePoster: "/images/home/world/home-world-light-mobile.webp",
  darkDesktopPoster: "/images/home/world/home-world-dark-desktop.webp",
  darkMobilePoster: "/images/home/world/home-world-dark-mobile.webp",
};

export function LivingFinancialWorld() {
  return (
    <section id="home-scene-living-financial-world" aria-labelledby="home-scene-one-title" className="home-story-scene home-story-scene--hero" data-scene="living-financial-world">
      <HomeStoryMedia {...worldMedia} className="home-story-media--world" overlay="none" objectPosition="center" priority />
      <div className="home-world-copy home-world-copy--hero">
        <p className="home-story-kicker">FinCraft Lab · The Living Financial World</p>
        <h1 id="home-scene-one-title">Money is not a list. It is a living system.</h1>
        <p className="home-story-lede">Combine financial Elements in Craft Lab, read the Discovery they reveal, then test one assumption in Simulations. Authenticated Workspaces keep the learning trail available.</p>
        <StoryActions primary={{ href: "/lab", label: "Enter Craft Lab" }} secondary={{ href: "/simulations", label: "Explore Simulations" }} />
        <StorySafetyNote />
      </div>
      <a className="home-story-scroll-cue" href="#home-scene-craft">
        <span>Enter the story</span><ChevronDown size={17} aria-hidden="true" />
      </a>
    </section>
  );
}

export function EnterTheLabScene({ user }: { user: UserProfile | null }) {
  const secondary = user
    ? { href: "/workspace", label: "Open Workspace" }
    : { href: "/register", label: "Register to save" };

  return (
    <section id="home-scene-enter-the-lab" aria-labelledby="home-scene-six-title" className="home-story-scene home-story-scene--final" data-scene="enter-the-lab">
      <div className="home-scene-layout">
        <div className="home-scene-heading home-scene-heading--paper">
          <p className="home-story-kicker">Scene 06 · Enter the Lab</p>
          <h2 id="home-scene-six-title">Build the world. Read what it means.</h2>
          <p>Craft a relationship, keep the Discovery and test one assumption at a time. Resume the same context when you return.</p>
          <StoryActions primary={{ href: "/lab", label: "Enter Craft Lab" }} secondary={secondary} />
        </div>
        <div className="home-scene-demo"><WorkspaceMotionGraphic authenticated={Boolean(user)} /></div>
      </div>
      <footer className="home-world-footer">
        <span>FinCraft Lab · Financial Literacy Discovery Lab</span>
        <StorySafetyNote />
      </footer>
    </section>
  );
}
