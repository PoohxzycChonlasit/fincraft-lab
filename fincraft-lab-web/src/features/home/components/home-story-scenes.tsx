import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { UserProfile } from "@/lib/auth/session";
import { HomeStoryMedia } from "./home-story-media";
import {
  CraftStoryVisual,
  DiscoveryStoryVisual,
  SimulationStoryVisual,
  WorkspaceStoryVisual,
} from "./home-story-visuals";

type StoryAction = {
  href: string;
  label: string;
};

function StoryActions({ primary, secondary }: { primary: StoryAction; secondary?: StoryAction }) {
  return (
    <div className="home-story-actions">
      <Link href={primary.href} className="home-story-button home-story-button-primary">
        <span>{primary.label}</span>
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
      {secondary ? <Link href={secondary.href} className="home-story-button home-story-button-secondary">{secondary.label}</Link> : null}
    </div>
  );
}

function StorySafetyNote() {
  return (
    <p className="home-story-safety-note"><ShieldCheck size={16} aria-hidden="true" /><span>Education Only · Simulation Only · Not Financial Advice</span></p>
  );
}

function LivingFinancialWorld() {
  return (
    <section id="home-scene-living-financial-world" aria-labelledby="home-scene-one-title" className="home-story-scene home-story-scene--hero" data-scene="living-financial-world">
      <HomeStoryMedia
        className="home-story-media--hero"
        desktopPoster="/images/home/financial-city-day-4k.jpg"
        mobilePoster="/images/home/financial-city-day-4k.jpg"
        objectPosition="center"
        overlay="strong"
        priority
        sizes="100vw"
      />
      <div className="home-story-hero-copy">
        <p className="home-story-kicker">Financial Literacy Discovery Lab</p>
        <h1 id="home-scene-one-title">Learn finance by connecting ideas.</h1>
        <p className="home-story-lede">Enter a living financial world where everyday Elements become visible relationships, experiments and decisions you can examine.</p>
        <StoryActions primary={{ href: "/lab", label: "Enter Craft Lab" }} secondary={{ href: "/simulations", label: "Explore Simulations" }} />
        <StorySafetyNote />
      </div>
      <a className="home-story-scroll-cue" href="#home-scene-craft" aria-label="Scroll to Craft scene">Scroll to explore<span aria-hidden="true">↓</span></a>
    </section>
  );
}

function CraftScene() {
  return (
    <section id="home-scene-craft" aria-labelledby="home-scene-two-title" className="home-story-scene home-story-scene--craft" data-scene="craft">
      <HomeStoryMedia className="home-story-media--panel" overlay="none">
        <CraftStoryVisual />
      </HomeStoryMedia>
      <div className="home-story-copy home-story-copy--craft">
        <p className="home-story-kicker">Scene 02 · Craft</p>
        <h2 id="home-scene-two-title">Make the relationship visible.</h2>
        <p>Select two real Elements, drag them onto the Canvas and overlap them. The active seeded Recipe <strong>Income + Expense → Net Cash Flow</strong> turns a familiar equation into an observable discovery.</p>
        <StoryActions primary={{ href: "/lab", label: "Try the Craft Lab" }} />
      </div>
    </section>
  );
}

function DiscoverScene() {
  return (
    <section id="home-scene-discover" aria-labelledby="home-scene-three-title" className="home-story-scene home-story-scene--discover" data-scene="discover">
      <div className="home-story-copy home-story-copy--discover">
        <p className="home-story-kicker">Scene 03 · Discover</p>
        <h2 id="home-scene-three-title">A discovery carries meaning, not just a new icon.</h2>
        <p>Open the detail behind a result: a real lesson, a grounded example, possible benefits, trade-offs, risks, safety language and the source trail that supports it.</p>
        <StoryActions primary={{ href: "/lab", label: "Read a Discovery" }} />
      </div>
      <HomeStoryMedia className="home-story-media--detail" overlay="soft">
        <DiscoveryStoryVisual />
      </HomeStoryMedia>
    </section>
  );
}

function SaveTheWorldScene({ user }: { user: UserProfile | null }) {
  return (
    <section id="home-scene-save-the-world" aria-labelledby="home-scene-four-title" className="home-story-scene home-story-scene--workspace" data-scene="save-the-world">
      <HomeStoryMedia className="home-story-media--world" overlay="none">
        <WorkspaceStoryVisual />
      </HomeStoryMedia>
      <div className="home-story-copy home-story-copy--workspace">
        <p className="home-story-kicker">Scene 04 · Save the World</p>
        <h2 id="home-scene-four-title">Keep the world you built.</h2>
        <p>Authenticated Workspaces save Nodes, positions and Edges with autosave and restoration. Guest exploration stays temporary; sign in when you want your personal canvas to persist.</p>
        <StoryActions primary={user ? { href: "/workspace", label: "Open Workspace" } : { href: "/register", label: "Create Account to Save" }} />
      </div>
    </section>
  );
}

function SimulateConsequencesScene() {
  return (
    <section id="home-scene-simulate-consequences" aria-labelledby="home-scene-five-title" className="home-story-scene home-story-scene--simulation" data-scene="simulate-consequences">
      <div className="home-story-copy home-story-copy--simulation">
        <p className="home-story-kicker">Scene 05 · Simulate Consequences</p>
        <h2 id="home-scene-five-title">Test assumptions before they become consequences.</h2>
        <p>Emergency Fund Runway presents the existing Survival Months model: reserve divided by essential monthly costs, shown as an educational estimate with assumptions, limitations and sources.</p>
        <StoryActions primary={{ href: "/simulations", label: "Explore Simulations" }} />
      </div>
      <HomeStoryMedia className="home-story-media--instrument" overlay="none">
        <SimulationStoryVisual />
      </HomeStoryMedia>
    </section>
  );
}

function EnterTheLabScene({ user }: { user: UserProfile | null }) {
  return (
    <section id="home-scene-enter-the-lab" aria-labelledby="home-scene-six-title" className="home-story-scene home-story-scene--final" data-scene="enter-the-lab">
      <HomeStoryMedia
        className="home-story-media--hero"
        desktopPoster="/images/home/financial-city-night-4k.jpg"
        mobilePoster="/images/home/financial-city-night-4k.jpg"
        objectPosition="center"
        overlay="strong"
        sizes="100vw"
      />
      <div className="home-story-final-copy">
        <p className="home-story-kicker">Scene 06 · Enter the Lab</p>
        <h2 id="home-scene-six-title">Build your own living financial system.</h2>
        <p>Connect Elements, read the meaning behind discoveries, save your Workspace and test assumptions in one education-first loop.</p>
        <StoryActions primary={{ href: "/lab", label: "Enter Craft Lab" }} secondary={user ? { href: "/workspace", label: "Open Workspace" } : { href: "/register", label: "Create Account" }} />
        <StorySafetyNote />
      </div>
    </section>
  );
}

export function HomeStoryScenes({ user }: { user: UserProfile | null }) {
  return (
    <>
      <LivingFinancialWorld />
      <CraftScene />
      <DiscoverScene />
      <SaveTheWorldScene user={user} />
      <SimulateConsequencesScene />
      <EnterTheLabScene user={user} />
    </>
  );
}
