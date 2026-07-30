"use client";

import { useState, useTransition, type FormEvent } from "react";
import { X, RefreshCw, AlertCircle } from "lucide-react";
import type { AdminCategory } from "../types/category.types";

type FormState = {
  name: string;
  description: string;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
};

function CategoryNameInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="cat-name" className="block text-xs font-semibold text-foreground">
        Category Name <span className="text-destructive">*</span>
      </label>
      <input
        id="cat-name"
        type="text"
        required
        minLength={2}
        maxLength={100}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Budgeting & Saving"
        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]"
      />
    </div>
  );
}

function CategoryDescInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="cat-desc" className="block text-xs font-semibold text-foreground">
        Description (Optional)
      </label>
      <textarea
        id="cat-desc"
        rows={3}
        maxLength={500}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Short educational summary of this category..."
        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)] resize-none"
      />
    </div>
  );
}

function CategoryMetaInputs({
  sortOrder,
  status,
  onChange,
}: {
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
  onChange: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label htmlFor="cat-sort" className="block text-xs font-semibold text-foreground">
          Sort Order
        </label>
        <input
          id="cat-sort"
          type="number"
          min={0}
          value={sortOrder}
          onChange={(e) => onChange("sortOrder", parseInt(e.target.value) || 0)}
          className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="cat-status" className="block text-xs font-semibold text-foreground">
          Status
        </label>
        <select
          id="cat-status"
          value={status}
          onChange={(e) => onChange("status", e.target.value as "ACTIVE" | "INACTIVE")}
          className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>
    </div>
  );
}

function FormInputs({
  state,
  onChange,
}: {
  state: FormState;
  onChange: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
}) {
  return (
    <div className="space-y-4">
      <CategoryNameInput value={state.name} onChange={(v) => onChange("name", v)} />
      <CategoryDescInput value={state.description} onChange={(v) => onChange("description", v)} />
      <CategoryMetaInputs sortOrder={state.sortOrder} status={state.status} onChange={onChange} />
    </div>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg p-1 text-muted-foreground hover:bg-[var(--surface-raised)] hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function submitCategoryForm(
  category: AdminCategory | null,
  formState: FormState,
  onSaved: (cat: AdminCategory) => void,
  onError: (err: string) => void,
) {
  const isEdit = Boolean(category);
  const url = isEdit ? `/api/admin/categories/${category?.id}` : "/api/admin/categories";
  const method = isEdit ? "PATCH" : "POST";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formState.name.trim(),
      description: formState.description.trim() || undefined,
      sortOrder: formState.sortOrder,
      status: formState.status,
    }),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || "Failed to save category.");
      } else {
        onSaved(data.data);
      }
    })
    .catch(() => onError("Network error saving category."));
}

function useCategoryFormHandler(
  category: AdminCategory | null,
  onSaved: (cat: AdminCategory) => void,
) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({
    name: category?.name || "",
    description: category?.description || "",
    sortOrder: category?.sortOrder ?? 0,
    status: category?.status || "ACTIVE",
  });

  const handleChange = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      setErrorMsg("Category name cannot be empty.");
      return;
    }
    setErrorMsg(null);

    startTransition(() => {
      submitCategoryForm(category, formState, onSaved, setErrorMsg);
    });
  };

  return { formState, handleChange, handleSubmit, isPending, errorMsg };
}

export function CategoryFormModal({
  category,
  onClose,
  onSaved,
}: {
  category: AdminCategory | null;
  onClose: () => void;
  onSaved: (category: AdminCategory) => void;
}) {
  const { formState, handleChange, handleSubmit, isPending, errorMsg } = useCategoryFormHandler(category, onSaved);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md surface-card rounded-2xl border border-[var(--border-subtle)] p-5 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <ModalHeader title={category ? "Edit Category" : "Create New Category"} onClose={onClose} />

        {errorMsg ? (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInputs state={formState} onChange={handleChange} />

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
              <span>{category ? "Save Changes" : "Create Category"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
