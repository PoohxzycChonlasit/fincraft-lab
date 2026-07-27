"use client";

import { useState } from "react";
import type {
  AdminElementSummary,
  CategoryOption,
  ContentStatusEnum,
  CreateAdminElementPayload,
  ElementTypeEnum,
  UpdateAdminElementPayload,
} from "../types/admin-element.type";
import { SharedFormFields, CreateOnlyFields } from "./admin-element-form-fields";

type FormProps = {
  initialElement?: AdminElementSummary | null;
  categories: CategoryOption[];
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmitCreate: (payload: CreateAdminElementPayload) => void;
  onSubmitUpdate: (elementId: string, payload: UpdateAdminElementPayload) => void;
};

function FormHeader({ title, onCancel }: { title: string; onCancel: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      <button type="button" onClick={onCancel} className="text-xs font-semibold text-muted-foreground hover:text-foreground">
        Cancel
      </button>
    </div>
  );
}

function FormFooter({ isSubmitting, isEditing, disableSubmit, onCancel }: { isSubmitting: boolean; isEditing: boolean; disableSubmit?: boolean; onCancel: () => void }) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button type="button" onClick={onCancel} className="min-h-[44px] rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-resting)] px-4 py-2 text-xs font-semibold text-foreground hover:bg-[var(--surface-inset)]">
        Cancel
      </button>
      <button type="submit" disabled={isSubmitting || disableSubmit} className="min-h-[44px] rounded-xl bg-[var(--color-action-primary)] text-white px-5 py-2 text-xs font-semibold hover:bg-[var(--color-action-hover)] disabled:opacity-60">
        {isSubmitting ? "Saving..." : isEditing ? "Update Element" : "Create Element"}
      </button>
    </div>
  );
}

export function AdminElementForm({ initialElement, categories, isSubmitting, onCancel, onSubmitCreate, onSubmitUpdate }: FormProps) {
  const isEditing = Boolean(initialElement);
  const noCategoryAvailable = !isEditing && categories.length === 0;
  const [name, setName] = useState(initialElement?.name ?? "");
  const [slug, setSlug] = useState(initialElement?.slug ?? "");
  const [emoji, setEmoji] = useState(initialElement?.emoji ?? "📄");
  const [categoryId, setCategoryId] = useState(initialElement?.categoryId ?? (categories[0]?.id || ""));
  const [elementType, setElementType] = useState<ElementTypeEnum>(initialElement?.elementType ?? "BASE");
  const [status, setStatus] = useState<ContentStatusEnum>(initialElement?.status ?? "ACTIVE");
  const [isStarter, setIsStarter] = useState(initialElement?.isStarter ?? false);
  const [iconUrl, setIconUrl] = useState(initialElement?.iconUrl ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && initialElement) {
      onSubmitUpdate(initialElement.id, { name: name.trim(), categoryId, emoji: emoji.trim(), status, iconUrl: iconUrl.trim() || null });
    } else {
      onSubmitCreate({ name: name.trim(), slug: slug.trim().toLowerCase(), categoryId, emoji: emoji.trim(), elementType, isStarter, status, iconUrl: iconUrl.trim() || null });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="surface-inset rounded-2xl border border-[var(--border-subtle)] p-5 space-y-4">
      <FormHeader title={isEditing ? `Edit: ${initialElement?.name}` : "Create New Element"} onCancel={onCancel} />
      {noCategoryAvailable ? (
        <div role="status" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs font-semibold text-amber-700 dark:text-amber-400">
          No category available yet. Create at least one Element Category before creating a new Element.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SharedFormFields name={name} setName={setName} emoji={emoji} setEmoji={setEmoji} categoryId={categoryId} setCategoryId={setCategoryId} status={status} setStatus={setStatus} iconUrl={iconUrl} setIconUrl={setIconUrl} categories={categories} />
          {!isEditing && <CreateOnlyFields slug={slug} setSlug={setSlug} elementType={elementType} setElementType={setElementType} isStarter={isStarter} setIsStarter={setIsStarter} />}
        </div>
      )}
      <FormFooter isSubmitting={isSubmitting} isEditing={isEditing} disableSubmit={noCategoryAvailable} onCancel={onCancel} />
    </form>
  );
}
