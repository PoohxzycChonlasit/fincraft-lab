import type { UserProfile } from "@/lib/auth/session";
import { HomeStoryMedia } from "./home-story-media";
import { SimulationPreview, WorkspacePreview } from "./home-story-visuals";
import { StoryActions } from "./home-story-ui";

export function SaveTheWorldScene({ user }: { user: UserProfile | null }) {
  const action = user
    ? { href: "/workspace", label: "Open Workspace" }
    : { href: "/register", label: "Create account to save" };

  return (
    <section id="home-scene-save-the-world" aria-labelledby="home-scene-four-title" className="home-story-scene home-story-scene--workspace" data-scene="save-the-world">
      <HomeStoryMedia desktopPoster="/images/home/world/home-workspace-scene.webp" className="home-story-media--scene" overlay="none" objectPosition="center" />
      <div className="home-scene-heading home-scene-heading--light">
        <p className="home-story-kicker">Scene 04 · Workspace</p>
        <h2 id="home-scene-four-title">Keep the world and its lineage.</h2>
        <p>Authenticated Workspaces persist Nodes, positions and Edges. Guest exploration remains temporary until you choose to save it.</p>
        <StoryActions primary={action} />
      </div>
      <div className="home-product-preview home-product-preview--workspace"><WorkspacePreview authenticated={Boolean(user)} /></div>
    </section>
  );
}

export function SimulateConsequencesScene() {
  return (
    <section id="home-scene-simulate-consequences" aria-labelledby="home-scene-five-title" className="home-story-scene home-story-scene--simulation" data-scene="simulate-consequences">
      <HomeStoryMedia desktopPoster="/images/home/world/home-simulation-scene.webp" className="home-story-media--scene" overlay="soft" objectPosition="center" />
      <div className="home-scene-heading home-scene-heading--light">
        <p className="home-story-kicker">Scene 05 · Simulate</p>
        <h2 id="home-scene-five-title">Let one assumption travel through time.</h2>
        <p>Emergency Fund Runway divides a reserve by essential monthly costs, then states its assumptions and limitations beside the result.</p>
        <StoryActions primary={{ href: "/simulations", label: "Explore Simulations" }} />
      </div>
      <div className="home-product-preview home-product-preview--simulation"><SimulationPreview /></div>
    </section>
  );
}
