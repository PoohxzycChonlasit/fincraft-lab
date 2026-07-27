"use client";

import type { CraftDiscoveryDetail, CraftDiscoverySource } from "../types/craft-result.type";

type SectionProps = {
  heading: string;
  id: string;
  text: string;
};

function DetailSection({ heading, id, text }: SectionProps) {
  return (
    <div className="space-y-1">
      <h4
        id={id}
        className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-craft-accent)]"
      >
        {heading}
      </h4>
      <p className="text-xs sm:text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  );
}

function SourcesList({ sources }: { sources: CraftDiscoverySource[] }) {
  if (sources.length === 0) return null;
  return (
    <div className="space-y-1 pt-1 border-t border-[var(--border-subtle)]">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Reference Sources
      </p>
      <ul className="space-y-1">
        {sources.map((src) => (
          <li key={src.url} className="text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">{src.organization}</span>
            {" — "}
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)] rounded"
            >
              {src.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

type OptionalField = { heading: string; idSuffix: string; value: string | null | undefined };

const OPTIONAL_FIELDS: Omit<OptionalField, "value">[] = [
  { heading: "Example", idSuffix: "example" },
  { heading: "Possible Benefit", idSuffix: "benefit" },
  { heading: "Possible Trade-off", idSuffix: "tradeoff" },
  { heading: "Works When", idSuffix: "works-when" },
  { heading: "Becomes Difficult When", idSuffix: "difficult-when" },
  { heading: "Hidden Risk", idSuffix: "hidden-risk" },
  { heading: "What Changes the Outcome", idSuffix: "outcome-change" },
];

const OPTIONAL_KEYS: (keyof Pick<
  CraftDiscoveryDetail,
  "example" | "possibleBenefit" | "possibleTradeoff" | "worksWhen" | "becomesDifficultWhen" | "hiddenRisk" | "whatChangesOutcome"
>)[] = [
  "example", "possibleBenefit", "possibleTradeoff",
  "worksWhen", "becomesDifficultWhen", "hiddenRisk", "whatChangesOutcome",
];

type DiscoveryDetailPanelProps = {
  detail: CraftDiscoveryDetail;
  elementName: string;
};

export function DiscoveryDetailPanel({ detail, elementName }: DiscoveryDetailPanelProps) {
  const baseId = `discovery-detail-${elementName.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <section
      aria-label={`Learning detail for ${elementName}`}
      className="surface-inset rounded-xl border border-[var(--border-subtle)] p-4 sm:p-5 space-y-4"
    >
      <DetailSection
        heading="Real Lesson"
        id={`${baseId}-real-lesson`}
        text={detail.realLesson}
      />

      {OPTIONAL_FIELDS.map((field, i) => {
        const value = detail[OPTIONAL_KEYS[i]];
        if (typeof value !== "string" || value.trim().length === 0) return null;
        return (
          <DetailSection
            key={field.idSuffix}
            heading={field.heading}
            id={`${baseId}-${field.idSuffix}`}
            text={value}
          />
        );
      })}

      <div className="flex flex-wrap gap-2 pt-1">
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-resting)] border border-[var(--border-subtle)] px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
          <span aria-hidden="true">📊</span>
          {detail.realityLevel}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-resting)] border border-[var(--border-subtle)] px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
          <span aria-hidden="true">🏷</span>
          {detail.safetyLabel}
        </span>
      </div>

      <SourcesList sources={detail.sources} />
    </section>
  );
}
