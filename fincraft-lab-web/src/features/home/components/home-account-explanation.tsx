export function HomeAccountExplanation() {
  return (
    <section aria-label="Guest and Account Information" className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="surface-inset rounded-2xl border border-[var(--border-subtle)] p-5 space-y-2">
          <span className="text-xs font-semibold text-[var(--color-craft-accent)] uppercase tracking-wider">Guest Mode</span>
          <h3 className="text-sm font-bold text-foreground">Immediate Exploration</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Visitors can enter the Craft Lab immediately without an account. Experiment freely with starter elements; canvas changes and discovered items remain temporary in memory during your session.
          </p>
        </div>
        <div className="surface-inset rounded-2xl border border-[var(--border-subtle)] p-5 space-y-2">
          <span className="text-xs font-semibold text-[var(--color-action-primary)] uppercase tracking-wider">Account Mode</span>
          <h3 className="text-sm font-bold text-foreground">Persistent Workspaces</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Signed-in users can create and save named Workspaces, persist custom canvas node arrangements, retain unlocked discoveries permanently, and reload progress anytime.
          </p>
        </div>
      </div>

      <div role="note" className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-resting)] p-4 text-center">
        <p className="text-xs font-semibold text-muted-foreground">
          Education Only · Simulation Only · Not Financial Advice
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          FinCraft Lab is a school discovery project designed strictly for financial literacy learning.
        </p>
      </div>
    </section>
  );
}
