import { CraftEquation, DiscoveryReadingPanel } from "./home-story-visuals";
import { HomeStoryMedia } from "./home-story-media";
import { StoryActions } from "./home-story-ui";

export function CraftScene() {
  return (
    <section id="home-scene-craft" aria-labelledby="home-scene-two-title" className="home-story-scene home-story-scene--craft" data-scene="craft">
      <HomeStoryMedia desktopPoster="/images/home/world/home-craft-scene.webp" className="home-story-media--scene" overlay="none" objectPosition="center" />
      <div className="home-scene-heading home-scene-heading--ink">
        <p className="home-story-kicker">Scene 02 · Craft</p>
        <h2 id="home-scene-two-title">Bring two forces together. Watch the relationship appear.</h2>
      </div>
      <div className="home-craft-theatre">
        <CraftEquation />
        <aside className="home-scene-caption home-scene-caption--paper">
          <p>Choose two real Elements and overlap them on the Canvas. The active seeded Recipe makes the resulting relationship visible.</p>
          <StoryActions primary={{ href: "/lab", label: "Try the Craft Lab" }} />
        </aside>
      </div>
    </section>
  );
}

export function DiscoverScene() {
  return (
    <section id="home-scene-discover" aria-labelledby="home-scene-three-title" className="home-story-scene home-story-scene--discover" data-scene="discover">
      <HomeStoryMedia desktopPoster="/images/home/world/home-discovery-scene.webp" className="home-story-media--scene" overlay="soft" objectPosition="center" />
      <div className="home-scene-heading home-scene-heading--light">
        <p className="home-story-kicker">Scene 03 · Discover</p>
        <h2 id="home-scene-three-title">Open the idea. Read every layer.</h2>
        <p>A discovery carries a lesson, example, benefit, trade-off, risk, safety note and source trail—not just a new icon.</p>
        <StoryActions primary={{ href: "/lab", label: "Read a Discovery" }} />
      </div>
      <div className="home-discovery-caption"><DiscoveryReadingPanel /></div>
    </section>
  );
}
