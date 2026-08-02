"use client";

import type {
  CategoryOption,
  ContentStatusEnum,
  ElementTypeEnum,
} from "../types/admin-element.type";

const INPUT_CLASS = "min-h-11 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] aria-invalid:border-destructive";
const LABEL_CLASS = "text-xs font-semibold text-foreground";

export type ElementFieldErrors = {
  name?: string;
  emoji?: string;
  categoryId?: string;
  slug?: string;
  iconUrl?: string;
};

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} role="alert" className="text-xs leading-5 text-destructive">{message}</p> : null;
}
type SharedFieldsProps = {
  name: string;
  setName: (value: string) => void;
  emoji: string;
  setEmoji: (value: string) => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  status: ContentStatusEnum;
  setStatus: (value: ContentStatusEnum) => void;
  iconUrl: string;
  setIconUrl: (value: string) => void;
  categories: CategoryOption[];
  errors: ElementFieldErrors;
};

type CreateOnlyFieldsProps = {
  slug: string;
  setSlug: (value: string) => void;
  elementType: ElementTypeEnum;
  setElementType: (value: ElementTypeEnum) => void;
  isStarter: boolean;
  setIsStarter: (value: boolean) => void;
  errors: ElementFieldErrors;
};

export function SharedFormFields({
  name,
  setName,
  emoji,
  setEmoji,
  categoryId,
  setCategoryId,
  status,
  setStatus,
  iconUrl,
  setIconUrl,
  categories,
  errors,
}: SharedFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="element-name" className={LABEL_CLASS}>Name *</label>
        <input id="element-name" type="text" required minLength={2} maxLength={120} value={name} onChange={(event) => setName(event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "element-name-error" : undefined} className={INPUT_CLASS} />
        <FieldError id="element-name-error" message={errors.name} />
      </div>
      <div className="space-y-2">
        <label htmlFor="element-emoji" className={LABEL_CLASS}>Emoji *</label>
        <input id="element-emoji" type="text" required maxLength={8} value={emoji} onChange={(event) => setEmoji(event.target.value)} aria-invalid={Boolean(errors.emoji)} aria-describedby={errors.emoji ? "element-emoji-error" : undefined} className={INPUT_CLASS} />
        <FieldError id="element-emoji-error" message={errors.emoji} />
      </div>
      <div className="space-y-2">
        <label htmlFor="element-category" className={LABEL_CLASS}>Category *</label>
        <select id="element-category" required value={categoryId} onChange={(event) => setCategoryId(event.target.value)} aria-invalid={Boolean(errors.categoryId)} aria-describedby={errors.categoryId ? "element-category-error" : undefined} className={INPUT_CLASS}>
          <option value="">Select a Category...</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <FieldError id="element-category-error" message={errors.categoryId} />
      </div>
      <div className="space-y-2">
        <label htmlFor="element-status" className={LABEL_CLASS}>Status *</label>
        <select id="element-status" value={status} onChange={(event) => setStatus(event.target.value as ContentStatusEnum)} className={INPUT_CLASS}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="PENDING">PENDING</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="element-icon-url" className={LABEL_CLASS}>Icon URL (HTTPS)</label>
        <input id="element-icon-url" type="url" value={iconUrl} onChange={(event) => setIconUrl(event.target.value)} placeholder="https://example.com/icon.png" aria-invalid={Boolean(errors.iconUrl)} aria-describedby={errors.iconUrl ? "element-icon-url-error" : undefined} className={INPUT_CLASS} />
        <FieldError id="element-icon-url-error" message={errors.iconUrl} />
      </div>
    </>
  );
}

export function CreateOnlyFields({
  slug,
  setSlug,
  elementType,
  setElementType,
  isStarter,
  setIsStarter,
  errors,
}: CreateOnlyFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="element-slug" className={LABEL_CLASS}>Slug (kebab-case) *</label>
        <input id="element-slug" type="text" required maxLength={120} pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$" value={slug} onChange={(event) => setSlug(event.target.value)} aria-invalid={Boolean(errors.slug)} aria-describedby={errors.slug ? "element-slug-error" : undefined} className={INPUT_CLASS} />
        <FieldError id="element-slug-error" message={errors.slug} />
      </div>
      <div className="space-y-2">
        <label htmlFor="element-type" className={LABEL_CLASS}>Type *</label>
        <select id="element-type" value={elementType} onChange={(event) => setElementType(event.target.value as ElementTypeEnum)} className={INPUT_CLASS}>
          <option value="BASE">BASE</option>
          <option value="CONCEPT">CONCEPT</option>
          <option value="COMPOSITE">COMPOSITE</option>
        </select>
      </div>
      <div className="col-span-full flex min-h-11 items-center gap-2">
        <input id="element-is-starter" type="checkbox" checked={isStarter} onChange={(event) => setIsStarter(event.target.checked)} className="size-4 rounded border-[var(--border-subtle)] focus:ring-[var(--ring)]" />
        <label htmlFor="element-is-starter" className={LABEL_CLASS}>Starter Element</label>
      </div>
    </>
  );
}
