"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Edit2, Plus, RotateCcw } from "lucide-react";
import type { AdminRecipe, AdminElementRef } from "../types/recipe.types";
import { AdminArchiveDialog } from "./admin-archive-dialog";
import { RecipeFormModal } from "./recipe-form-modal";

function StatusBadge({ status }: { status: AdminRecipe["status"] }) {
  const active = status === "ACTIVE";
  return <span className={`inline-flex min-h-6 items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${active ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-stone-500/30 bg-stone-500/10 text-stone-700 dark:text-stone-300"}`}>{status}</span>;
}

async function parseResponse(response: Response) {
  return (await response.json().catch(() => ({}))) as { data?: AdminRecipe | AdminRecipe[]; error?: string };
}

function recipeWithElementEmoji(recipe: AdminRecipe, elements: AdminElementRef[]) {
  const byId = new Map(elements.map((element) => [element.id, element]));
  return { ...recipe, outputElement: { ...recipe.outputElement, emoji: byId.get(recipe.outputElementId)?.emoji }, inputs: recipe.inputs.map((input) => ({ ...input, element: { ...input.element, emoji: byId.get(input.elementId)?.emoji } })) };
}

function RecipeExpression({ recipe }: { recipe: AdminRecipe }) {
  const inputA = recipe.inputs[0]?.element;
  const inputB = recipe.inputs[1]?.element;
  const output = recipe.outputElement;
  return <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm font-semibold text-foreground"><span className="shrink-0">{inputA?.emoji ? `${inputA.emoji} ` : ""}{inputA?.name || "Input A"}</span><span className="text-[var(--color-craft-accent)]">+</span><span className="shrink-0">{inputB?.emoji ? `${inputB.emoji} ` : ""}{inputB?.name || "Input B"}</span><ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" /><span className="shrink-0 text-[var(--brand-primary)]">{output?.emoji ? `${output.emoji} ` : ""}{output?.name || "Output"}</span></div>;
}

function RecipeRecords({ recipes, isPending, onEdit, onArchive, onReactivate }: { recipes: AdminRecipe[]; isPending: boolean; onEdit: (recipe: AdminRecipe) => void; onArchive: (recipe: AdminRecipe) => Promise<boolean>; onReactivate: (recipe: AdminRecipe) => Promise<boolean> }) {
  if (recipes.length === 0) return <div className="surface-inset rounded-2xl p-8 text-center"><p className="text-sm font-semibold text-foreground">No craft recipes found</p><p className="mt-1 text-xs text-muted-foreground">Create a rule that combines exactly two distinct inputs into one output.</p></div>;
  return <div role="list" aria-label="Craft recipes" className="surface-card overflow-hidden rounded-2xl"><div className="hidden border-b border-[var(--border-subtle)] bg-[var(--surface-flat)] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground md:grid md:grid-cols-[minmax(0,2fr)_12rem_8rem_auto] md:gap-4"><span>Recipe expression</span><span>Rule type</span><span>Status</span><span className="text-right">Actions</span></div>{recipes.map((recipe) => <article key={recipe.id} role="listitem" className="grid gap-3 border-b border-[var(--border-subtle)] p-4 last:border-b-0 md:grid-cols-[minmax(0,2fr)_12rem_8rem_auto] md:items-center md:gap-4"><div className="min-w-0 space-y-2"><RecipeExpression recipe={recipe} /><p className="text-xs text-muted-foreground">{recipe.ruleType === "COMMUTATIVE" ? "A + B and B + A resolve to the same recipe." : `Rule: ${recipe.ruleType}`}</p></div><span className="text-xs font-mono text-muted-foreground">{recipe.ruleType}</span><StatusBadge status={recipe.status} /><div className="flex flex-wrap justify-start gap-2 md:justify-end"><button type="button" onClick={() => onEdit(recipe)} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-3 text-xs font-semibold text-foreground hover:bg-[var(--surface-raised)]"><Edit2 className="size-4" aria-hidden="true" />Edit</button>{recipe.status === "ACTIVE" ? <AdminArchiveDialog trigger={<button type="button" disabled={isPending} className="min-h-11 rounded-lg border border-amber-500/30 px-3 text-xs font-semibold text-amber-700 hover:bg-amber-500/10 disabled:opacity-50">Archive</button>} itemName="this Recipe" description="The Recipe remains stored but is excluded from Craft runtime until it is reactivated." isPending={isPending} onConfirm={() => onArchive(recipe)} /> : <button type="button" onClick={() => void onReactivate(recipe)} disabled={isPending} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[var(--border-interactive)] px-3 text-xs font-semibold text-[var(--brand-primary)] hover:bg-[var(--surface-inset)] disabled:opacity-50"><RotateCcw className="size-4" aria-hidden="true" />Reactivate</button>}</div></article>)}</div>;
}

function useRecipeManagementState(initialRecipes: AdminRecipe[]) {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [elements, setElements] = useState<AdminElementRef[]>([]);
  const [activeModalRecipe, setActiveModalRecipe] = useState<AdminRecipe | null | "new">(null);
  const [isLoading, setIsLoading] = useState(initialRecipes.length === 0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [elementError, setElementError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const loadRecipes = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true); setLoadError(null);
    try {
      const response = await fetch("/api/admin/recipes", { cache: "no-store" });
      const payload = await parseResponse(response);
      if (!response.ok || !Array.isArray(payload.data)) throw new Error(payload.error || `Unable to load recipes (HTTP ${response.status}).`);
      setRecipes(payload.data);
    } catch (error) { setLoadError(error instanceof Error ? error.message : "Unable to load recipes."); } finally { setIsLoading(false); }
  }, []);

  const loadElements = useCallback(async () => {
    await Promise.resolve();
    setElementError(null);
    try {
      const response = await fetch("/api/admin/elements", { cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as { data?: AdminElementRef[]; error?: string };
      if (!response.ok || !Array.isArray(payload.data)) throw new Error(payload.error || `Unable to load Element options (HTTP ${response.status}).`);
      setElements(payload.data);
      setRecipes((current) => current.map((recipe) => recipeWithElementEmoji(recipe, payload.data!)));
    } catch (error) { setElementError(error instanceof Error ? error.message : "Unable to load Element options."); }
  }, []);

  useEffect(() => { if (initialRecipes.length === 0) void Promise.resolve().then(() => loadRecipes()); void Promise.resolve().then(() => loadElements()); }, [initialRecipes.length, loadElements, loadRecipes]);

  const handleSaved = (saved: AdminRecipe) => { setRecipes((current) => { const next = recipeWithElementEmoji(saved, elements); const index = current.findIndex((recipe) => recipe.id === saved.id); if (index < 0) return [next, ...current]; const copy = [...current]; copy[index] = next; return copy; }); setActiveModalRecipe(null); setMutationError(null); setSuccessMsg("Craft Recipe saved successfully."); };

  const updateStatus = async (recipe: AdminRecipe, status: "ACTIVE" | "INACTIVE") => {
    setPendingId(recipe.id); setMutationError(null); setSuccessMsg(null);
    try {
      const response = await fetch(`/api/admin/recipes/${recipe.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const payload = await parseResponse(response);
      if (!response.ok || !payload.data || Array.isArray(payload.data)) { setMutationError(payload.error || `Status update failed (HTTP ${response.status}).`); return false; }
      const updated = recipeWithElementEmoji(payload.data, elements); setRecipes((current) => current.map((item) => item.id === recipe.id ? updated : item)); setSuccessMsg(`${recipe.inputs[0]?.element.name || "Recipe"} ${status === "ACTIVE" ? "reactivated" : "archived"} successfully.`); return true;
    } catch { setMutationError("Network error updating the Recipe."); return false; } finally { setPendingId(null); }
  };

  return { recipes, elements, activeModalRecipe, setActiveModalRecipe, isLoading, loadError, elementError, mutationError, successMsg, isPending: Boolean(pendingId), handleSaved, handleArchive: (recipe: AdminRecipe) => updateStatus(recipe, "INACTIVE"), handleReactivate: (recipe: AdminRecipe) => updateStatus(recipe, "ACTIVE"), retryLoad: loadRecipes };
}

export function RecipeManagementClient({ initialRecipes }: { initialRecipes: AdminRecipe[] }) {
  const state = useRecipeManagementState(initialRecipes);
  return <div className="space-y-5"><div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border-subtle)] pb-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-craft-accent)]">Content catalogue</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Craft Recipes</h1><p className="mt-1 text-xs text-muted-foreground">Manage the rules that connect exactly two Elements to one output.</p></div><button type="button" onClick={() => state.setActiveModalRecipe("new")} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-4 text-xs font-semibold text-white hover:bg-[var(--color-action-hover)]"><Plus className="size-4" aria-hidden="true" />New recipe</button></div>{state.elementError ? <div role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">{state.elementError} Recipe selectors may be unavailable until Element options load.</div> : null}{state.mutationError ? <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{state.mutationError}</div> : null}{state.successMsg ? <div role="status" className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="size-4" aria-hidden="true" />{state.successMsg}</div> : null}{state.isLoading ? <div className="surface-inset rounded-2xl p-8 text-center" aria-busy="true"><p className="text-sm font-semibold text-foreground">Loading recipes...</p></div> : state.loadError ? <div role="alert" className="surface-inset rounded-2xl border-destructive/30 p-6"><p className="text-sm font-semibold text-destructive">Unable to load recipes</p><p className="mt-1 text-xs text-muted-foreground">{state.loadError}</p><button type="button" onClick={() => void state.retryLoad()} className="mt-4 min-h-11 rounded-xl bg-[var(--color-action-primary)] px-4 text-xs font-semibold text-white">Retry</button></div> : <RecipeRecords recipes={state.recipes} isPending={state.isPending} onEdit={state.setActiveModalRecipe} onArchive={state.handleArchive} onReactivate={state.handleReactivate} />}{state.activeModalRecipe ? <RecipeFormModal recipe={state.activeModalRecipe === "new" ? null : state.activeModalRecipe} elements={state.elements} onClose={() => state.setActiveModalRecipe(null)} onSaved={state.handleSaved} /> : null}</div>;
}
