"use client";

import { ArrowRight, BookOpenCheck, CheckCircle2, CircleDollarSign, CreditCard, Layers3, MessageCircle, Save, ShieldAlert, WalletCards } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

function useMotionReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !node || !("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setRevealed(true);
      observer.disconnect();
    }, { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}

function MotionFrame({ className, children }: { className: string; children: ReactNode }) {
  const { ref, revealed } = useMotionReveal();
  return <div ref={ref} className={`home-motion-graphic ${className}`} data-motion-revealed={revealed}>{children}</div>;
}

function DemoEyebrow({ children }: { children: ReactNode }) {
  return <p className="home-motion-graphic__eyebrow">{children}</p>;
}

function DemoTitle({ children }: { children: ReactNode }) {
  return <h3 className="home-motion-graphic__title">{children}</h3>;
}

function FlowCard({ label, detail, icon, result = false }: { label: string; detail: string; icon: ReactNode; result?: boolean }) {
  return (
    <div className={`home-craft-motion__card${result ? " home-craft-motion__card--result" : ""}`}>
      <span className="home-craft-motion__icon" aria-hidden="true">{icon}</span>
      <span><strong>{label}</strong><small>{detail}</small></span>
    </div>
  );
}

export function CraftMotionGraphic() {
  return (
    <MotionFrame className="home-motion-graphic--craft" >
      <DemoEyebrow>Focused demo · Craft</DemoEyebrow>
      <DemoTitle>Two Elements make one readable relationship.</DemoTitle>
      <div className="home-craft-motion__flow" aria-label="Income and Expense combine into Net Cash Flow">
        <FlowCard label="Income" detail="Element" icon={<CircleDollarSign size={20} />} />
        <span className="home-craft-motion__operator" aria-hidden="true">+</span>
        <FlowCard label="Expense" detail="Element" icon={<CreditCard size={20} />} />
        <ArrowRight className="home-craft-motion__arrow" size={20} aria-hidden="true" />
        <FlowCard label="Net Cash Flow" detail="Discovery" icon={<WalletCards size={20} />} result />
      </div>
      <p className="home-motion-graphic__note"><CheckCircle2 size={15} aria-hidden="true" />The Canvas keeps the combination visible.</p>
    </MotionFrame>
  );
}

const discoveryLayers = [
  ["Meaning", "Cash inflows and outflows compared over the same period."],
  ["Story", "More room later can require limiting optional spending now."],
  ["Upside", "A clear surplus can make a next safety step easier to see."],
  ["Downside / risk", "A positive period does not guarantee future cash flow."],
  ["Next combination", "Add Saving Capacity to explore Emergency Fund."],
] as const;

export function DiscoveryMotionGraphic() {
  return (
    <MotionFrame className="home-motion-graphic--discovery">
      <DemoEyebrow>Focused demo · Discovery</DemoEyebrow>
      <DemoTitle>Net Cash Flow</DemoTitle>
      <p className="home-discovery-motion__definition">The difference between cash inflows and outflows over a defined period.</p>
      <dl className="home-discovery-motion__layers">
        {discoveryLayers.map(([term, detail], index) => (
          <div className="home-motion-item home-discovery-motion__layer" style={{ "--motion-delay": `${index * 75}ms` } as CSSProperties} key={term}>
            <dt>{term}</dt><dd>{detail}</dd>
          </div>
        ))}
      </dl>
      <p className="home-motion-graphic__note"><BookOpenCheck size={15} aria-hidden="true" />Education Only · reviewed learning content.</p>
    </MotionFrame>
  );
}

const graphNodes = [
  { label: "Income", x: 22, y: 18, tone: "teal" },
  { label: "Expense", x: 22, y: 42, tone: "orange" },
  { label: "Net Cash Flow", x: 48, y: 30, tone: "orange" },
  { label: "Saving Capacity", x: 70, y: 30, tone: "teal" },
  { label: "Emergency Fund", x: 90, y: 30, tone: "orange" },
] as const;

export function GraphMotionGraphic() {
  return (
    <MotionFrame className="home-motion-graphic--graph">
      <DemoEyebrow>Focused demo · Graph</DemoEyebrow>
      <DemoTitle>Follow the lineage from flow to safety.</DemoTitle>
      <figure className="home-graph-motion">
        <svg viewBox="0 0 100 54" role="img" aria-labelledby="home-graph-title home-graph-description">
          <title id="home-graph-title">Income and Expense lead to Emergency Fund</title>
          <desc id="home-graph-description">Income and Expense connect to Net Cash Flow, then Saving Capacity, then Emergency Fund.</desc>
          <path className="home-graph-motion__path" pathLength="1" d="M 28 19 C 36 20, 38 27, 43 29 M 28 41 C 36 40, 38 33, 43 31 M 55 30 H 63 M 77 30 H 84" />
          {graphNodes.map((node, index) => (
            <g className={`home-graph-motion__node home-graph-motion__node--${node.tone}`} style={{ "--motion-delay": `${index * 90}ms` } as CSSProperties} key={node.label} transform={`translate(${node.x} ${node.y})`}>
              <circle r={index < 2 ? 6.5 : 7} />
              <text y="0.8" textAnchor="middle">{index < 2 ? (index === 0 ? "I" : "E") : index === 2 ? "N" : index === 3 ? "S" : "F"}</text>
              <title>{node.label}</title>
            </g>
          ))}
        </svg>
        <figcaption>Income + Expense → Net Cash Flow → Saving Capacity → Emergency Fund</figcaption>
      </figure>
      <p className="home-motion-graphic__note">A bounded relationship map—not a second Craft Canvas.</p>
    </MotionFrame>
  );
}

export function SimulationMotionGraphic() {
  return (
    <MotionFrame className="home-motion-graphic--simulation">
      <DemoEyebrow>Focused demo · Simulation</DemoEyebrow>
      <DemoTitle>Emergency Fund runway</DemoTitle>
      <div className="home-simulation-motion__inputs">
        <div><span>Emergency Fund</span><strong>$25,000</strong></div>
        <div><span>Monthly Essential Expenses</span><strong>$10,000</strong></div>
        <div className="home-simulation-motion__result"><span>Runway</span><strong>2.50 months</strong></div>
      </div>
      <ol className="home-simulation-motion__timeline" aria-label="Illustrative runway timeline">
        <li><span>Today</span><b>0</b></li><li><span>Whole months</span><b>2</b></li><li><span>Estimated runway</span><b>2.5</b></li>
      </ol>
      <p className="home-motion-graphic__note"><ShieldAlert size={15} aria-hidden="true" />Illustrative fixed inputs · Education and Simulation only.</p>
    </MotionFrame>
  );
}

export function WorkspaceMotionGraphic({ authenticated }: { authenticated: boolean }) {
  return (
    <MotionFrame className="home-motion-graphic--workspace">
      <DemoEyebrow>Focused demo · Workspace continuity</DemoEyebrow>
      <DemoTitle>Return to the thought you were building.</DemoTitle>
      <div className="home-workspace-motion__canvas" aria-label="Canvas state preview">
        <span className="home-workspace-motion__node">Income</span>
        <span className="home-workspace-motion__edge" aria-hidden="true" />
        <span className="home-workspace-motion__node">Net Cash Flow</span>
        <span className="home-workspace-motion__edge" aria-hidden="true" />
        <span className="home-workspace-motion__node">Saving Capacity</span>
      </div>
      <div className="home-workspace-motion__records">
        <div><Layers3 size={16} aria-hidden="true" /><span><strong>Workspace record</strong><small>Nodes, positions and Edges</small></span><span className="home-workspace-motion__status"><Save size={13} aria-hidden="true" />{authenticated ? "Saved" : "Temporary"}</span></div>
        <div><MessageCircle size={16} aria-hidden="true" /><span><strong>Companion context</strong><small>{authenticated ? "Ready when you resume in Lab" : "Sign in to keep this context"}</small></span></div>
      </div>
      <p className="home-motion-graphic__note">{authenticated ? "Authenticated save keeps this learning trail available." : "Guest work is temporary until you sign in."}</p>
    </MotionFrame>
  );
}
