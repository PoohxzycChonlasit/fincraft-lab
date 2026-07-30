"use client";

import { useEffect, useState, useTransition } from "react";
import { Plus, Edit2, Archive, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import type { AdminRecipe, AdminElementRef } from "../types/recipe.types";
import { RecipeFormModal } from "./recipe-form-modal";

function StatusBadge({ status }: { status: string }) {
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

function RecipeExpressionRow({ recipe }: { recipe: AdminRecipe }) {
  const inpA = recipe.inputs[0]?.element?.name || "Input A";
  const inpB = recipe.inputs[1]?.element?.name || "Input B";

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
      <span className="rounded-md bg-[var(--surface-raised)] px-2 py-0.5 text-foreground">{inpA}</span>
      <span className="text-muted-foreground">+</span>
      <span className="rounded-md bg-[var(--surface-raised)] px-2 py-0.5 text-foreground">{inpB}</span>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <span className="rounded-md bg-[var(--color-action-primary)] px-2 py-0.5 text-white">{recipe.outputElement?.name}</span>
    </div>
  );
}

function RecipeTableRow({
  recipe,
  onEdit,
  onArchive,
  isPending,
}: {
  recipe: AdminRecipe;
  onEdit: (r: AdminRecipe) => void;
  onArchive: (id: string) => void;
  isPending: boolean;
}) {
  return (
    <tr className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-flat)] transition-colors">
      <td className="p-3">
        <RecipeExpressionRow recipe={recipe} />
      </td>
      <td className="p-3 text-xs font-mono text-center">{recipe.ruleType}</td>
      <td className="p-3 text-xs text-center">
        <StatusBadge status={recipe.status} />
      </td>
      <td className="p-3 text-xs text-right space-x-2">
        <button
          type="button"
          onClick={() => onEdit(recipe)}
          className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-[var(--surface-raised)] transition-colors"
        >
          <Edit2 className="h-3 w-3" />
          <span>Edit</span>
        </button>

        {recipe.status === "ACTIVE" ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() => onArchive(recipe.id)}
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

function RecipeTable({
  recipes,
  onEdit,
  onArchive,
  isPending,
}: {
  recipes: AdminRecipe[];
  onEdit: (r: AdminRecipe) => void;
  onArchive: (id: string) => void;
  isPending: boolean;
}) {
  return (
    <div className="surface-card overflow-x-auto rounded-2xl border border-[var(--border-subtle)] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-flat)] text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <th className="p-3">Craft Recipe Expression (Inputs → Output)</th>
            <th className="p-3 text-center">Rule Type</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipes.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-8 text-center text-xs text-muted-foreground">
                No craft recipes found. Click &quot;New Recipe&quot; to create one.
              </td>
            </tr>
          ) : (
            recipes.map((r) => (
              <RecipeTableRow
                key={r.id}
                recipe={r}
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

function useRecipeManagementState(initialRecipes: AdminRecipe[]) {
  const [recipes, setRecipes] = useState<AdminRecipe[]>(initialRecipes);
  const [elements, setElements] = useState<AdminElementRef[]>([]);
  const [activeModalRecipe, setActiveModalRecipe] = useState<AdminRecipe | null | "new">(null);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/elements")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setElements(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaved = (saved: AdminRecipe) => {
    setRecipes((prev) => {
      const idx = prev.findIndex((r) => r.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setActiveModalRecipe(null);
    setSuccessMsg("Craft recipe saved successfully!");
  };

  const handleArchive = (recipeId: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/recipes/${recipeId}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || "Failed to archive recipe.");
          return;
        }
        setRecipes((prev) => prev.map((r) => (r.id === recipeId ? data.data : r)));
        setSuccessMsg("Craft recipe archived successfully.");
      } catch {
        setErrorMsg("Network error archiving recipe.");
      }
    });
  };

  return {
    recipes,
    elements,
    activeModalRecipe,
    setActiveModalRecipe,
    isPending,
    errorMsg,
    successMsg,
    handleSaved,
    handleArchive,
  };
}

function RecipePageHeader({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-accent)]">Master Content</span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Craft Recipes</h1>
      </div>
      <button
        type="button"
        onClick={onNew}
        className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[var(--color-action-hover)] transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>New Recipe</span>
      </button>
    </div>
  );
}

function RecipeAlerts({ errorMsg, successMsg }: { errorMsg: string | null; successMsg: string | null }) {
  return (
    <>
      {errorMsg ? (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : null}
      {successMsg ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      ) : null}
    </>
  );
}

export function RecipeManagementClient({
  initialRecipes,
}: {
  initialRecipes: AdminRecipe[];
}) {
  const {
    recipes,
    elements,
    activeModalRecipe,
    setActiveModalRecipe,
    isPending,
    errorMsg,
    successMsg,
    handleSaved,
    handleArchive,
  } = useRecipeManagementState(initialRecipes);

  return (
    <div className="space-y-4">
      <RecipePageHeader onNew={() => setActiveModalRecipe("new")} />
      <RecipeAlerts errorMsg={errorMsg} successMsg={successMsg} />
      <RecipeTable
        recipes={recipes}
        onEdit={(r) => setActiveModalRecipe(r)}
        onArchive={handleArchive}
        isPending={isPending}
      />
      {activeModalRecipe ? (
        <RecipeFormModal
          recipe={activeModalRecipe === "new" ? null : activeModalRecipe}
          elements={elements}
          onClose={() => setActiveModalRecipe(null)}
          onSaved={handleSaved}
        />
      ) : null}
    </div>
  );
}
