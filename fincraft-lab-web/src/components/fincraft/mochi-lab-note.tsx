import type { ReactNode } from "react";

export type MochiLabNoteProps = {
  children: ReactNode;
  title?: string;
  tone?: "guidance" | "safety";
};

export function MochiLabNote({ children, title = "Mochi’s Note", tone = "guidance" }: MochiLabNoteProps) {
  const label = tone === "guidance" ? "Guidance" : "Safety";

  return (
    <aside className="border-l-4 border-(--color-teal-600) bg-(--surface-inset) p-5" aria-label={`${title}: ${label}`}>
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="flex size-9 items-center justify-center border border-(--color-teal-600) text-sm font-semibold text-(--color-teal-700)">M</span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--color-teal-700)">{label}</p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">{title}</h3>
        </div>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Educational specimen</p>
      <div className="mt-2 text-sm leading-6 text-foreground">{children}</div>
    </aside>
  );
}
