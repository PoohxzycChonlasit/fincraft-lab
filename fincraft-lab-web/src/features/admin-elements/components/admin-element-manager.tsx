"use client";

import type { AdminElementSummary } from "../types/admin-element.type";
import { useAdminElementManager } from "../hooks/use-admin-element-manager";
import { AdminElementList } from "./admin-element-list";
import { AdminElementForm } from "./admin-element-form";

type ManagerProps = {
  initialElements: AdminElementSummary[];
};

export function AdminElementManager({ initialElements }: ManagerProps) {
  const {
    elements, categories, editingElement, isFormOpen, isSubmitting, feedback, error,
    handleOpenCreate, handleOpenEdit, handleCancelForm, handleCreateSubmit, handleUpdateSubmit, handleQuickStatusChange,
  } = useAdminElementManager(initialElements);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Master Element Specimen Rack ({elements.length})
        </h2>
        {!isFormOpen && (
          <button type="button" onClick={handleOpenCreate} className="min-h-[44px] rounded-xl bg-[var(--color-action-primary)] text-white px-5 py-2.5 text-xs font-semibold hover:bg-[var(--color-action-hover)] focus:ring-2 focus:ring-[var(--ring)] transition-colors">
            + Create Element
          </button>
        )}
      </div>

      {feedback && <div role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">{feedback}</div>}
      {error && <div role="alert" className="rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 p-4 text-xs font-semibold text-[var(--color-text-danger)]">{error}</div>}

      {isFormOpen && (
        <AdminElementForm initialElement={editingElement} categories={categories} isSubmitting={isSubmitting} onCancel={handleCancelForm} onSubmitCreate={handleCreateSubmit} onSubmitUpdate={handleUpdateSubmit} />
      )}

      <AdminElementList elements={elements} onEdit={handleOpenEdit} onQuickStatusChange={handleQuickStatusChange} />
    </div>
  );
}
