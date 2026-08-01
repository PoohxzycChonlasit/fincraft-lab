"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminCategory } from "../types/category.types";

type FormState = {
  name: string;
  description: string;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
};

type CategoryFormModalProps = {
  category: AdminCategory | null;
  onClose: () => void;
  onSaved: (category: AdminCategory) => void;
};

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return <label htmlFor={htmlFor} className="text-xs font-semibold text-foreground">{children}</label>;
}

export function CategoryFormModal({ category, onClose, onSaved }: CategoryFormModalProps) {
  const [form, setForm] = useState<FormState>({ name: category?.name ?? "", description: category?.description ?? "", sortOrder: category?.sortOrder ?? 0, status: category?.status ?? "ACTIVE" });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(category);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(null); setIsPending(true);
    try {
      const response = await fetch(category ? `/api/admin/categories/${category.id}` : "/api/admin/categories", { method: category ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.trim(), description: form.description.trim() || undefined, sortOrder: form.sortOrder, status: form.status }) });
      const payload = (await response.json().catch(() => ({}))) as { data?: AdminCategory; error?: string };
      if (!response.ok || !payload.data) throw new Error(payload.error || `Category save failed (HTTP ${response.status}).`);
      onSaved(payload.data);
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Unable to save category."); } finally { setIsPending(false); }
  };

  return <Dialog open onOpenChange={(open) => { if (!open && !isPending) onClose(); }}><DialogContent className="max-h-[calc(100dvh-1rem)] max-w-lg overflow-y-auto"><DialogHeader><DialogTitle>{isEditing ? "Edit category" : "Create category"}</DialogTitle><DialogDescription>{isEditing ? "Update the category record while keeping related Elements intact." : "Create a precise taxonomy record for the Element catalogue."}</DialogDescription></DialogHeader>{error ? <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{error}</div> : null}<form id="category-form" onSubmit={handleSubmit} className="space-y-4"><div className="space-y-2"><FieldLabel htmlFor="category-name">Category name *</FieldLabel><input id="category-name" required minLength={2} maxLength={100} value={form.name} onChange={(event) => update("name", event.target.value)} className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]" /></div><div className="space-y-2"><FieldLabel htmlFor="category-description">Description</FieldLabel><textarea id="category-description" maxLength={500} rows={4} value={form.description} onChange={(event) => update("description", event.target.value)} className="w-full resize-y rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm leading-6 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]" /></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><FieldLabel htmlFor="category-sort">Sort order</FieldLabel><input id="category-sort" type="number" min={0} value={form.sortOrder} onChange={(event) => update("sortOrder", Number(event.target.value) || 0)} className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]" /></div><div className="space-y-2"><FieldLabel htmlFor="category-status">Status</FieldLabel><select id="category-status" value={form.status} onChange={(event) => update("status", event.target.value as FormState["status"])} className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option></select></div></div></form><DialogFooter><button type="button" onClick={onClose} disabled={isPending} className="min-h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-4 text-xs font-semibold text-foreground hover:bg-[var(--surface-raised)] disabled:opacity-60">Cancel</button><button type="submit" form="category-form" disabled={isPending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-5 text-xs font-semibold text-white hover:bg-[var(--color-action-hover)] disabled:opacity-60">{isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}{isPending ? "Saving..." : isEditing ? "Save changes" : "Create category"}</button></DialogFooter></DialogContent></Dialog>;
}
