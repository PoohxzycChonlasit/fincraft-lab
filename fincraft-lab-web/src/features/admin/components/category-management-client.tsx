"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Archive, CheckCircle2, AlertCircle } from "lucide-react";
import type { AdminCategory } from "../types/category.types";
import { CategoryFormModal } from "./category-form-modal";

function StatusBadge({ status }: { status: "ACTIVE" | "INACTIVE" }) {
  const isOk = status === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
        isOk
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "border-muted-foreground/30 bg-muted/20 text-muted-foreground"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isOk ? "bg-emerald-500" : "bg-muted-foreground"}`} />
      {status}
    </span>
  );
}

function CategoryTableRow({
  cat,
  onEdit,
  onArchive,
  isPending,
}: {
  cat: AdminCategory;
  onEdit: (c: AdminCategory) => void;
  onArchive: (id: string) => void;
  isPending: boolean;
}) {
  return (
    <tr className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-flat)] transition-colors">
      <td className="p-3 text-xs font-bold text-foreground">{cat.name}</td>
      <td className="p-3 text-xs text-muted-foreground max-w-xs truncate">{cat.description || "—"}</td>
      <td className="p-3 text-xs font-mono text-center">{cat.sortOrder}</td>
      <td className="p-3 text-xs text-center font-mono">{cat.elementCount}</td>
      <td className="p-3 text-xs text-center">
        <StatusBadge status={cat.status} />
      </td>
      <td className="p-3 text-xs text-right space-x-2">
        <button
          type="button"
          onClick={() => onEdit(cat)}
          className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-[var(--surface-raised)] transition-colors"
        >
          <Edit2 className="h-3 w-3" />
          <span>Edit</span>
        </button>

        {cat.status === "ACTIVE" ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() => onArchive(cat.id)}
            className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
          >
            <Archive className="h-3 w-3" />
            <span>Archive</span>
          </button>
        ) : null}
      </td>
    </tr>
  );
}

function FeedbackBanners({
  errorMsg,
  successMsg,
}: {
  errorMsg: string | null;
  successMsg: string | null;
}) {
  if (errorMsg) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{errorMsg}</span>
      </div>
    );
  }
  if (successMsg) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>{successMsg}</span>
      </div>
    );
  }
  return null;
}

function CategoryTable({
  categories,
  onEdit,
  onArchive,
  isPending,
}: {
  categories: AdminCategory[];
  onEdit: (c: AdminCategory) => void;
  onArchive: (id: string) => void;
  isPending: boolean;
}) {
  return (
    <div className="surface-card overflow-x-auto rounded-2xl border border-[var(--border-subtle)] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-flat)] text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <th className="p-3">Category Name</th>
            <th className="p-3">Description</th>
            <th className="p-3 text-center">Sort</th>
            <th className="p-3 text-center">Elements</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-xs text-muted-foreground">
                No element categories found. Click &quot;New Category&quot; to create one.
              </td>
            </tr>
          ) : (
            categories.map((cat) => (
              <CategoryTableRow
                key={cat.id}
                cat={cat}
                onEdit={onEdit}
                onArchive={onArchive}
                isPending={isPending}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function useCategoryManagementState(initialCategories: AdminCategory[]) {
  const [categories, setCategories] = useState<AdminCategory[]>(initialCategories);
  const [activeModalCat, setActiveModalCat] = useState<AdminCategory | null | "new">(null);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSaved = (saved: AdminCategory) => {
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setActiveModalCat(null);
    setSuccessMsg("Category saved successfully!");
  };

  const handleArchive = (categoryId: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/categories/${categoryId}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || "Failed to archive category.");
          return;
        }
        setCategories((prev) => prev.map((c) => (c.id === categoryId ? data.data : c)));
        setSuccessMsg("Category archived successfully.");
      } catch {
        setErrorMsg("Network error archiving category.");
      }
    });
  };

  return {
    categories,
    activeModalCat,
    setActiveModalCat,
    isPending,
    errorMsg,
    successMsg,
    handleSaved,
    handleArchive,
  };
}

export function CategoryManagementClient({
  initialCategories,
}: {
  initialCategories: AdminCategory[];
}) {
  const {
    categories,
    activeModalCat,
    setActiveModalCat,
    isPending,
    errorMsg,
    successMsg,
    handleSaved,
    handleArchive,
  } = useCategoryManagementState(initialCategories);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-accent)]">Master Data</span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Element Categories</h1>
        </div>

        <button
          type="button"
          onClick={() => setActiveModalCat("new")}
          className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[var(--color-action-hover)] transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Category</span>
        </button>
      </div>

      <FeedbackBanners errorMsg={errorMsg} successMsg={successMsg} />

      <CategoryTable
        categories={categories}
        onEdit={(c) => setActiveModalCat(c)}
        onArchive={handleArchive}
        isPending={isPending}
      />

      {activeModalCat ? (
        <CategoryFormModal
          category={activeModalCat === "new" ? null : activeModalCat}
          onClose={() => setActiveModalCat(null)}
          onSaved={handleSaved}
        />
      ) : null}
    </div>
  );
}
