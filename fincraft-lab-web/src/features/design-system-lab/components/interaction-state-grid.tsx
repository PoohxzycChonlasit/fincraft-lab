const interactiveStates = [
  ["Default", "state-sample", "Ready for interaction"],
  ["Hover", "state-sample state-sample-hover", "Boundary becomes clearer"],
  ["Focus-visible", "state-sample state-sample-focus", "Keyboard focus is explicit"],
  ["Pressed", "state-sample state-sample-pressed", "Small tactile translation"],
  ["Selected", "state-sample state-sample-selected", "Selection persists"],
  ["Disabled", "state-sample state-sample-disabled", "Still readable, not available"],
] as const;

const messages = [
  ["Loading", "state-message state-message-loading", "Pending — static status, no spinner loop"],
  ["Error", "state-message state-message-error", "Error — explain what needs attention"],
  ["Warning", "state-message state-message-warning", "Warning — check the trade-off"],
  ["Success", "state-message state-message-success", "Success — state is complete"],
] as const;

export function InteractionStateGrid() {
  return (
    <section aria-labelledby="state-heading" className="surface-flat border-t border-[var(--border-subtle)] pt-8">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-orange-700)]">04 / interaction states</p>
        <h2 id="state-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">State matrix</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Borders, labels, markers, surfaces, and focus rings carry meaning together. Colour is never the only signal.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {interactiveStates.map(([label, className, description]) => (
          <div key={label} className="space-y-2">
            <button type="button" className={`w-full ${className}`} data-state={label.toLowerCase()} disabled={label === "Disabled"}>
              {label}
            </button>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {messages.map(([label, className, description]) => (
          <div key={label} role="status" className={`state-message rounded-lg border p-3 ${className}`}>
            <p className="text-sm font-semibold">{label}</p>
            <p className="mt-1 text-xs leading-5">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
