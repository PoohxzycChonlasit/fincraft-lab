function DemoTile({ emoji, title, tag, isResult }: { emoji: string; title: string; tag: string; isResult?: boolean }) {
  return (
    <div
      className={`min-w-[130px] rounded-xl p-3.5 border transition-all surface-resting ${
        isResult
          ? "border-[var(--color-craft-accent)] bg-[var(--color-craft-accent)]/5 shadow-sm"
          : "border-[var(--border-subtle)]"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-xl leading-none" aria-hidden="true">
          {emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-foreground truncate">{title}</p>
          <p className="text-[10px] font-semibold text-[var(--color-craft-accent)] truncate">{tag}</p>
        </div>
      </div>
    </div>
  );
}

export function HomeVisualDemo() {
  return (
    <section aria-label="Visual Crafting Example" className="surface-inset rounded-2xl border border-[var(--border-subtle)] p-6 space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center sm:text-left">
        Interactive Concept Combination
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-2">
        <DemoTile emoji="💵" title="Earned Income" tag="BASE" />
        <span className="text-lg font-bold text-[var(--color-craft-accent)]" aria-hidden="true">+</span>
        <DemoTile emoji="💳" title="General Expense" tag="BASE" />
        <span className="text-lg font-bold text-[var(--color-craft-accent)]" aria-hidden="true">→</span>
        <DemoTile emoji="🔄" title="Net Cash Flow" tag="DISCOVERY" isResult />
      </div>
      <p className="text-xs text-center text-muted-foreground">
        Drag two financial elements together to unlock real financial lessons and trade-offs.
      </p>
    </section>
  );
}
