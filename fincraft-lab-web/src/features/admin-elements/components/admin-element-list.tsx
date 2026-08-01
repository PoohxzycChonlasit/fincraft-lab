"use client";

import { BookOpen, BookOpenCheck, Eye, Pencil, RotateCcw } from "lucide-react";
import { AdminArchiveDialog } from "@/features/admin/components/admin-archive-dialog";
import type { AdminElementSummary, ContentStatusEnum } from "../types/admin-element.type";

type ListProps = {
  elements: AdminElementSummary[];
  isSubmitting: boolean;
  onEdit: (element: AdminElementSummary) => void;
  onOpenDetail: (element: AdminElementSummary) => void;
  onArchive: (elementId: string, name: string) => Promise<boolean>;
  onReactivate: (elementId: string, name: string) => Promise<boolean>;
  onQuickStatusChange: (elementId: string, status: ContentStatusEnum) => void;
};

const statusStyles: Record<ContentStatusEnum, string> = {
  ACTIVE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  INACTIVE: "border-stone-500/30 bg-stone-500/10 text-stone-700 dark:text-stone-300",
  ARCHIVED: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

function StatusBadge({ status }: { status: ContentStatusEnum }) {
  return <span className={`inline-flex min-h-6 items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusStyles[status]}`}>{status}</span>;
}

function DetailState({ hasDetail }: { hasDetail: boolean }) {
  const Icon = hasDetail ? BookOpenCheck : BookOpen;
  return <span className={`inline-flex items-center gap-1 text-xs font-semibold ${hasDetail ? "text-[var(--brand-primary)]" : "text-muted-foreground"}`}><Icon className="size-4" aria-hidden="true" />{hasDetail ? "Detail ready" : "Detail missing"}</span>;
}

function ElementRecord({ element, isSubmitting, onEdit, onOpenDetail, onArchive, onReactivate, onQuickStatusChange }: { element: AdminElementSummary; isSubmitting: boolean; onEdit: () => void; onOpenDetail: () => void; onArchive: () => Promise<boolean>; onReactivate: () => Promise<boolean>; onQuickStatusChange: (status: ContentStatusEnum) => void }) {
  const canArchive = element.status === "ACTIVE" || element.status === "PENDING";
  return (
    <article role="listitem" className="grid gap-4 border-b border-[var(--border-subtle)] p-4 last:border-b-0 md:grid-cols-[minmax(0,1.7fr)_minmax(10rem,1fr)_minmax(12rem,1.2fr)_auto] md:items-center">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-3"><span className="text-xl leading-none" aria-hidden="true">{element.emoji}</span><h3 className="truncate text-sm font-bold text-foreground">{element.name}</h3><StatusBadge status={element.status} /></div>
        <p className="truncate text-xs text-muted-foreground"><span className="font-semibold text-[var(--color-craft-accent)]">{element.categoryName}</span><span aria-hidden="true"> · </span>{element.elementType}<span aria-hidden="true"> · </span><span className="font-mono">/{element.slug}</span></p>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground"><span>{element.isStarter ? "Starter" : "Standard"}</span><DetailState hasDetail={element.hasDiscoveryDetail} /></div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor={`element-status-${element.id}`}>Change status for {element.name}</label>
        <select id={`element-status-${element.id}`} value={element.status} onChange={(event) => onQuickStatusChange(event.target.value as ContentStatusEnum)} disabled={isSubmitting} className="min-h-11 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
          <option value="ACTIVE">ACTIVE</option><option value="PENDING">PENDING</option><option value="INACTIVE">INACTIVE</option><option value="ARCHIVED">ARCHIVED</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
        <button id={`inspect-element-${element.id}`} type="button" onClick={onOpenDetail} aria-label={`Inspect detail for ${element.name}`} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[var(--border-interactive)] px-3 text-xs font-semibold text-[var(--brand-primary)] hover:bg-[var(--surface-inset)]"><Eye className="size-4" aria-hidden="true" />Inspect detail</button>
        <button type="button" onClick={onEdit} aria-label={`Edit ${element.name}`} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-3 text-xs font-semibold text-foreground hover:bg-[var(--surface-raised)]"><Pencil className="size-4" aria-hidden="true" />Edit</button>
        {canArchive ? <AdminArchiveDialog trigger={<button type="button" disabled={isSubmitting} aria-label={`Archive ${element.name}`} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-amber-500/30 px-3 text-xs font-semibold text-amber-700 hover:bg-amber-500/10 disabled:opacity-50">Archive</button>} itemName={element.name} description="This Element remains stored, but it becomes unavailable to normal discovery and stays visible in Admin as inactive content." isPending={isSubmitting} onConfirm={onArchive} /> : <button type="button" onClick={() => void onReactivate()} disabled={isSubmitting} aria-label={`Reactivate ${element.name}`} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[var(--border-interactive)] px-3 text-xs font-semibold text-[var(--brand-primary)] hover:bg-[var(--surface-inset)] disabled:opacity-50"><RotateCcw className="size-4" aria-hidden="true" />Reactivate</button>}
      </div>
    </article>
  );
}

export function AdminElementList({ elements, isSubmitting, onEdit, onOpenDetail, onArchive, onReactivate, onQuickStatusChange }: ListProps) {
  if (elements.length === 0) {
    return <div className="surface-inset rounded-2xl p-8 text-center"><p className="text-sm font-semibold text-foreground">No Admin Elements Found</p><p className="mt-1 text-xs text-muted-foreground">Create a master Element to begin building the content catalogue.</p></div>;
  }

  return <div role="list" aria-label="Admin elements" className="surface-card overflow-hidden rounded-2xl"><div className="hidden border-b border-[var(--border-subtle)] bg-[var(--surface-flat)] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground md:grid md:grid-cols-[minmax(0,1.7fr)_minmax(10rem,1fr)_minmax(12rem,1.2fr)_auto] md:gap-4"><span>Element identity</span><span>Content state</span><span>Lifecycle</span><span className="text-right">Actions</span></div>{elements.map((element) => <ElementRecord key={element.id} element={element} isSubmitting={isSubmitting} onEdit={() => onEdit(element)} onOpenDetail={() => onOpenDetail(element)} onArchive={() => onArchive(element.id, element.name)} onReactivate={() => onReactivate(element.id, element.name)} onQuickStatusChange={(status) => onQuickStatusChange(element.id, status)} />)}</div>;
}
