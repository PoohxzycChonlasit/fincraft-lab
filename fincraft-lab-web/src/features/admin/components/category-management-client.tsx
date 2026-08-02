"use client";
import { useCallback, useState } from "react";
import { CheckCircle2, Edit2, Plus, RotateCcw } from "lucide-react";
import type { AdminCategory } from "../types/category.types";
import { AdminArchiveDialog } from "./admin-archive-dialog";
import { CategoryFormModal } from "./category-form-modal";

type CategoryManagementProps = { initialCategories: AdminCategory[]; initialLoadError?: string | null };
type ResponsePayload = { data?: AdminCategory; error?: unknown };

function StatusBadge({ status }: { status: AdminCategory["status"] }) {
  const active = status === "ACTIVE";
  return <span className={"inline-flex min-h-6 items-center rounded-full border px-2 py-0.5 text-[10px] font-bold " + (active ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-stone-500/30 bg-stone-500/10 text-stone-700 dark:text-stone-300")}>{status}</span>;
}
function formatUpdatedAt(value: string): string { const date = new Date(value); if (Number.isNaN(date.getTime())) return "Updated time unavailable"; return "Updated " + date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }); }
function getResponseMessage(status: number, value: unknown, fallback: string): string {
  const message = typeof value === "string" ? value : "";
  const technical = /prisma|jwt|stack|internal server| at [a-z]:|node_modules/i.test(message);
  if (status === 401) return "Your session has expired. Sign in again to continue.";
  if (status === 403) return "You do not have permission to manage Categories.";
  if (status === 404) return "This Category is no longer available. Refresh the list and try again.";
  if (status >= 500 || technical) return fallback;
  return message || fallback;
}
async function parseResponse(response: Response): Promise<ResponsePayload> { return (await response.json().catch(() => ({}))) as ResponsePayload; }

function CategoryRecord({ category, isPending, onEdit, onArchive, onReactivate }: { category: AdminCategory; isPending: boolean; onEdit: () => void; onArchive: () => Promise<boolean>; onReactivate: () => Promise<boolean> }) {
  return <article role="listitem" className="grid gap-3 border-b border-(--border-subtle) p-4 last:border-b-0 md:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_8rem_9rem_auto] md:items-center md:gap-4">
    <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="break-words text-sm font-bold text-foreground">{category.name}</h2><StatusBadge status={category.status} /></div><p className="mt-1 break-words text-xs leading-5 text-muted-foreground md:hidden">{category.description || "No description"}</p></div>
    <p className="break-words text-xs leading-5 text-muted-foreground">{category.description || "No description"}</p>
    <span className="text-xs text-muted-foreground"><span className="font-mono text-foreground">{category.elementCount}</span> linked Elements</span>
    <span className="text-xs text-muted-foreground">{formatUpdatedAt(category.updatedAt)}</span>
    <div className="flex flex-wrap justify-start gap-2 md:justify-end"><button id={"edit-category-" + category.id} type="button" onClick={onEdit} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-(--border-subtle) bg-(--surface-inset) px-3 text-xs font-semibold text-foreground hover:bg-(--surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"><Edit2 className="size-4" aria-hidden="true" />Edit</button>{category.status === "ACTIVE" ? <AdminArchiveDialog trigger={<button type="button" disabled={isPending} className="min-h-11 rounded-lg border border-amber-500/30 px-3 text-xs font-semibold text-amber-700 hover:bg-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:opacity-50">Archive</button>} itemName={category.name} description="This changes the Category status to INACTIVE. Linked Elements stay attached, and the Category can be reactivated later." isPending={isPending} onConfirm={onArchive} /> : <button type="button" onClick={() => void onReactivate()} disabled={isPending} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-(--border-interactive) px-3 text-xs font-semibold text-(--brand-primary) hover:bg-(--surface-inset) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) disabled:opacity-50"><RotateCcw className="size-4" aria-hidden="true" />Reactivate</button>}</div>
  </article>;
}
function CategoryRecords({ categories, isPending, onEdit, onArchive, onReactivate }: { categories: AdminCategory[]; isPending: boolean; onEdit: (category: AdminCategory) => void; onArchive: (category: AdminCategory) => Promise<boolean>; onReactivate: (category: AdminCategory) => Promise<boolean> }) {
  if (categories.length === 0) return <div className="surface-inset rounded-2xl p-8 text-center"><p className="text-sm font-semibold text-foreground">No Categories found</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Create a Category before assigning Elements to a taxonomy.</p></div>;
  return <div role="list" aria-label="Element Categories" className="surface-card overflow-hidden rounded-2xl"><div className="hidden border-b border-(--border-subtle) bg-(--surface-flat) px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground md:grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_8rem_9rem_auto] md:gap-4"><span>Category</span><span>Description</span><span>Elements</span><span>Updated</span><span className="text-right">Actions</span></div>{categories.map((category) => <CategoryRecord key={category.id} category={category} isPending={isPending} onEdit={() => onEdit(category)} onArchive={() => onArchive(category)} onReactivate={() => onReactivate(category)} />)}</div>;
}
function useCategoryData(initialCategories: AdminCategory[], initialLoadError: string | null) {
  const [categories, setCategories] = useState(initialCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(initialLoadError);
  const loadCategories = useCallback(async () => { setIsLoading(true); setLoadError(null); try { const response = await fetch("/api/admin/categories", { cache: "no-store" }); const payload = await parseResponse(response); if (!response.ok || !Array.isArray(payload.data)) throw new Error(getResponseMessage(response.status, payload.error, "We could not load Categories. Try again.")); setCategories(payload.data); } catch (error) { setLoadError(error instanceof Error ? error.message : "We could not load Categories. Try again."); } finally { setIsLoading(false); } }, []);
  return { categories, setCategories, isLoading, loadError, setLoadError, retryLoad: loadCategories };
}
function useCategoryMutations(data: ReturnType<typeof useCategoryData>) {
  const [activeModalCat, setActiveModalCat] = useState<AdminCategory | null | "new">(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const handleSaved = (saved: AdminCategory) => { data.setCategories((current) => { const index = current.findIndex((category) => category.id === saved.id); if (index < 0) return [saved, ...current]; const next = [...current]; next[index] = saved; return next; }); setActiveModalCat(null); data.setLoadError(null); setMutationError(null); setSuccessMsg("Category saved successfully."); };
  const updateStatus = async (category: AdminCategory, status: "ACTIVE" | "INACTIVE") => { setPendingId(category.id); setMutationError(null); setSuccessMsg(null); try { const response = await fetch("/api/admin/categories/" + category.id, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); const payload = await parseResponse(response); if (!response.ok || !payload.data) { setMutationError(getResponseMessage(response.status, payload.error, "The Category status could not be updated.")); return false; } data.setCategories((current) => current.map((item) => item.id === category.id ? payload.data! : item)); setSuccessMsg(category.name + (status === "ACTIVE" ? " reactivated successfully." : " archived successfully.")); return true; } catch { setMutationError("A network error prevented the Category status from updating."); return false; } finally { setPendingId(null); } };
  return { activeModalCat, setActiveModalCat, mutationError, successMsg, isPending: Boolean(pendingId), handleSaved, handleArchive: (category: AdminCategory) => updateStatus(category, "INACTIVE"), handleReactivate: (category: AdminCategory) => updateStatus(category, "ACTIVE") };
}
function useCategoryManagementState(initialCategories: AdminCategory[], initialLoadError: string | null) {
  const data = useCategoryData(initialCategories, initialLoadError);
  const mutations = useCategoryMutations(data);
  return { ...data, ...mutations };
}

export function CategoryManagementClient({ initialCategories, initialLoadError = null }: CategoryManagementProps) {
  const state = useCategoryManagementState(initialCategories, initialLoadError);
  const focusId = state.activeModalCat === "new" ? "new-category-button" : state.activeModalCat ? "edit-category-" + state.activeModalCat.id : null;
  const closeModal = () => { state.setActiveModalCat(null); if (focusId) document.getElementById(focusId)?.focus(); };
  const handleSaved = (category: AdminCategory) => { state.handleSaved(category); queueMicrotask(() => document.getElementById("edit-category-" + category.id)?.focus()); };
  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-(--border-subtle) pb-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-(--color-craft-accent)">Content catalogue</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Categories <span className="font-mono text-sm font-normal text-muted-foreground">{state.categories.length}</span></h1><p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">Organize shared Elements without silently detaching their stored relationships.</p></div><button id="new-category-button" type="button" onClick={() => state.setActiveModalCat("new")} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-(--color-action-primary) px-4 text-xs font-semibold text-white hover:bg-(--color-action-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"><Plus className="size-4" aria-hidden="true" />New Category</button></div>
    {state.mutationError ? <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{state.mutationError}</div> : null}
    {state.successMsg ? <div role="status" className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="size-4" aria-hidden="true" />{state.successMsg}</div> : null}
    {state.isLoading ? <div className="surface-inset rounded-2xl p-8 text-center" aria-busy="true"><p className="text-sm font-semibold text-foreground">Loading Categories...</p></div> : state.loadError ? <div role="alert" className="surface-inset rounded-2xl border border-destructive/30 p-6"><p className="text-sm font-semibold text-destructive">Categories could not be loaded</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{state.loadError}</p><button type="button" onClick={() => void state.retryLoad()} className="mt-4 min-h-11 rounded-xl bg-(--color-action-primary) px-4 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)">Retry</button></div> : <CategoryRecords categories={state.categories} isPending={state.isPending} onEdit={state.setActiveModalCat} onArchive={state.handleArchive} onReactivate={state.handleReactivate} />}
    {state.activeModalCat ? <CategoryFormModal category={state.activeModalCat === "new" ? null : state.activeModalCat} onClose={closeModal} onSaved={handleSaved} /> : null}
  </div>;
}
