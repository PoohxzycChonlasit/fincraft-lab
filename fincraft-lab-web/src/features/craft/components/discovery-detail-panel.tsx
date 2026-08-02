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
        className="text-[11px] font-semibold uppercase tracking-wider text-(--color-craft-accent)"
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
    <div className="space-y-2 pt-2 border-t border-(--border-subtle)">
      <div className="flex flex-col space-y-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Reference Sources
        </p>
        <span className="text-[10px] text-muted-foreground italic">
          Educational reference sources. Rules may vary by jurisdiction.
        </span>
      </div>
      <ul className="space-y-2">
        {sources.map((src) => (
          <li key={src.url} className="rounded-lg border border-(--border-subtle) bg-(--surface-resting) p-2.5 text-xs space-y-1">
            <div className="flex items-center justify-between gap-2 text-[10px] font-semibold text-(--color-craft-accent)">
              <span>{src.organization}</span>
              {src.jurisdiction ? (
                <span className="rounded bg-(--surface-inset) px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground border border-(--border-subtle)">
                  {src.jurisdiction.replace(/_/g, " ")}
                </span>
              ) : null}
            </div>
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline hover:text-(--color-action-primary) transition-colors inline-flex items-center gap-1 leading-snug"
            >
              <span>{src.title}</span>
              <span className="text-[10px] shrink-0" aria-hidden="true">↗</span>
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
>)[ ] = [
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
      className="surface-inset rounded-xl border border-(--border-subtle) p-4 sm:p-5 space-y-4"
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
        <span className="inline-flex items-center gap-1 rounded-full bg-(--surface-resting) border border-(--border-subtle) px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
          <span aria-hidden="true">📊</span>
          {detail.realityLevel}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-(--surface-resting) border border-(--border-subtle) px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
          <span aria-hidden="true">🏷</span>
          {detail.safetyLabel}
        </span>
      </div>

      <SourcesList sources={detail.sources} />
    </section>
  );
}
