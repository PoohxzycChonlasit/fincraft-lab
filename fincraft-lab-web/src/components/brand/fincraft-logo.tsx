import type { CSSProperties } from "react";

type FinCraftMarkProps = {
  className?: string;
  labelled?: boolean;
  style?: CSSProperties;
};

export function FinCraftMark({ className, labelled = false, style }: FinCraftMarkProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      className={className}
      style={style}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? "FinCraft Lab" : undefined}
      aria-hidden={labelled ? undefined : "true"}
    >
      <defs>
        <linearGradient id="fincraft-mark-teal" x1="96" y1="96" x2="416" y2="416">
          <stop offset="0" stopColor="#2fa6a0" />
          <stop offset="1" stopColor="#0f5b5d" />
        </linearGradient>
      </defs>
      <g>
        <path d="M96 96h224c53 0 96 43 96 96v16H240c-44 0-80 36-80 80v32H96z" fill="url(#fincraft-mark-teal)" />
        <path d="M96 288h144v128H96z" fill="#17324d" />
        <path d="M240 208h176v208H304c-35 0-64-29-64-64z" fill="#f28c28" />
        <path d="M240 208h64v80h-64z" fill="#fff9ef" />
      </g>
    </svg>
  );
}

type FinCraftLogoProps = {
  showDescriptor?: boolean;
};

export function FinCraftLogo({ showDescriptor = false }: FinCraftLogoProps) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <FinCraftMark className="size-10 shrink-0" />
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-bold tracking-tight text-foreground sm:text-base">
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
