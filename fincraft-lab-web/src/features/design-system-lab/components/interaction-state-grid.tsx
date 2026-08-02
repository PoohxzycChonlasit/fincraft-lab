const interactiveStates = [
  ["Ready", "state-sample", "Available for a deliberate action"],
  ["Hover", "state-sample state-sample-hover", "Boundary becomes clearer"],
  ["Focus-visible", "state-sample state-sample-focus", "Keyboard focus is explicit"],
  ["Pressed", "state-sample state-sample-pressed", "Small tactile compression"],
  ["Selected", "state-sample state-sample-selected", "Selection persists"],
  ["Disabled", "state-sample state-sample-disabled", "Still readable, not available"],
] as const;

const messages = [
  ["Loading", "state-message state-message-loading", "Pending — static status, no spinner loop"],
  ["Warning", "state-message state-message-warning", "Check the trade-off before continuing"],
  ["Error", "state-message state-message-error", "Explain what needs attention"],
  ["Success", "state-message state-message-success", "The static state is complete"],
] as const;

export function InteractionStateGrid() {
  return (
    <section aria-labelledby="state-heading" className="h-full border-l-2 border-(--color-teal-600) pl-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--color-teal-700)">
        Control state test
      </p>
      <h2 id="state-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        One control, six readable conditions
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Boundary, ring, depth, and text communicate each static treatment together.
      </p>
      <div className="surface-resting mt-5 border p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {interactiveStates.map(([label, className, description]) => (
            <div
              key={label}
              className="border-b border-(--border-subtle) pb-3 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
            >
              <button
                type="button"
                className={"w-full " + className}
                data-state={label.toLowerCase()}
                disabled={label === "Disabled"}
              >
                {label}
              </button>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 border-t border-(--border-subtle) pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--color-orange-700)">
          Status rail
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {messages.map(([label, className, description]) => (
            <div key={label} role="status" className={["state-message", "border-l-2", "p-3", className].join(" ")}>
              <p className="text-sm font-semibold"><span aria-hidden="true">— </span>{label}</p>
              <p className="mt-1 text-xs leading-5">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
