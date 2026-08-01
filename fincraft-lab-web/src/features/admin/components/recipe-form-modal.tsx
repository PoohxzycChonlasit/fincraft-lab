"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminRecipe, AdminElementRef } from "../types/recipe.types";

type FormState = {
  inputAId: string;
  inputBId: string;
  outputId: string;
  ruleType: AdminRecipe["ruleType"];
  status: AdminRecipe["status"];
};

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return <label htmlFor={htmlFor} className="text-xs font-semibold text-foreground">{children}</label>;
}

function ElementSelect({ id, label, value, elements, onChange }: { id: string; label: string; value: string; elements: AdminElementRef[]; onChange: (value: string) => void }) {
  return <div className="space-y-2"><FieldLabel htmlFor={id}>{label} *</FieldLabel><select id={id} required value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"><option value="">Select an Element...</option>{elements.map((element) => <option key={element.id} value={element.id}>{element.emoji ? `${element.emoji} ` : ""}{element.name} {element.status !== "ACTIVE" ? `[${element.status}]` : ""}</option>)}</select></div>;
}

function ExpressionPreview({ form, elements }: { form: FormState; elements: AdminElementRef[] }) {
  const byId = new Map(elements.map((element) => [element.id, element]));
  const inputA = byId.get(form.inputAId);
  const inputB = byId.get(form.inputBId);
  const output = byId.get(form.outputId);
  return <div className="surface-inset flex flex-wrap items-center justify-center gap-2 rounded-xl p-4 text-sm font-semibold text-foreground"><span>{inputA?.emoji ? `${inputA.emoji} ` : ""}{inputA?.name || "Input A"}</span><span className="text-[var(--color-craft-accent)]">+</span><span>{inputB?.emoji ? `${inputB.emoji} ` : ""}{inputB?.name || "Input B"}</span><ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" /><span className="text-[var(--brand-primary)]">{output?.emoji ? `${output.emoji} ` : ""}{output?.name || "Output"}</span></div>;
}

export function RecipeFormModal({ recipe, elements, onClose, onSaved }: { recipe: AdminRecipe | null; elements: AdminElementRef[]; onClose: () => void; onSaved: (recipe: AdminRecipe) => void }) {
  const [form, setForm] = useState<FormState>({ inputAId: recipe?.inputs[0]?.elementId ?? "", inputBId: recipe?.inputs[1]?.elementId ?? "", outputId: recipe?.outputElementId ?? "", ruleType: recipe?.ruleType ?? "COMMUTATIVE", status: recipe?.status ?? "ACTIVE" });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(recipe);
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(null);
    if (!form.inputAId || !form.inputBId || !form.outputId) { setError("Select both inputs and an output Element."); return; }
    if (form.inputAId === form.inputBId) { setError("Input A and Input B must be two distinct Elements."); return; }
    setIsPending(true);
    try {
      const response = await fetch(recipe ? `/api/admin/recipes/${recipe.id}` : "/api/admin/recipes", { method: recipe ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ inputElementIds: [form.inputAId, form.inputBId], outputElementId: form.outputId, ruleType: form.ruleType, status: form.status }) });
      const payload = (await response.json().catch(() => ({}))) as { data?: AdminRecipe; error?: string };
      if (!response.ok || !payload.data) throw new Error(payload.error || `Recipe save failed (HTTP ${response.status}).`);
      onSaved(payload.data);
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Unable to save Recipe."); } finally { setIsPending(false); }
  };

  return <Dialog open onOpenChange={(open) => { if (!open && !isPending) onClose(); }}><DialogContent className="max-h-[calc(100dvh-1rem)] max-w-2xl overflow-y-auto"><DialogHeader><DialogTitle>{isEditing ? "Edit Craft Recipe" : "Create Craft Recipe"}</DialogTitle><DialogDescription>Define exactly two distinct inputs and one output. The Backend owns duplicate and commutative conflict rules.</DialogDescription></DialogHeader>{error ? <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{error}</div> : null}{elements.length === 0 ? <div role="status" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">Element options are still unavailable. Load the Element catalogue before saving a Recipe.</div> : null}<form id="recipe-form" onSubmit={handleSubmit} className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><ElementSelect id="recipe-input-a" label="Input A" value={form.inputAId} elements={elements} onChange={(value) => update("inputAId", value)} /><ElementSelect id="recipe-input-b" label="Input B" value={form.inputBId} elements={elements} onChange={(value) => update("inputBId", value)} /></div><ElementSelect id="recipe-output" label="Output" value={form.outputId} elements={elements} onChange={(value) => update("outputId", value)} /><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><FieldLabel htmlFor="recipe-rule-type">Rule type</FieldLabel><select id="recipe-rule-type" value={form.ruleType} onChange={(event) => update("ruleType", event.target.value as FormState["ruleType"])} className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"><option value="COMMUTATIVE">COMMUTATIVE</option><option value="ORDERED">ORDERED</option><option value="SELF_COMBINE">SELF_COMBINE</option><option value="BLOCKED">BLOCKED</option></select></div><div className="space-y-2"><FieldLabel htmlFor="recipe-status">Status</FieldLabel><select id="recipe-status" value={form.status} onChange={(event) => update("status", event.target.value as FormState["status"])} className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option><option value="PENDING">PENDING</option><option value="REJECTED">REJECTED</option></select></div></div><ExpressionPreview form={form} elements={elements} /></form><DialogFooter><button type="button" onClick={onClose} disabled={isPending} className="min-h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-4 text-xs font-semibold text-foreground hover:bg-[var(--surface-raised)] disabled:opacity-60">Cancel</button><button type="submit" form="recipe-form" disabled={isPending || elements.length === 0} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-5 text-xs font-semibold text-white hover:bg-[var(--color-action-hover)] disabled:opacity-60">{isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}{isPending ? "Saving..." : isEditing ? "Save changes" : "Create recipe"}</button></DialogFooter></DialogContent></Dialog>;
}
