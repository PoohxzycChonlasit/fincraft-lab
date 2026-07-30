"use client";

import { useState, useTransition, type FormEvent } from "react";
import { X, RefreshCw, AlertCircle, ArrowRight } from "lucide-react";
import type { AdminRecipe, AdminElementRef } from "../types/recipe.types";

type RecipeFormState = {
  inputAId: string;
  inputBId: string;
  outputId: string;
  status: "ACTIVE" | "INACTIVE";
};

function ElementSelect({
  id,
  label,
  value,
  elements,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  elements: AdminElementRef[];
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-foreground">
        {label} <span className="text-destructive">*</span>
      </label>
      <select
        id={id}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]"
      >
        <option value="">Select an element...</option>
        {elements.map((el) => (
          <option key={el.id} value={el.id}>
            {el.name} ({el.slug}) {el.status !== "ACTIVE" ? `[${el.status}]` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

function RecipeExpressionPreview({
  inputAId,
  inputBId,
  outputId,
  elementsMap,
}: {
  inputAId: string;
  inputBId: string;
  outputId: string;
  elementsMap: Map<string, AdminElementRef>;
}) {
  const nameA = elementsMap.get(inputAId)?.name || "Input A";
  const nameB = elementsMap.get(inputBId)?.name || "Input B";
  const nameOut = elementsMap.get(outputId)?.name || "Output";

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-3 text-xs font-bold text-foreground">
      <span className="rounded-lg bg-[var(--surface-raised)] px-2.5 py-1 text-[var(--brand-accent)]">{nameA}</span>
      <span className="text-muted-foreground">+</span>
      <span className="rounded-lg bg-[var(--surface-raised)] px-2.5 py-1 text-[var(--brand-accent)]">{nameB}</span>
      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="rounded-lg bg-[var(--color-action-primary)] px-2.5 py-1 text-white">{nameOut}</span>
    </div>
  );
}

function RecipeFormFields({
  state,
  elements,
  onChange,
}: {
  state: RecipeFormState;
  elements: AdminElementRef[];
  onChange: <K extends keyof RecipeFormState>(key: K, val: RecipeFormState[K]) => void;
}) {
  const map = new Map(elements.map((e) => [e.id, e]));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ElementSelect
          id="recipe-input-a"
          label="Input Element A"
          value={state.inputAId}
          elements={elements}
          onChange={(val) => onChange("inputAId", val)}
        />
        <ElementSelect
          id="recipe-input-b"
          label="Input Element B"
          value={state.inputBId}
          elements={elements}
          onChange={(val) => onChange("inputBId", val)}
        />
      </div>

      <ElementSelect
        id="recipe-output"
        label="Output Element"
        value={state.outputId}
        elements={elements}
        onChange={(val) => onChange("outputId", val)}
      />

      <div className="space-y-1.5">
        <label htmlFor="recipe-status" className="block text-xs font-semibold text-foreground">
          Status
        </label>
        <select
          id="recipe-status"
          value={state.status}
          onChange={(e) => onChange("status", e.target.value as "ACTIVE" | "INACTIVE")}
          className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      <RecipeExpressionPreview
        inputAId={state.inputAId}
        inputBId={state.inputBId}
        outputId={state.outputId}
        elementsMap={map}
      />
    </div>
  );
}

function submitRecipeForm(
  recipe: AdminRecipe | null,
  formState: RecipeFormState,
  onSaved: (r: AdminRecipe) => void,
  onError: (err: string) => void,
) {
  const isEdit = Boolean(recipe);
  const url = isEdit ? `/api/admin/recipes/${recipe?.id}` : "/api/admin/recipes";
  const method = isEdit ? "PATCH" : "POST";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inputElementIds: [formState.inputAId, formState.inputBId],
      outputElementId: formState.outputId,
      status: formState.status,
    }),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || "Failed to save craft recipe.");
      } else {
        onSaved(data.data);
      }
    })
    .catch(() => onError("Network error saving craft recipe."));
}

function useRecipeFormHandler(
  recipe: AdminRecipe | null,
  onSaved: (r: AdminRecipe) => void,
) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formState, setFormState] = useState<RecipeFormState>({
    inputAId: recipe?.inputs[0]?.elementId || "",
    inputBId: recipe?.inputs[1]?.elementId || "",
    outputId: recipe?.outputElementId || "",
    status: recipe?.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
  });

  const handleChange = <K extends keyof RecipeFormState>(key: K, val: RecipeFormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.inputAId || !formState.inputBId || !formState.outputId) {
      setErrorMsg("Please select both input elements and an output element.");
      return;
    }
    if (formState.inputAId === formState.inputBId) {
      setErrorMsg("Distinct input elements required: Input A and Input B cannot be identical.");
      return;
    }
    setErrorMsg(null);

    startTransition(() => {
      submitRecipeForm(recipe, formState, onSaved, setErrorMsg);
    });
  };

  return { formState, handleChange, handleSubmit, isPending, errorMsg };
}

export function RecipeFormModal({
  recipe,
  elements,
  onClose,
  onSaved,
}: {
  recipe: AdminRecipe | null;
  elements: AdminElementRef[];
  onClose: () => void;
  onSaved: (recipe: AdminRecipe) => void;
}) {
  const { formState, handleChange, handleSubmit, isPending, errorMsg } = useRecipeFormHandler(recipe, onSaved);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg surface-card rounded-2xl border border-[var(--border-subtle)] p-5 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <h3 className="text-sm font-bold text-foreground">
            {recipe ? "Edit Craft Recipe" : "Create New Craft Recipe"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-[var(--surface-raised)] hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMsg ? (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <RecipeFormFields state={formState} elements={elements} onChange={handleChange} />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="inline-flex min-h-[38px] items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-4 text-xs font-semibold text-foreground hover:bg-[var(--surface-raised)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--color-action-hover)] transition-colors disabled:opacity-50"
            >
              {isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
              <span>{recipe ? "Save Changes" : "Create Recipe"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
