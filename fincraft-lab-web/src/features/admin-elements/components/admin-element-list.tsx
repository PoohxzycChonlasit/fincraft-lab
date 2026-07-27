"use client";

import type { AdminElementSummary, ContentStatusEnum } from "../types/admin-element.type";

type ListProps = {
  elements: AdminElementSummary[];
  onEdit: (element: AdminElementSummary) => void;
  onQuickStatusChange: (elementId: string, status: ContentStatusEnum) => void;
};

function StatusBadge({ status }: { status: ContentStatusEnum }) {
  const styles: Record<ContentStatusEnum, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    INACTIVE: "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/30",
    ARCHIVED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${styles[status]}`}>
      {status}
    </span>
  );
}

export function AdminElementList({ elements, onEdit, onQuickStatusChange }: ListProps) {
  if (elements.length === 0) {
    return (
      <div className="surface-inset rounded-2xl p-8 text-center border border-[var(--border-subtle)] space-y-1">
        <p className="text-sm font-semibold text-foreground">No Admin Elements Found</p>
        <p className="text-xs text-muted-foreground">Click &quot;Create Element&quot; to add your first master element.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {elements.map((el) => (
          <article
            key={el.id}
            className="surface-resting rounded-2xl border border-[var(--border-subtle)] p-4 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xl leading-none" aria-hidden="true">
                  {el.emoji}
                </span>
                <StatusBadge status={el.status} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">{el.name}</h4>
                <p className="text-[11px] font-medium text-[var(--color-craft-accent)]">
                  {el.categoryName} • <span className="text-muted-foreground">{el.elementType}</span>
                </p>
                <p className="text-[10px] font-mono text-muted-foreground">/{el.slug}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
              <select
                value={el.status}
                onChange={(e) => onQuickStatusChange(el.id, e.target.value as ContentStatusEnum)}
                aria-label={`Change status for ${el.name}`}
                className="text-[11px] font-semibold rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-2 py-1 focus:ring-2 focus:ring-[var(--ring)]"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="PENDING">PENDING</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>

              <button
                type="button"
                onClick={() => onEdit(el)}
                className="text-xs font-semibold text-[var(--color-action-primary)] hover:underline"
              >
                Edit
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
