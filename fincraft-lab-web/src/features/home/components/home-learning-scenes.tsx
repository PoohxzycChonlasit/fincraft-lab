import { CraftMotionGraphic, DiscoveryMotionGraphic } from "./home-motion-graphics";
import { StoryActions } from "./home-story-ui";

export function CraftScene() {
  return (
    <section id="home-scene-craft" aria-labelledby="home-scene-two-title" className="home-story-scene home-story-scene--craft" data-scene="craft">
      <div className="home-scene-layout">
        <div className="home-scene-heading home-scene-heading--paper">
          <p className="home-story-kicker">Scene 02 · Craft</p>
          <h2 id="home-scene-two-title">Bring two forces together. Watch the relationship appear.</h2>
          <p>Choose two Elements, place them on the Canvas and let the approved Recipe reveal what they mean together.</p>
          <StoryActions primary={{ href: "/lab", label: "Try the Craft Lab" }} />
        </div>
        <div className="home-scene-demo"><CraftMotionGraphic /></div>
      </div>
    </section>
  );
}

export function DiscoverScene() {
  return (
    <section id="home-scene-discover" aria-labelledby="home-scene-three-title" className="home-story-scene home-story-scene--discover" data-scene="discover">
      <div className="home-scene-layout">
        <div className="home-scene-heading home-scene-heading--paper">
          <p className="home-story-kicker">Scene 03 · Discover</p>
          <h2 id="home-scene-three-title">Open the idea. Read every layer.</h2>
          <p>A Discovery explains meaning, story, lesson, upside, downside, risk and the next combination—not just a new icon.</p>
          <StoryActions primary={{ href: "/lab", label: "Read a Discovery" }} />
        </div>
        <div className="home-scene-demo"><DiscoveryMotionGraphic /></div>
      </div>
    </section>
  );
}
