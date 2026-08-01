import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

type StoryAction = { href: string; label: string };

export function StoryActions({ primary, secondary }: { primary: StoryAction; secondary?: StoryAction }) {
  return (
    <div className="home-story-actions">
      <Link href={primary.href} className="home-story-button home-story-button-primary">
        <span>{primary.label}</span><ArrowRight size={17} aria-hidden="true" />
      </Link>
      {secondary ? <Link href={secondary.href} className="home-story-button home-story-button-secondary">{secondary.label}</Link> : null}
    </div>
  );
}

export function StorySafetyNote() {
  return (
    <p className="home-story-safety-note">
      <ShieldCheck size={15} aria-hidden="true" />
      <span>Education Only · Simulation Only · Not Financial Advice</span>
    </p>
  );
}
