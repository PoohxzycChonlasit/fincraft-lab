"use client";

import type {
  CategoryOption,
  ContentStatusEnum,
  ElementTypeEnum,
} from "../types/admin-element.type";

const INPUT_CLASS = "w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-resting)] px-3 py-2 text-xs focus:ring-2 focus:ring-[var(--ring)]";
const LABEL_CLASS = "font-semibold text-foreground text-xs";

type SharedFieldsProps = {
  name: string; setName: (v: string) => void;
  emoji: string; setEmoji: (v: string) => void;
  categoryId: string; setCategoryId: (v: string) => void;
  status: ContentStatusEnum; setStatus: (v: ContentStatusEnum) => void;
  iconUrl: string; setIconUrl: (v: string) => void;
  categories: CategoryOption[];
};

type CreateOnlyFieldsProps = {
  slug: string; setSlug: (v: string) => void;
  elementType: ElementTypeEnum; setElementType: (v: ElementTypeEnum) => void;
  isStarter: boolean; setIsStarter: (v: boolean) => void;
};

export function SharedFormFields({ name, setName, emoji, setEmoji, categoryId, setCategoryId, status, setStatus, iconUrl, setIconUrl, categories }: SharedFieldsProps) {
  return (
    <>
      <div className="space-y-1">
        <label htmlFor="element-name" className={LABEL_CLASS}>Name *</label>
        <input id="element-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLASS} />
      </div>
      <div className="space-y-1">
        <label htmlFor="element-emoji" className={LABEL_CLASS}>Emoji *</label>
        <input id="element-emoji" type="text" required value={emoji} onChange={(e) => setEmoji(e.target.value)} className={INPUT_CLASS} />
      </div>
      <div className="space-y-1">
        <label htmlFor="element-category" className={LABEL_CLASS}>Category *</label>
        <select id="element-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={INPUT_CLASS}>
          {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
      </div>
      <div className="space-y-1">
        <label htmlFor="element-status" className={LABEL_CLASS}>Status *</label>
        <select id="element-status" value={status} onChange={(e) => setStatus(e.target.value as ContentStatusEnum)} className={INPUT_CLASS}>
          <option value="ACTIVE">ACTIVE</option><option value="PENDING">PENDING</option>
          <option value="INACTIVE">INACTIVE</option><option value="ARCHIVED">ARCHIVED</option>
        </select>
      </div>
      <div className="space-y-1">
        <label htmlFor="element-icon-url" className={LABEL_CLASS}>Icon URL (HTTPS)</label>
        <input id="element-icon-url" type="url" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="https://example.com/icon.png" className={INPUT_CLASS} />
      </div>
    </>
  );
}

export function CreateOnlyFields({ slug, setSlug, elementType, setElementType, isStarter, setIsStarter }: CreateOnlyFieldsProps) {
  const INPUT_CLASS_INNER = "w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-resting)] px-3 py-2 text-xs focus:ring-2 focus:ring-[var(--ring)]";
  return (
    <>
      <div className="space-y-1">
        <label htmlFor="element-slug" className={LABEL_CLASS}>Slug (kebab-case) *</label>
        <input id="element-slug" type="text" required pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$" value={slug} onChange={(e) => setSlug(e.target.value)} className={INPUT_CLASS_INNER} />
      </div>
      <div className="space-y-1">
        <label htmlFor="element-type" className={LABEL_CLASS}>Type *</label>
        <select id="element-type" value={elementType} onChange={(e) => setElementType(e.target.value as ElementTypeEnum)} className={INPUT_CLASS_INNER}>
          <option value="BASE">BASE</option><option value="CONCEPT">CONCEPT</option><option value="COMPOSITE">COMPOSITE</option>
        </select>
      </div>
      <div className="flex items-center gap-2 pt-4 col-span-full">
        <input id="element-is-starter" type="checkbox" checked={isStarter} onChange={(e) => setIsStarter(e.target.checked)} className="rounded border-[var(--border-subtle)] focus:ring-[var(--ring)]" />
        <label htmlFor="element-is-starter" className={LABEL_CLASS}>Starter Element</label>
      </div>
    </>
  );
}
