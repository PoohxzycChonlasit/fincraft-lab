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
    <article className="border border-[var(--color-orange-600)] bg-[color-mix(in_oklch,var(--surface-resting),var(--color-orange-600)_6%)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-orange-700)]">
        {statusLabel}
      </p>
      <div className="mt-6 border-y border-[var(--color-orange-600)] py-4">
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="mt-3 text-base font-semibold text-[var(--color-orange-700)]">{combination}</p>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{supportingText}</p>
    </article>
  );
}
