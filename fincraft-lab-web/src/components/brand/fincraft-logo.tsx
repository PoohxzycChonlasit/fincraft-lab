import type { CSSProperties } from "react";

type FinCraftMarkProps = {
  className?: string;
  labelled?: boolean;
  style?: CSSProperties;
};

export function FinCraftMark({ className, labelled = false, style }: FinCraftMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={style}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? "FinCraft Lab" : undefined}
      aria-hidden={labelled ? undefined : "true"}
    >
      <rect
        x="3.5"
        y="3.5"
        width="57"
        height="57"
        rx="16.5"
        fill="var(--surface-card, #fffdf8)"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M18 44V20H34M18 31H30"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M47 24.5C44.9 21.6 41.8 20 38.2 20C31.9 20 28 25 28 32C28 39 31.9 44 38.2 44C41.8 44 44.9 42.4 47 39.5"
        stroke="var(--color-craft-accent, #ea580c)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M46.5 16.5L52.5 20M46.5 47.5L52.5 44"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="54" cy="21" r="3" fill="var(--color-craft-accent, #ea580c)" />
      <circle cx="54" cy="43" r="3" fill="currentColor" />
    </svg>
  );
}

type FinCraftLogoProps = {
  showDescriptor?: boolean;
};

export function FinCraftLogo({ showDescriptor = false }: FinCraftLogoProps) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <FinCraftMark className="size-9 shrink-0 text-[var(--color-action-primary)]" />
      <span className="min-w-0">
        <span className="block truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
          FinCraft <span className="text-[var(--color-craft-accent)]">Lab</span>
        </span>
        {showDescriptor ? (
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:block">
            Financial Literacy Discovery Lab
          </span>
        ) : null}
      </span>
    </span>
  );
}
