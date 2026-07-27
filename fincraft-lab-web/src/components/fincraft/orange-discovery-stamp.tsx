export type OrangeDiscoveryStampProps = {
  title: string;
  combination: string;
  supportingText: string;
  statusLabel?: string;
};

export function OrangeDiscoveryStamp({
  title,
  combination,
  supportingText,
  statusLabel = "Discovery specimen",
}: OrangeDiscoveryStampProps) {
  return (
    <article
      className="surface-resting relative overflow-hidden rounded-2xl border-2 border-[var(--border-selected)] p-5 shadow-[var(--shadow-raised)]"
      aria-label={`Discovery result: ${title}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-craft-accent)]">
          {statusLabel}
        </p>
        <span
          aria-hidden="true"
          className="rounded-full bg-[var(--color-craft-accent)]/10 px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-craft-accent)]"
        >
          UNLOCKED
        </span>
      </div>
      <div className="mt-4 border-y border-[var(--border-subtle)] py-3.5">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{title}</h3>
        <p className="mt-1.5 text-xs sm:text-sm font-semibold text-[var(--color-craft-accent)]">{combination}</p>
      </div>
      <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">{supportingText}</p>
    </article>
  );
}
