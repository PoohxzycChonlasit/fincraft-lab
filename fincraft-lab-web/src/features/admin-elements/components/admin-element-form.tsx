"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AdminElementSummary, CategoryOption, ContentStatusEnum, CreateAdminElementPayload, ElementTypeEnum, UpdateAdminElementPayload } from "../types/admin-element.type";
import { CreateOnlyFields, SharedFormFields, type ElementFieldErrors } from "./admin-element-form-fields";

type ElementFormValues = { name: string; slug: string; emoji: string; categoryId: string; elementType: ElementTypeEnum; status: ContentStatusEnum; isStarter: boolean; iconUrl: string };
type FormProps = { initialElement?: AdminElementSummary | null; categories: CategoryOption[]; isSubmitting: boolean; externalError?: string | null; onCancel: () => void; onSubmitCreate: (payload: CreateAdminElementPayload) => void; onSubmitUpdate: (elementId: string, payload: UpdateAdminElementPayload) => void };

function getCategoryLoadError(status: number): string {
  if (status === 401) return "Your session has expired. Sign in again to continue.";
  if (status === 403) return "You do not have permission to load Categories.";
  if (status >= 500) return "Category options are temporarily unavailable. Try again.";
  return "Category options could not be loaded.";
}
function useCategoryOptions(categories: CategoryOption[]) {
  const [fetchedCategories, setFetchedCategories] = useState<CategoryOption[]>([]);
  const [isFetching, setIsFetching] = useState(categories.length === 0);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (categories.length > 0) return;
    let mounted = true;
    const load = async () => {
      try {
        const response = await fetch("/api/admin/categories", { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as { data?: CategoryOption[] };
        if (!response.ok || !Array.isArray(payload.data)) throw new Error(getCategoryLoadError(response.status));
        if (mounted) setFetchedCategories(payload.data);
      } catch (loadError) {
        if (mounted) setError(loadError instanceof Error ? loadError.message : "Category options could not be loaded.");
      } finally {
        if (mounted) setIsFetching(false);
      }
    };
    void Promise.resolve().then(load);
    return () => { mounted = false; };
  }, [categories.length]);
  return { availableCategories: categories.length > 0 ? categories : fetchedCategories, isLoading: categories.length === 0 && isFetching, error };
}
function validateElementForm(form: ElementFormValues, isEditing: boolean, resolvedCategoryId: string): ElementFieldErrors {
  const next: ElementFieldErrors = {};
  const name = form.name.trim();
  const slug = form.slug.trim().toLowerCase();
  if (!name) next.name = "Element name is required.";
  else if (name.length < 2) next.name = "Use at least 2 characters.";
  if (!form.emoji.trim()) next.emoji = "Emoji is required.";
  if (!resolvedCategoryId) next.categoryId = "Choose a Category.";
  if (!isEditing) {
    if (!slug) next.slug = "Slug is required.";
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) next.slug = "Use lowercase kebab-case, for example emergency-fund.";
  }
  if (form.iconUrl.trim() && !form.iconUrl.trim().startsWith("https://")) next.iconUrl = "Use an HTTPS URL or leave this field empty.";
  return next;
}
function ElementFormBody({ form, errors, categories, isEditing, isLoadingCategories, categoryError, onChange, onSubmit }: { form: ElementFormValues; errors: ElementFieldErrors; categories: CategoryOption[]; isEditing: boolean; isLoadingCategories: boolean; categoryError: string | null; onChange: <K extends keyof ElementFormValues>(key: K, value: ElementFormValues[K]) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  const categoryUnavailable = categories.length === 0;
  return <div className="min-h-0 flex-1 overflow-y-auto p-5">
    {isLoadingCategories ? <div role="status" aria-busy="true" className="rounded-xl border border-(--border-subtle) bg-(--surface-inset) p-4 text-xs text-muted-foreground">Loading Category options...</div> : null}
    {categoryError ? <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs leading-5 text-destructive">{categoryError}</div> : null}
    {categoryUnavailable && !isLoadingCategories && !categoryError ? <div role="status" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs leading-5 text-amber-800 dark:text-amber-200">No Category is available yet. Create a Category before creating an Element.</div> : null}
    <form id="admin-element-form" onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
      <SharedFormFields name={form.name} setName={(value) => onChange("name", value)} emoji={form.emoji} setEmoji={(value) => onChange("emoji", value)} categoryId={form.categoryId} setCategoryId={(value) => onChange("categoryId", value)} status={form.status} setStatus={(value) => onChange("status", value)} iconUrl={form.iconUrl} setIconUrl={(value) => onChange("iconUrl", value)} categories={categories} errors={errors} />
      {!isEditing ? <CreateOnlyFields slug={form.slug} setSlug={(value) => onChange("slug", value)} elementType={form.elementType} setElementType={(value) => onChange("elementType", value)} isStarter={form.isStarter} setIsStarter={(value) => onChange("isStarter", value)} errors={errors} /> : null}
    </form>
  </div>;
}
function ElementFormDialog({ form, errors, error, categories, isEditing, isSubmitting, isLoadingCategories, categoryError, onCancel, onChange, onSubmit }: { form: ElementFormValues; errors: ElementFieldErrors; error: string | null; categories: CategoryOption[]; isEditing: boolean; isSubmitting: boolean; isLoadingCategories: boolean; categoryError: string | null; onCancel: () => void; onChange: <K extends keyof ElementFormValues>(key: K, value: ElementFormValues[K]) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  const categoryUnavailable = categories.length === 0;
  return <Dialog open onOpenChange={(open) => { if (!open && !isSubmitting) onCancel(); }}>
    <DialogContent className="flex max-h-[calc(100dvh-1rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0">
      <DialogHeader className="shrink-0 border-b border-(--border-subtle) p-5 pr-14"><DialogTitle>{isEditing ? "Edit Element" : "Create Element"}</DialogTitle><DialogDescription>{isEditing ? "Update the editable master fields. Slug, type, and starter status stay fixed after creation." : "Create a shared master Element for the learning catalogue."}</DialogDescription></DialogHeader>
      {error ? <div role="alert" className="mx-5 mt-5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs leading-5 text-destructive">{error}</div> : null}
      <ElementFormBody form={form} errors={errors} categories={categories} isEditing={isEditing} isLoadingCategories={isLoadingCategories} categoryError={categoryError} onChange={onChange} onSubmit={onSubmit} />
      <DialogFooter className="mx-0 mb-0 shrink-0"><button type="button" onClick={onCancel} disabled={isSubmitting} className="min-h-11 rounded-xl border border-(--border-subtle) bg-(--surface-inset) px-4 text-xs font-semibold text-foreground hover:bg-(--surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) disabled:opacity-60">Cancel</button><button type="submit" form="admin-element-form" disabled={isSubmitting || categoryUnavailable || isLoadingCategories} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-(--color-action-primary) px-5 text-xs font-semibold text-white hover:bg-(--color-action-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) disabled:opacity-60">{isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create Element"}</button></DialogFooter>
    </DialogContent>
  </Dialog>;
}
export function AdminElementForm({ initialElement, categories, isSubmitting, externalError, onCancel, onSubmitCreate, onSubmitUpdate }: FormProps) {
  const isEditing = Boolean(initialElement);
  const categoryOptions = useCategoryOptions(categories);
  const [form, setForm] = useState<ElementFormValues>(() => ({ name: initialElement?.name ?? "", slug: initialElement?.slug ?? "", emoji: initialElement?.emoji ?? "📄", categoryId: initialElement?.categoryId ?? categories[0]?.id ?? "", elementType: initialElement?.elementType ?? "BASE", status: initialElement?.status ?? "ACTIVE", isStarter: initialElement?.isStarter ?? false, iconUrl: initialElement?.iconUrl ?? "" }));
  const [fieldErrors, setFieldErrors] = useState<ElementFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const resolvedCategoryId = form.categoryId || categoryOptions.availableCategories[0]?.id || "";
  const onChange = <K extends keyof ElementFormValues>(key: K, value: ElementFormValues[K]) => { setForm((current) => ({ ...current, [key]: value })); setFieldErrors((current) => ({ ...current, [key]: undefined })); setFormError(null); };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    const nextErrors = validateElementForm({ ...form, categoryId: resolvedCategoryId }, isEditing, resolvedCategoryId);
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (isEditing && initialElement) { onSubmitUpdate(initialElement.id, { name: form.name.trim(), categoryId: resolvedCategoryId, emoji: form.emoji.trim(), status: form.status, iconUrl: form.iconUrl.trim() || null }); return; }
    onSubmitCreate({ name: form.name.trim(), slug: form.slug.trim().toLowerCase(), categoryId: resolvedCategoryId, emoji: form.emoji.trim(), elementType: form.elementType, isStarter: form.isStarter, status: form.status, iconUrl: form.iconUrl.trim() || null });
  };
  return <ElementFormDialog form={{ ...form, categoryId: resolvedCategoryId }} errors={fieldErrors} error={formError || externalError || null} categories={categoryOptions.availableCategories} isEditing={isEditing} isSubmitting={isSubmitting} isLoadingCategories={categoryOptions.isLoading} categoryError={categoryOptions.error} onCancel={onCancel} onChange={onChange} onSubmit={handleSubmit} />;
}
