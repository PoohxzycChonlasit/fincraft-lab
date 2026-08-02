"use client";
import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AdminElementRef, AdminRecipe } from "../types/recipe.types";

type FormState = { inputAId: string; inputBId: string; outputId: string; ruleType: AdminRecipe["ruleType"]; status: AdminRecipe["status"] };
type FieldErrors = Partial<Record<"inputAId" | "inputBId" | "outputId", string>>;
type RecipeFormProps = { recipe: AdminRecipe | null; elements: AdminElementRef[]; onClose: () => void; onSaved: (recipe: AdminRecipe) => void };

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) { return <label htmlFor={htmlFor} className="text-xs font-semibold text-foreground">{children}</label>; }
function FieldError({ id, message }: { id: string; message?: string }) { return message ? <p id={id} role="alert" className="text-xs leading-5 text-destructive">{message}</p> : null; }
function getResponseError(status: number, value: unknown): string {
  const message = typeof value === "string" ? value : "";
  const technical = /prisma|jwt|stack|internal server| at [a-z]:|node_modules/i.test(message);
  if (status === 401) return "Your session has expired. Sign in again to continue.";
  if (status === 403) return "You do not have permission to manage Recipes.";
  if (status === 404) return "One of the selected Elements is no longer available.";
  if (status >= 500 || technical) return "The Recipe could not be saved because the service is unavailable.";
  if (status === 409) return message || "An equivalent Recipe already exists.";
  if (status === 400) return message || "Check the highlighted fields and try again.";
  return message || "The Recipe could not be saved. Try again.";
}
function ElementSelect({ id, label, value, error, elements, onChange }: { id: string; label: string; value: string; error?: string; elements: AdminElementRef[]; onChange: (value: string) => void }) {
  const errorId = id + "-error";
  return <div className="space-y-2"><FieldLabel htmlFor={id}>{label} *</FieldLabel><select id={id} required value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className="min-h-11 w-full rounded-xl border border-(--border-subtle) bg-(--surface-paper) px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) aria-invalid:border-destructive"><option value="">Select an Element...</option>{elements.map((element) => <option key={element.id} value={element.id}>{(element.emoji ? element.emoji + " " : "") + element.name + (element.status !== "ACTIVE" ? " [" + element.status + "]" : "")}</option>)}</select><FieldError id={errorId} message={error} /></div>;
}
function ExpressionPreview({ form, elements }: { form: FormState; elements: AdminElementRef[] }) {
  const byId = new Map(elements.map((element) => [element.id, element]));
  const inputA = byId.get(form.inputAId);
  const inputB = byId.get(form.inputBId);
  const output = byId.get(form.outputId);
  return <div className="surface-inset flex flex-wrap items-center justify-center gap-2 rounded-xl p-4 text-center text-sm font-semibold text-foreground" aria-label="Recipe preview"><span className="break-words">{(inputA?.emoji ? inputA.emoji + " " : "") + (inputA?.name || "Input A")}</span><span className="text-(--color-craft-accent)" aria-hidden="true">+</span><span className="break-words">{(inputB?.emoji ? inputB.emoji + " " : "") + (inputB?.name || "Input B")}</span><ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" /><span className="break-words text-(--brand-primary)">{(output?.emoji ? output.emoji + " " : "") + (output?.name || "Output")}</span></div>;
}
function RecipeFormFields({ form, errors, elements, update, onSubmit }: { form: FormState; errors: FieldErrors; elements: AdminElementRef[]; update: <K extends keyof FormState>(key: K, value: FormState[K]) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <form id="recipe-form" onSubmit={onSubmit} className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><ElementSelect id="recipe-input-a" label="Input A" value={form.inputAId} error={errors.inputAId} elements={elements} onChange={(value) => update("inputAId", value)} /><ElementSelect id="recipe-input-b" label="Input B" value={form.inputBId} error={errors.inputBId} elements={elements} onChange={(value) => update("inputBId", value)} /></div><ElementSelect id="recipe-output" label="Resulting Element" value={form.outputId} error={errors.outputId} elements={elements} onChange={(value) => update("outputId", value)} /><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><FieldLabel htmlFor="recipe-rule-type">Rule type</FieldLabel><select id="recipe-rule-type" value={form.ruleType} onChange={(event) => update("ruleType", event.target.value as FormState["ruleType"])} className="min-h-11 w-full rounded-xl border border-(--border-subtle) bg-(--surface-paper) px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring)"><option value="COMMUTATIVE">COMMUTATIVE</option><option value="ORDERED">ORDERED</option><option value="SELF_COMBINE">SELF_COMBINE</option><option value="BLOCKED">BLOCKED</option></select></div><div className="space-y-2"><FieldLabel htmlFor="recipe-status">Status</FieldLabel><select id="recipe-status" value={form.status} onChange={(event) => update("status", event.target.value as FormState["status"])} className="min-h-11 w-full rounded-xl border border-(--border-subtle) bg-(--surface-paper) px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring)"><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option><option value="PENDING">PENDING</option><option value="REJECTED">REJECTED</option></select></div></div><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Relationship preview</p><ExpressionPreview form={form} elements={elements} /></div></form>;
}
function RecipeFormDialog({ form, errors, error, elements, isEditing, isPending, onClose, onSubmit, update }: { form: FormState; errors: FieldErrors; error: string | null; elements: AdminElementRef[]; isEditing: boolean; isPending: boolean; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; update: <K extends keyof FormState>(key: K, value: FormState[K]) => void }) {
  return <Dialog open onOpenChange={(open) => { if (!open && !isPending) onClose(); }}><DialogContent className="flex max-h-[calc(100dvh-1rem)] max-w-2xl flex-col gap-0 overflow-hidden p-0"><DialogHeader className="shrink-0 border-b border-(--border-subtle) p-5 pr-14"><DialogTitle>{isEditing ? "Edit Craft Recipe" : "Create Craft Recipe"}</DialogTitle><DialogDescription>Define two distinct input Elements and one result. The Backend preserves canonical ordering and owns duplicate conflict rules.</DialogDescription></DialogHeader><div className="min-h-0 flex-1 overflow-y-auto p-5">{error ? <div role="alert" className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs leading-5 text-destructive">{error}</div> : null}{elements.length === 0 ? <div role="status" className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-5 text-amber-800 dark:text-amber-200">Element options are unavailable. Load the Element catalogue before saving a Recipe.</div> : null}<RecipeFormFields form={form} errors={errors} elements={elements} update={update} onSubmit={onSubmit} /></div><DialogFooter className="mx-0 mb-0 shrink-0"><button type="button" onClick={onClose} disabled={isPending} className="min-h-11 rounded-xl border border-(--border-subtle) bg-(--surface-inset) px-4 text-xs font-semibold text-foreground hover:bg-(--surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) disabled:opacity-60">Cancel</button><button type="submit" form="recipe-form" disabled={isPending || elements.length === 0} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-(--color-action-primary) px-5 text-xs font-semibold text-white hover:bg-(--color-action-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) disabled:opacity-60">{isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}{isPending ? "Saving..." : isEditing ? "Save changes" : "Create Recipe"}</button></DialogFooter></DialogContent></Dialog>;
}

export function RecipeFormModal({ recipe, elements, onClose, onSaved }: RecipeFormProps) {
  const isEditing = Boolean(recipe);
  const [form, setForm] = useState<FormState>({ inputAId: recipe?.inputs[0]?.elementId ?? "", inputBId: recipe?.inputs[1]?.elementId ?? "", outputId: recipe?.outputElementId ?? "", ruleType: recipe?.ruleType ?? "COMMUTATIVE", status: recipe?.status ?? "ACTIVE" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => { setForm((current) => ({ ...current, [key]: value })); if (key === "inputAId" || key === "inputBId" || key === "outputId") setFieldErrors((current) => ({ ...current, [key]: undefined })); setError(null); };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const nextErrors: FieldErrors = {};
    if (!form.inputAId) nextErrors.inputAId = "Choose the first input Element.";
    if (!form.inputBId) nextErrors.inputBId = "Choose the second input Element.";
    if (!form.outputId) nextErrors.outputId = "Choose the resulting Element.";
    if (form.inputAId && form.inputAId === form.inputBId) nextErrors.inputBId = "Input A and Input B must be two distinct Elements.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setIsPending(true);
    try {
      const response = await fetch(recipe ? "/api/admin/recipes/" + recipe.id : "/api/admin/recipes", { method: recipe ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ inputElementIds: [form.inputAId, form.inputBId], outputElementId: form.outputId, ruleType: form.ruleType, status: form.status }) });
      const payload = (await response.json().catch(() => ({}))) as { data?: AdminRecipe; error?: unknown };
      if (!response.ok || !payload.data) throw new Error(getResponseError(response.status, payload.error));
      onSaved(payload.data);
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "The Recipe could not be saved. Try again."); } finally { setIsPending(false); }
  };
  return <RecipeFormDialog form={form} errors={fieldErrors} error={error} elements={elements} isEditing={isEditing} isPending={isPending} onClose={onClose} onSubmit={handleSubmit} update={update} />;
}
