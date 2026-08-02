"use client";
import { useState, type FormEvent, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AdminCategory } from "../types/category.types";

type FormState = { name: string; description: string; sortOrder: number; status: "ACTIVE" | "INACTIVE" };
type FieldErrors = Partial<Record<keyof FormState, string>>;
type CategoryFormModalProps = { category: AdminCategory | null; onClose: () => void; onSaved: (category: AdminCategory) => void };

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) { return <label htmlFor={htmlFor} className="text-xs font-semibold text-foreground">{children}</label>; }
function FieldError({ id, message }: { id: string; message?: string }) { return message ? <p id={id} role="alert" className="text-xs leading-5 text-destructive">{message}</p> : null; }
function getResponseError(status: number, value: unknown): string {
  const message = typeof value === "string" ? value : "";
  const technical = /prisma|jwt|stack|internal server| at [a-z]:|node_modules/i.test(message);
  if (status === 401) return "Your session has expired. Sign in again to continue.";
  if (status === 403) return "You do not have permission to manage Categories.";
  if (status === 404) return "This Category is no longer available. Refresh the list and try again.";
  if (status >= 500 || technical) return "The Category could not be saved because the service is unavailable.";
  if (status === 409) return message || "A Category with this name already exists.";
  if (status === 400) return message || "Check the highlighted fields and try again.";
  return message || "The Category could not be saved. Try again.";
}

function CategoryFormFields({ form, errors, update, onSubmit }: { form: FormState; errors: FieldErrors; update: <K extends keyof FormState>(key: K, value: FormState[K]) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <form id="category-form" className="space-y-4" onSubmit={onSubmit}>
    <div className="space-y-2"><FieldLabel htmlFor="category-name">Category name *</FieldLabel><input id="category-name" required minLength={2} maxLength={100} value={form.name} onChange={(event) => update("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "category-name-error" : undefined} className="min-h-11 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] aria-invalid:border-destructive" /><FieldError id="category-name-error" message={errors.name} /></div>
    <div className="space-y-2"><FieldLabel htmlFor="category-description">Description</FieldLabel><textarea id="category-description" maxLength={500} rows={4} value={form.description} onChange={(event) => update("description", event.target.value)} className="w-full resize-y rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm leading-6 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]" /></div>
    <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><FieldLabel htmlFor="category-sort">Sort order</FieldLabel><input id="category-sort" type="number" min={0} value={form.sortOrder} onChange={(event) => update("sortOrder", Number(event.target.value) || 0)} aria-invalid={Boolean(errors.sortOrder)} aria-describedby={errors.sortOrder ? "category-sort-error" : undefined} className="min-h-11 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] aria-invalid:border-destructive" /><FieldError id="category-sort-error" message={errors.sortOrder} /></div><div className="space-y-2"><FieldLabel htmlFor="category-status">Status</FieldLabel><select id="category-status" value={form.status} onChange={(event) => update("status", event.target.value as FormState["status"])} className="min-h-11 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option></select></div></div>
  </form>;
}

function CategoryFormDialog({ form, errors, error, isPending, isEditing, onClose, onSubmit, update }: { form: FormState; errors: FieldErrors; error: string | null; isPending: boolean; isEditing: boolean; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; update: <K extends keyof FormState>(key: K, value: FormState[K]) => void }) {
  return <Dialog open onOpenChange={(open) => { if (!open && !isPending) onClose(); }}>
    <DialogContent className="flex max-h-[calc(100dvh-1rem)] max-w-lg flex-col gap-0 overflow-hidden p-0">
      <DialogHeader className="shrink-0 border-b border-[var(--border-subtle)] p-5 pr-14"><DialogTitle>{isEditing ? "Edit Category" : "Create Category"}</DialogTitle><DialogDescription>{isEditing ? "Update this taxonomy record while keeping its Element relationships intact." : "Create a precise taxonomy record for the shared Element catalogue."}</DialogDescription></DialogHeader>
      <div className="min-h-0 flex-1 overflow-y-auto p-5">{error ? <div role="alert" className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs leading-5 text-destructive">{error}</div> : null}<CategoryFormFields form={form} errors={errors} update={update} onSubmit={onSubmit} /></div>
      <DialogFooter className="mx-0 mb-0 shrink-0"><button type="button" onClick={onClose} disabled={isPending} className="min-h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-4 text-xs font-semibold text-foreground hover:bg-[var(--surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] disabled:opacity-60">Cancel</button><button type="submit" form="category-form" disabled={isPending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-5 text-xs font-semibold text-white hover:bg-[var(--color-action-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] disabled:opacity-60">{isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}{isPending ? "Saving..." : isEditing ? "Save changes" : "Create Category"}</button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

export function CategoryFormModal({ category, onClose, onSaved }: CategoryFormModalProps) {
  const isEditing = Boolean(category);
  const [form, setForm] = useState<FormState>({ name: category?.name ?? "", description: category?.description ?? "", sortOrder: category?.sortOrder ?? 0, status: category?.status ?? "ACTIVE" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => { setForm((current) => ({ ...current, [key]: value })); setFieldErrors((current) => ({ ...current, [key]: undefined })); setError(null); };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const nextErrors: FieldErrors = {};
    if (!form.name.trim()) nextErrors.name = "Category name is required.";
    else if (form.name.trim().length < 2) nextErrors.name = "Use at least 2 characters.";
    if (form.sortOrder < 0) nextErrors.sortOrder = "Sort order cannot be negative.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setIsPending(true);
    try {
      const response = await fetch(category ? "/api/admin/categories/" + category.id : "/api/admin/categories", { method: category ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.trim(), description: form.description.trim() || undefined, sortOrder: form.sortOrder, status: form.status }) });
      const payload = (await response.json().catch(() => ({}))) as { data?: AdminCategory; error?: unknown };
      if (!response.ok || !payload.data) throw new Error(getResponseError(response.status, payload.error));
      onSaved(payload.data);
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "The Category could not be saved. Try again."); } finally { setIsPending(false); }
  };
  return <CategoryFormDialog form={form} errors={fieldErrors} error={error} isPending={isPending} isEditing={isEditing} onClose={onClose} onSubmit={handleSubmit} update={update} />;
}
