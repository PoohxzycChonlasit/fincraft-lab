"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ExternalLink, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AdminDiscoveryDetailPayload, AdminElementDetail, DiscoveryDetailSource, RealityLevelEnum, SafetyLabelEnum } from "../types/admin-element.type";

type DetailEditorProps = { elementId: string; elementName: string; onClose: () => void; onSaved: () => void };
type LongTextKey = Exclude<keyof AdminDiscoveryDetailPayload, "realityLevel" | "safetyLabel" | "sources">;
type DetailForm = AdminDiscoveryDetailPayload;
type LongField = { key: LongTextKey; label: string; required?: boolean; maxLength: number };

const LONG_FIELDS: LongField[] = [
  { key: "shortDescription", label: "Short description", required: true, maxLength: 500 },
  { key: "realLesson", label: "Real lesson", required: true, maxLength: 2000 },
  { key: "example", label: "Example", maxLength: 2000 },
  { key: "possibleBenefit", label: "Possible benefit", maxLength: 2000 },
  { key: "possibleTradeoff", label: "Possible trade-off", maxLength: 2000 },
  { key: "hiddenRisk", label: "Hidden risk", maxLength: 2000 },
  { key: "worksWhen", label: "Works when", maxLength: 2000 },
  { key: "becomesDifficultWhen", label: "Becomes difficult when", maxLength: 2000 },
  { key: "whatChangesOutcome", label: "What changes the outcome", maxLength: 2000 },
];

function emptyDetail(): DetailForm { return { shortDescription: "", realLesson: "", example: null, possibleBenefit: null, possibleTradeoff: null, hiddenRisk: null, worksWhen: null, becomesDifficultWhen: null, whatChangesOutcome: null, realityLevel: "GROUNDED", safetyLabel: "EDUCATION_ONLY", sources: [{ title: "", organization: "", url: "" }] }; }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function responseError(value: unknown, fallback: string) { return isRecord(value) && typeof value.error === "string" ? value.error : fallback; }
function detailToForm(detail: AdminElementDetail["discoveryDetail"]): DetailForm { if (!detail) return emptyDetail(); return { shortDescription: detail.shortDescription, realLesson: detail.realLesson, example: detail.example, possibleBenefit: detail.possibleBenefit, possibleTradeoff: detail.possibleTradeoff, hiddenRisk: detail.hiddenRisk, worksWhen: detail.worksWhen, becomesDifficultWhen: detail.becomesDifficultWhen, whatChangesOutcome: detail.whatChangesOutcome, realityLevel: detail.realityLevel, safetyLabel: detail.safetyLabel, sources: detail.sources.length ? detail.sources : emptyDetail().sources }; }

async function requestDetail(elementId: string): Promise<DetailForm> {
  const response = await fetch(`/api/admin/elements/${elementId}`, { cache: "no-store" });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${responseError(body, "Unable to load detail.")}`);
  const detail = isRecord(body) && isRecord(body.data) ? body.data as AdminElementDetail : null;
  if (!detail) throw new Error("The detail response was incomplete.");
  return detailToForm(detail.discoveryDetail);
}

async function saveDetail(elementId: string, form: DetailForm) {
  const payload: DetailForm = { ...form, shortDescription: form.shortDescription.trim(), realLesson: form.realLesson.trim(), example: form.example?.trim() || null, possibleBenefit: form.possibleBenefit?.trim() || null, possibleTradeoff: form.possibleTradeoff?.trim() || null, hiddenRisk: form.hiddenRisk?.trim() || null, worksWhen: form.worksWhen?.trim() || null, becomesDifficultWhen: form.becomesDifficultWhen?.trim() || null, whatChangesOutcome: form.whatChangesOutcome?.trim() || null, sources: form.sources.map((source) => ({ title: source.title.trim(), organization: source.organization.trim(), url: source.url.trim() })) };
  const response = await fetch(`/api/admin/elements/${elementId}/detail`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${responseError(body, "Unable to save detail.")}`);
}

function useDetailEditor(elementId: string, onClose: () => void, onSaved: () => void) {
  const [form, setForm] = useState<DetailForm>(emptyDetail);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    requestDetail(elementId).then((nextForm) => { if (mounted) { setForm(nextForm); setIsLoading(false); } }).catch((error) => { if (mounted) { setLoadError(error instanceof Error ? error.message : "Unable to load element detail."); setIsLoading(false); } });
    return () => { mounted = false; };
  }, [elementId]);

  const retryLoad = useCallback(async () => { setIsLoading(true); setLoadError(null); try { setForm(await requestDetail(elementId)); } catch (error) { setLoadError(error instanceof Error ? error.message : "Unable to load element detail."); } finally { setIsLoading(false); } }, [elementId]);
  const updateField = (key: LongTextKey, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const updateMetadata = (key: "realityLevel" | "safetyLabel", value: RealityLevelEnum | SafetyLabelEnum) => setForm((current) => ({ ...current, [key]: value }));
  const updateSource = (index: number, key: keyof DiscoveryDetailSource, value: string) => setForm((current) => ({ ...current, sources: current.sources.map((source, sourceIndex) => sourceIndex === index ? { ...source, [key]: value } : source) }));
  const addSource = () => setForm((current) => ({ ...current, sources: [...current.sources, { title: "", organization: "", url: "" }] }));
  const removeSource = (index: number) => setForm((current) => ({ ...current, sources: current.sources.filter((_, sourceIndex) => sourceIndex !== index) }));
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSaveError(null); if (!form.sources.length || form.sources.some((source) => !source.title.trim() || !source.organization.trim() || !source.url.trim())) { setSaveError("Add at least one complete source before saving."); return; } setIsSaving(true); try { await saveDetail(elementId, form); onSaved(); onClose(); } catch (error) { setSaveError(error instanceof Error ? error.message : "Unable to save element detail."); } finally { setIsSaving(false); } };
  return { form, isLoading, isSaving, loadError, saveError, retryLoad, updateField, updateMetadata, updateSource, addSource, removeSource, handleSubmit };
}

function TextField({ field, value, onChange }: { field: LongField; value: string | null; onChange: (value: string) => void }) { return <div className="space-y-2"><label htmlFor={`detail-${field.key}`} className="text-xs font-semibold text-foreground">{field.label}{field.required ? " *" : ""}</label><textarea id={`detail-${field.key}`} required={field.required} maxLength={field.maxLength} value={value ?? ""} onChange={(event) => onChange(event.target.value)} rows={field.required ? 4 : 3} className="w-full resize-y rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm leading-6 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]" /></div>; }

function SourceFields({ source, index, onChange, onRemove, canRemove }: { source: DiscoveryDetailSource; index: number; onChange: (key: keyof DiscoveryDetailSource, value: string) => void; onRemove: () => void; canRemove: boolean }) { return <div className="surface-paper space-y-3 rounded-xl p-4"><div className="flex items-center justify-between gap-3"><h3 className="text-xs font-bold text-foreground">Source {index + 1}</h3><button type="button" onClick={onRemove} disabled={!canRemove} className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-40" aria-label={`Remove source ${index + 1}`}><Trash2 className="size-4" aria-hidden="true" />Remove</button></div><div className="grid gap-3 sm:grid-cols-2">{(["title", "organization"] as const).map((key) => <div key={key} className="space-y-2"><label htmlFor={`source-${index}-${key}`} className="text-xs font-semibold text-foreground">{key === "organization" ? "Publisher / organization" : "Title"} *</label><input id={`source-${index}-${key}`} required maxLength={200} value={source[key]} onChange={(event) => onChange(key, event.target.value)} className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]" /></div>)}</div><div className="space-y-2"><label htmlFor={`source-${index}-url`} className="text-xs font-semibold text-foreground">HTTPS URL *</label><input id={`source-${index}-url`} required type="url" value={source.url} onChange={(event) => onChange("url", event.target.value)} placeholder="https://" className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]" />{source.url.startsWith("https://") ? <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1 break-all text-xs text-[var(--brand-primary)] underline underline-offset-2"><ExternalLink className="size-3 shrink-0" aria-hidden="true" />{source.url}</a> : null}</div></div>; }

function MetadataFields({ form, onChange }: { form: DetailForm; onChange: (key: "realityLevel" | "safetyLabel", value: RealityLevelEnum | SafetyLabelEnum) => void }) { return <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2 text-xs font-semibold text-foreground">Reality level<select value={form.realityLevel} onChange={(event) => onChange("realityLevel", event.target.value as RealityLevelEnum)} className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm font-normal text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"><option value="GROUNDED">GROUNDED</option><option value="SIMPLIFIED_MODEL">SIMPLIFIED_MODEL</option><option value="SCENARIO">SCENARIO</option><option value="HYPOTHESIS">HYPOTHESIS</option></select></label><label className="space-y-2 text-xs font-semibold text-foreground">Safety label<select value={form.safetyLabel} onChange={(event) => onChange("safetyLabel", event.target.value as SafetyLabelEnum)} className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 py-2.5 text-sm font-normal text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"><option value="EDUCATION_ONLY">EDUCATION_ONLY</option><option value="SIMULATION_ONLY">SIMULATION_ONLY</option><option value="NOT_FINANCIAL_ADVICE">NOT_FINANCIAL_ADVICE</option><option value="HIGH_RISK_TOPIC">HIGH_RISK_TOPIC</option><option value="NEEDS_REVIEW">NEEDS_REVIEW</option></select></label></div>; }

function DetailForm({ editor }: { editor: ReturnType<typeof useDetailEditor> }) { return <form id="admin-element-detail-form" onSubmit={editor.handleSubmit} className="space-y-6 p-5">{editor.saveError ? <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{editor.saveError}</p> : null}<section aria-labelledby="learning-fields-heading" className="space-y-4"><div><h2 id="learning-fields-heading" className="text-sm font-bold text-foreground">Educational content</h2><p className="text-xs text-muted-foreground">Use plain, source-backed explanations. Empty optional fields are stored as null.</p></div>{LONG_FIELDS.map((field) => <TextField key={field.key} field={field} value={editor.form[field.key]} onChange={(value) => editor.updateField(field.key, value)} />)}</section><section aria-labelledby="safety-fields-heading" className="space-y-4 border-t border-[var(--border-subtle)] pt-5"><div><h2 id="safety-fields-heading" className="text-sm font-bold text-foreground">Reality and safety</h2><p className="text-xs text-muted-foreground">Safety metadata remains separate from Sources.</p></div><MetadataFields form={editor.form} onChange={editor.updateMetadata} /></section><section aria-labelledby="sources-heading" className="space-y-4 border-t border-[var(--border-subtle)] pt-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 id="sources-heading" className="text-sm font-bold text-foreground">Authoritative Sources</h2><p className="text-xs text-muted-foreground">At least one HTTPS Source is required. Source order is preserved.</p></div><button type="button" onClick={editor.addSource} disabled={editor.form.sources.length >= 10} className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-[var(--border-interactive)] px-3 text-xs font-semibold text-[var(--brand-primary)] hover:bg-[var(--surface-inset)] disabled:opacity-50"><Plus className="size-4" aria-hidden="true" />Add source</button></div><div className="space-y-3">{editor.form.sources.map((source, index) => <SourceFields key={index} source={source} index={index} onChange={(key, value) => editor.updateSource(index, key, value)} onRemove={() => editor.removeSource(index)} canRemove={editor.form.sources.length > 1} />)}</div></section></form>; }

function EditorBody({ editor }: { editor: ReturnType<typeof useDetailEditor> }) { if (editor.isLoading) return <div className="space-y-3 p-5" aria-busy="true" aria-label="Loading discovery detail"><div className="h-5 w-48 animate-pulse rounded bg-[var(--surface-inset)]" /><div className="h-28 animate-pulse rounded-xl bg-[var(--surface-paper)]" /><div className="h-28 animate-pulse rounded-xl bg-[var(--surface-paper)]" /></div>; if (editor.loadError) return <div className="space-y-3 p-5" role="alert"><p className="text-sm font-semibold text-destructive">Unable to load Discovery Detail</p><p className="text-sm text-muted-foreground">{editor.loadError}</p><button type="button" onClick={() => void editor.retryLoad()} className="min-h-11 rounded-xl bg-[var(--color-action-primary)] px-4 text-xs font-semibold text-white">Retry</button></div>; return <DetailForm editor={editor} />; }

export function AdminElementDetailEditor({ elementId, elementName, onClose, onSaved }: DetailEditorProps) {
  const editor = useDetailEditor(elementId, onClose, onSaved);
  return <Dialog open onOpenChange={(open) => { if (!open && !editor.isSaving) onClose(); }}><DialogContent className="max-h-[calc(100dvh-1rem)] max-w-4xl overflow-y-auto p-0"><DialogHeader className="border-b border-[var(--border-subtle)] p-5 pr-14"><DialogTitle>Discovery Detail · {elementName}</DialogTitle><DialogDescription>Maintain the educational lesson, safety metadata, and authoritative Sources for this Element.</DialogDescription></DialogHeader><EditorBody editor={editor} />{!editor.isLoading && !editor.loadError ? <DialogFooter className="border-t border-[var(--border-subtle)]"><button type="submit" form="admin-element-detail-form" disabled={editor.isSaving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-5 text-xs font-semibold text-white hover:bg-[var(--color-action-hover)] disabled:opacity-60">{editor.isSaving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}{editor.isSaving ? "Saving..." : "Save Discovery Detail"}</button></DialogFooter> : null}</DialogContent></Dialog>;
}
