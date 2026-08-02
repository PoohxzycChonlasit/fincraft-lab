"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Edit2, Plus, RotateCcw } from "lucide-react";
import type { AdminElementRef, AdminRecipe } from "../types/recipe.types";
import { AdminArchiveDialog } from "./admin-archive-dialog";
import { RecipeFormModal } from "./recipe-form-modal";

type RecipeManagementProps = { initialRecipes: AdminRecipe[]; initialLoadError?: string | null };
type ResponsePayload = { data?: AdminRecipe | AdminRecipe[]; error?: unknown };

function StatusBadge({ status }: { status: AdminRecipe["status"] }) {
  const active = status === "ACTIVE";
  return <span className={"inline-flex min-h-6 items-center rounded-full border px-2 py-0.5 text-[10px] font-bold " + (active ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-stone-500/30 bg-stone-500/10 text-stone-700 dark:text-stone-300")}>{status}</span>;
}
function formatUpdatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Updated time unavailable";
  return "Updated " + date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

function getResponseMessage(status: number, value: unknown, fallback: string): string {
  const message = typeof value === "string" ? value : "";
  const technical = /prisma|jwt|stack|internal server| at [a-z]:|node_modules/i.test(message);
  if (status === 401) return "Your session has expired. Sign in again to continue.";
  if (status === 403) return "You do not have permission to manage Recipes.";
  if (status === 404) return "This Recipe is no longer available. Refresh the list and try again.";
  if (status >= 500 || technical) return fallback;
  return message || fallback;
}

async function parseResponse(response: Response): Promise<ResponsePayload> {
  return (await response.json().catch(() => ({}))) as ResponsePayload;
}

function recipeWithElementEmoji(recipe: AdminRecipe, elements: AdminElementRef[]) {
  const byId = new Map(elements.map((element) => [element.id, element]));
  return { ...recipe, outputElement: { ...recipe.outputElement, emoji: byId.get(recipe.outputElementId)?.emoji }, inputs: recipe.inputs.map((input) => ({ ...input, element: { ...input.element, emoji: byId.get(input.elementId)?.emoji } })) };
}

function RecipeExpression({ recipe }: { recipe: AdminRecipe }) {
  const inputA = recipe.inputs[0]?.element;
  const inputB = recipe.inputs[1]?.element;
  const output = recipe.outputElement;
  return <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm font-semibold text-foreground" aria-label="Recipe relationship"><span className="break-words">{(inputA?.emoji ? inputA.emoji + " " : "") + (inputA?.name || "Input A")}</span><span className="text-(--color-craft-accent)" aria-hidden="true">+</span><span className="break-words">{(inputB?.emoji ? inputB.emoji + " " : "") + (inputB?.name || "Input B")}</span><ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" /><span className="break-words text-(--brand-primary)">{(output?.emoji ? output.emoji + " " : "") + (output?.name || "Output")}</span></div>;
}

function RecipeRecord({ recipe, isPending, onEdit, onArchive, onReactivate }: { recipe: AdminRecipe; isPending: boolean; onEdit: () => void; onArchive: () => Promise<boolean>; onReactivate: () => Promise<boolean> }) {
  const canArchive = recipe.status === "ACTIVE";
  return <article role="listitem" className="grid gap-3 border-b border-(--border-subtle) p-4 last:border-b-0 md:grid-cols-[minmax(0,2fr)_12rem_9rem_auto] md:items-center md:gap-4">
    <div className="min-w-0 space-y-2"><RecipeExpression recipe={recipe} /><div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><StatusBadge status={recipe.status} /><span>{recipe.ruleType === "COMMUTATIVE" ? "Reversed input order matches this rule." : "Rule: " + recipe.ruleType}</span></div></div>
    <span className="text-xs font-mono text-muted-foreground">{recipe.ruleType}</span>
    <span className="text-xs text-muted-foreground">{formatUpdatedAt(recipe.updatedAt)}</span>
    <div className="flex flex-wrap justify-start gap-2 md:justify-end">
      <button id={"edit-recipe-" + recipe.id} type="button" onClick={onEdit} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-(--border-subtle) bg-(--surface-inset) px-3 text-xs font-semibold text-foreground hover:bg-(--surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"><Edit2 className="size-4" aria-hidden="true" />Edit</button>
      {canArchive ? <AdminArchiveDialog trigger={<button type="button" disabled={isPending} className="min-h-11 rounded-lg border border-amber-500/30 px-3 text-xs font-semibold text-amber-700 hover:bg-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:opacity-50">Archive</button>} itemName="this Craft Recipe" description="This changes the Recipe status to INACTIVE. Its input and output relationships remain stored, and the Recipe can be reactivated later." isPending={isPending} onConfirm={onArchive} /> : <button type="button" onClick={() => void onReactivate()} disabled={isPending} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-(--border-interactive) px-3 text-xs font-semibold text-(--brand-primary) hover:bg-(--surface-inset) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) disabled:opacity-50"><RotateCcw className="size-4" aria-hidden="true" />Reactivate</button>}
    </div>
  </article>;
}

function RecipeRecords({ recipes, isPending, onEdit, onArchive, onReactivate }: { recipes: AdminRecipe[]; isPending: boolean; onEdit: (recipe: AdminRecipe) => void; onArchive: (recipe: AdminRecipe) => Promise<boolean>; onReactivate: (recipe: AdminRecipe) => Promise<boolean> }) {
  if (recipes.length === 0) return <div className="surface-inset rounded-2xl p-8 text-center"><p className="text-sm font-semibold text-foreground">No Craft Recipes found</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Create a rule that combines exactly two distinct inputs into one output.</p></div>;
  return <div role="list" aria-label="Craft Recipes" className="surface-card overflow-hidden rounded-2xl"><div className="hidden border-b border-(--border-subtle) bg-(--surface-flat) px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground md:grid md:grid-cols-[minmax(0,2fr)_12rem_9rem_auto] md:gap-4"><span>Relationship</span><span>Rule type</span><span>Updated</span><span className="text-right">Actions</span></div>{recipes.map((recipe) => <RecipeRecord key={recipe.id} recipe={recipe} isPending={isPending} onEdit={() => onEdit(recipe)} onArchive={() => onArchive(recipe)} onReactivate={() => onReactivate(recipe)} />)}</div>;
}

function useRecipeManagementState(initialRecipes: AdminRecipe[], initialLoadError: string | null) {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [elements, setElements] = useState<AdminElementRef[]>([]);
  const [activeModalRecipe, setActiveModalRecipe] = useState<AdminRecipe | null | "new">(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(initialLoadError);
  const [elementError, setElementError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const loadRecipes = useCallback(async () => { setIsLoading(true); setLoadError(null); try { const response = await fetch("/api/admin/recipes", { cache: "no-store" }); const payload = await parseResponse(response); if (!response.ok || !Array.isArray(payload.data)) throw new Error(getResponseMessage(response.status, payload.error, "We could not load Craft Recipes. Try again.")); setRecipes(payload.data); } catch (error) { setLoadError(error instanceof Error ? error.message : "We could not load Craft Recipes. Try again."); } finally { setIsLoading(false); } }, []);
  const loadElements = useCallback(async () => { setElementError(null); try { const response = await fetch("/api/admin/elements", { cache: "no-store" }); const payload = (await response.json().catch(() => ({}))) as { data?: AdminElementRef[]; error?: unknown }; if (!response.ok || !Array.isArray(payload.data)) throw new Error(getResponseMessage(response.status, payload.error, "We could not load Element options.")); setElements(payload.data); setRecipes((current) => current.map((recipe) => recipeWithElementEmoji(recipe, payload.data!))); } catch (error) { setElementError(error instanceof Error ? error.message : "We could not load Element options."); } }, []);
  useEffect(() => { void Promise.resolve().then(() => loadElements()); }, [loadElements]);
  const handleSaved = (saved: AdminRecipe) => { setRecipes((current) => { const next = recipeWithElementEmoji(saved, elements); const index = current.findIndex((recipe) => recipe.id === saved.id); if (index < 0) return [next, ...current]; const copy = [...current]; copy[index] = next; return copy; }); setActiveModalRecipe(null); setLoadError(null); setMutationError(null); setSuccessMsg("Craft Recipe saved successfully."); };
  const updateStatus = async (recipe: AdminRecipe, status: "ACTIVE" | "INACTIVE") => { setPendingId(recipe.id); setMutationError(null); setSuccessMsg(null); try { const response = await fetch("/api/admin/recipes/" + recipe.id, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); const payload = await parseResponse(response); if (!response.ok || !payload.data || Array.isArray(payload.data)) { setMutationError(getResponseMessage(response.status, payload.error, "The Recipe status could not be updated.")); return false; } const updated = recipeWithElementEmoji(payload.data, elements); setRecipes((current) => current.map((item) => item.id === recipe.id ? updated : item)); setSuccessMsg((recipe.inputs[0]?.element.name || "Craft Recipe") + (status === "ACTIVE" ? " reactivated successfully." : " archived successfully.")); return true; } catch { setMutationError("A network error prevented the Recipe status from updating."); return false; } finally { setPendingId(null); } };
  return { recipes, elements, activeModalRecipe, setActiveModalRecipe, isLoading, loadError, elementError, mutationError, successMsg, isPending: Boolean(pendingId), handleSaved, handleArchive: (recipe: AdminRecipe) => updateStatus(recipe, "INACTIVE"), handleReactivate: (recipe: AdminRecipe) => updateStatus(recipe, "ACTIVE"), retryLoad: loadRecipes };
}

export function RecipeManagementClient({ initialRecipes, initialLoadError = null }: RecipeManagementProps) {
  const state = useRecipeManagementState(initialRecipes, initialLoadError);
  const focusId = state.activeModalRecipe === "new" ? "new-recipe-button" : state.activeModalRecipe ? "edit-recipe-" + state.activeModalRecipe.id : null;
  const closeModal = () => { state.setActiveModalRecipe(null); if (focusId) document.getElementById(focusId)?.focus(); };
  const handleSaved = (recipe: AdminRecipe) => { state.handleSaved(recipe); queueMicrotask(() => document.getElementById("edit-recipe-" + recipe.id)?.focus()); };
  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-(--border-subtle) pb-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-(--color-craft-accent)">Content catalogue</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Craft Recipes <span className="font-mono text-sm font-normal text-muted-foreground">{state.recipes.length}</span></h1><p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">Manage the rules that connect exactly two Elements to one resulting Element.</p></div><button id="new-recipe-button" type="button" onClick={() => state.setActiveModalRecipe("new")} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-(--color-action-primary) px-4 text-xs font-semibold text-white hover:bg-(--color-action-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"><Plus className="size-4" aria-hidden="true" />New Recipe</button></div>
    {state.elementError ? <div role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">{state.elementError} Recipe selectors may be unavailable until Element options load.</div> : null}
    {state.mutationError ? <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{state.mutationError}</div> : null}
    {state.successMsg ? <div role="status" className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="size-4" aria-hidden="true" />{state.successMsg}</div> : null}
    {state.isLoading ? <div className="surface-inset rounded-2xl p-8 text-center" aria-busy="true"><p className="text-sm font-semibold text-foreground">Loading Craft Recipes...</p></div> : state.loadError ? <div role="alert" className="surface-inset rounded-2xl border border-destructive/30 p-6"><p className="text-sm font-semibold text-destructive">Craft Recipes could not be loaded</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{state.loadError}</p><button type="button" onClick={() => void state.retryLoad()} className="mt-4 min-h-11 rounded-xl bg-(--color-action-primary) px-4 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)">Retry</button></div> : <RecipeRecords recipes={state.recipes} isPending={state.isPending} onEdit={state.setActiveModalRecipe} onArchive={state.handleArchive} onReactivate={state.handleReactivate} />}
    {state.activeModalRecipe ? <RecipeFormModal recipe={state.activeModalRecipe === "new" ? null : state.activeModalRecipe} elements={state.elements} onClose={closeModal} onSaved={handleSaved} /> : null}
  </div>;
}
