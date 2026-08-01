"use client";

import { useState } from "react";
import type { AdminElementSummary } from "../types/admin-element.type";
import { useAdminElementManager } from "../hooks/use-admin-element-manager";
import { AdminElementDetailEditor } from "./admin-element-detail-editor";
import { AdminElementList } from "./admin-element-list";
import { AdminElementForm } from "./admin-element-form";

type ManagerProps = {
  initialElements: AdminElementSummary[];
};

export function AdminElementManager({ initialElements }: ManagerProps) {
  const [detailElement, setDetailElement] = useState<AdminElementSummary | null>(null);
  const {
    elements,
    categories,
    editingElement,
    isFormOpen,
    isSubmitting,
    feedback,
    error,
    handleOpenCreate,
    handleOpenEdit,
    handleCancelForm,
    handleCreateSubmit,
    handleUpdateSubmit,
    handleArchiveElement,
    handleReactivateElement,
    handleQuickStatusChange,
    handleDetailSaved,
  } = useAdminElementManager(initialElements);

  const closeDetail = () => {
    const focusId = detailElement ? `inspect-element-${detailElement.id}` : null;
    setDetailElement(null);
    if (focusId) document.getElementById(focusId)?.focus();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-craft-accent)]">Content catalogue</p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-foreground">Elements <span className="font-mono text-sm font-normal text-muted-foreground">{elements.length}</span></h2>
        </div>
        {!isFormOpen ? <button type="button" onClick={handleOpenCreate} className="min-h-11 rounded-xl bg-[var(--color-action-primary)] px-5 text-xs font-semibold text-white hover:bg-[var(--color-action-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">Create element</button> : null}
      </div>

      {feedback ? <div role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{feedback}</div> : null}
      {error ? <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-semibold text-destructive">{error}</div> : null}

      {isFormOpen ? <AdminElementForm initialElement={editingElement} categories={categories} isSubmitting={isSubmitting} onCancel={handleCancelForm} onSubmitCreate={handleCreateSubmit} onSubmitUpdate={handleUpdateSubmit} /> : null}

      <AdminElementList elements={elements} isSubmitting={isSubmitting} onEdit={handleOpenEdit} onOpenDetail={setDetailElement} onArchive={handleArchiveElement} onReactivate={handleReactivateElement} onQuickStatusChange={handleQuickStatusChange} />

      {detailElement ? <AdminElementDetailEditor elementId={detailElement.id} elementName={detailElement.name} onClose={closeDetail} onSaved={() => handleDetailSaved(detailElement.id)} /> : null}
    </div>
  );
}
