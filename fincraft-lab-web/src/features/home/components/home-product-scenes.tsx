import { GraphMotionGraphic, SimulationMotionGraphic } from "./home-motion-graphics";
import { StoryActions } from "./home-story-ui";

export function GraphScene() {
  return (
    <section id="home-scene-graph" aria-labelledby="home-scene-four-title" className="home-story-scene home-story-scene--graph" data-scene="graph">
      <div className="home-scene-layout">
        <div className="home-scene-heading home-scene-heading--paper">
          <p className="home-story-kicker">Scene 04 · Graph</p>
          <h2 id="home-scene-four-title">See the system, not just the pieces.</h2>
          <p>Trace a bounded relationship from Income and Expense to Net Cash Flow, Saving Capacity and Emergency Fund.</p>
          <StoryActions primary={{ href: "/lab", label: "Build the relationship" }} />
        </div>
        <div className="home-scene-demo"><GraphMotionGraphic /></div>
      </div>
    </section>
  );
}

export function SimulateConsequencesScene() {
  return (
    <section id="home-scene-simulate-consequences" aria-labelledby="home-scene-five-title" className="home-story-scene home-story-scene--simulation" data-scene="simulate-consequences">
      <div className="home-scene-layout">
        <div className="home-scene-heading home-scene-heading--paper">
          <p className="home-story-kicker">Scene 05 · Simulate</p>
          <h2 id="home-scene-five-title">Let one assumption travel through time.</h2>
          <p>Explore a fixed educational example with its inputs, runway and limitations visible beside the result.</p>
          <StoryActions primary={{ href: "/simulations", label: "Explore Simulations" }} />
        </div>
        <div className="home-scene-demo"><SimulationMotionGraphic /></div>
      </div>
    </section>
  );
}
