"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Edit2, Plus, RotateCcw } from "lucide-react";
import type { AdminCategory } from "../types/category.types";
import { AdminArchiveDialog } from "./admin-archive-dialog";
import { CategoryFormModal } from "./category-form-modal";

function StatusBadge({ status }: { status: AdminCategory["status"] }) {
  const active = status === "ACTIVE";
  return <span className={`inline-flex min-h-6 items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${active ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-stone-500/30 bg-stone-500/10 text-stone-700 dark:text-stone-300"}`}>{status}</span>;
}

async function parseResponse(response: Response) {
  return (await response.json().catch(() => ({}))) as { data?: AdminCategory; error?: string };
}

function CategoryRecords({ categories, isPending, onEdit, onArchive, onReactivate }: { categories: AdminCategory[]; isPending: boolean; onEdit: (category: AdminCategory) => void; onArchive: (category: AdminCategory) => Promise<boolean>; onReactivate: (category: AdminCategory) => Promise<boolean> }) {
  if (categories.length === 0) return <div className="surface-inset rounded-2xl p-8 text-center"><p className="text-sm font-semibold text-foreground">No element categories found</p><p className="mt-1 text-xs text-muted-foreground">Create a category to organize the Element catalogue.</p></div>;
  return <div role="list" aria-label="Element categories" className="surface-card overflow-hidden rounded-2xl"><div className="hidden border-b border-[var(--border-subtle)] bg-[var(--surface-flat)] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground md:grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_8rem_8rem_auto] md:gap-4"><span>Category</span><span>Description</span><span>Sort</span><span>Elements</span><span className="text-right">Actions</span></div>{categories.map((category) => <article key={category.id} role="listitem" className="grid gap-3 border-b border-[var(--border-subtle)] p-4 last:border-b-0 md:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_8rem_8rem_auto] md:items-center md:gap-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-bold text-foreground">{category.name}</h2><StatusBadge status={category.status} /></div><p className="mt-1 text-xs text-muted-foreground md:hidden">{category.description || "No description"}</p></div><p className="break-words text-xs leading-5 text-muted-foreground">{category.description || "No description"}</p><span className="text-xs font-mono text-muted-foreground">Sort {category.sortOrder}</span><span className="text-xs text-muted-foreground"><span className="font-mono text-foreground">{category.elementCount}</span> linked Elements</span><div className="flex flex-wrap justify-start gap-2 md:justify-end"><button id={`edit-category-${category.id}`} type="button" onClick={() => onEdit(category)} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-3 text-xs font-semibold text-foreground hover:bg-[var(--surface-raised)]"><Edit2 className="size-4" aria-hidden="true" />Edit</button>{category.status === "ACTIVE" ? <AdminArchiveDialog trigger={<button type="button" disabled={isPending} className="min-h-11 rounded-lg border border-amber-500/30 px-3 text-xs font-semibold text-amber-700 hover:bg-amber-500/10 disabled:opacity-50">Archive</button>} itemName={category.name} description="The category becomes INACTIVE, while its related Elements remain intact and stored." isPending={isPending} onConfirm={() => onArchive(category)} /> : <button type="button" onClick={() => void onReactivate(category)} disabled={isPending} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[var(--border-interactive)] px-3 text-xs font-semibold text-[var(--brand-primary)] hover:bg-[var(--surface-inset)] disabled:opacity-50"><RotateCcw className="size-4" aria-hidden="true" />Reactivate</button>}</div></article>)}</div>;
}

function useCategoryManagementState(initialCategories: AdminCategory[]) {
  const [categories, setCategories] = useState(initialCategories);
  const [activeModalCat, setActiveModalCat] = useState<AdminCategory | null | "new">(null);
  const [isLoading, setIsLoading] = useState(initialCategories.length === 0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true); setLoadError(null);
    try {
      const response = await fetch("/api/admin/categories", { cache: "no-store" });
      const payload = await parseResponse(response);
      if (!response.ok || !Array.isArray(payload.data)) throw new Error(payload.error || `Unable to load categories (HTTP ${response.status}).`);
      setCategories(payload.data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load categories.");
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { if (initialCategories.length === 0) void Promise.resolve().then(() => loadCategories()); }, [initialCategories.length, loadCategories]);

  const handleSaved = (saved: AdminCategory) => {
    setCategories((current) => { const index = current.findIndex((category) => category.id === saved.id); if (index < 0) return [saved, ...current]; const next = [...current]; next[index] = saved; return next; });
    setActiveModalCat(null); setMutationError(null); setSuccessMsg("Category saved successfully.");
  };

  const updateStatus = async (category: AdminCategory, status: "ACTIVE" | "INACTIVE") => {
    setPendingId(category.id); setMutationError(null); setSuccessMsg(null);
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const payload = await parseResponse(response);
      if (!response.ok || !payload.data) { setMutationError(payload.error || `Status update failed (HTTP ${response.status}).`); return false; }
      setCategories((current) => current.map((item) => item.id === category.id ? payload.data! : item));
      setSuccessMsg(`${category.name} ${status === "ACTIVE" ? "reactivated" : "archived"} successfully.`); return true;
    } catch { setMutationError(`Network error updating ${category.name}.`); return false; } finally { setPendingId(null); }
  };

  return { categories, activeModalCat, setActiveModalCat, isLoading, loadError, mutationError, successMsg, isPending: Boolean(pendingId), handleSaved, handleArchive: (category: AdminCategory) => updateStatus(category, "INACTIVE"), handleReactivate: (category: AdminCategory) => updateStatus(category, "ACTIVE"), retryLoad: loadCategories };
}

export function CategoryManagementClient({ initialCategories }: { initialCategories: AdminCategory[] }) {
  const state = useCategoryManagementState(initialCategories);
  const focusId = state.activeModalCat === "new" ? "new-category-button" : state.activeModalCat ? `edit-category-${state.activeModalCat.id}` : null;
  const closeModal = () => { state.setActiveModalCat(null); if (focusId) document.getElementById(focusId)?.focus(); };
  const handleSaved = (category: AdminCategory) => { state.handleSaved(category); queueMicrotask(() => document.getElementById(`edit-category-${category.id}`)?.focus()); };
  return <div className="space-y-5"><div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border-subtle)] pb-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-craft-accent)]">Content catalogue</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Categories</h1><p className="mt-1 text-xs text-muted-foreground">Organize Elements without changing their stored relationships.</p></div><button id="new-category-button" type="button" onClick={() => state.setActiveModalCat("new")} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-4 text-xs font-semibold text-white hover:bg-[var(--color-action-hover)]"><Plus className="size-4" aria-hidden="true" />New category</button></div>{state.mutationError ? <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{state.mutationError}</div> : null}{state.successMsg ? <div role="status" className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="size-4" aria-hidden="true" />{state.successMsg}</div> : null}{state.isLoading ? <div className="surface-inset rounded-2xl p-8 text-center" aria-busy="true"><p className="text-sm font-semibold text-foreground">Loading categories...</p></div> : state.loadError ? <div role="alert" className="surface-inset rounded-2xl border-destructive/30 p-6"><p className="text-sm font-semibold text-destructive">Unable to load categories</p><p className="mt-1 text-xs text-muted-foreground">{state.loadError}</p><button type="button" onClick={() => void state.retryLoad()} className="mt-4 min-h-11 rounded-xl bg-[var(--color-action-primary)] px-4 text-xs font-semibold text-white">Retry</button></div> : <CategoryRecords categories={state.categories} isPending={state.isPending} onEdit={state.setActiveModalCat} onArchive={state.handleArchive} onReactivate={state.handleReactivate} />}{state.activeModalCat ? <CategoryFormModal category={state.activeModalCat === "new" ? null : state.activeModalCat} onClose={closeModal} onSaved={handleSaved} /> : null}</div>;
}
