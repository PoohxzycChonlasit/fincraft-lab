"use client";

import { useState, useMemo, useCallback } from "react";
import type {
  AdminElementSummary,
  CategoryOption,
  ContentStatusEnum,
  CreateAdminElementPayload,
  UpdateAdminElementPayload,
} from "../types/admin-element.type";

async function postAdminElement(payload: CreateAdminElementPayload) {
  const res = await fetch("/api/admin/elements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string };
  return { ok: res.ok, status: res.status, error: json.error };
}

async function patchAdminElement(elementId: string, payload: UpdateAdminElementPayload) {
  const res = await fetch(`/api/admin/elements/${elementId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string };
  return { ok: res.ok, status: res.status, error: json.error };
}

async function deleteAdminElementApi(elementId: string) {
  const res = await fetch(`/api/admin/elements/${elementId}`, { method: "DELETE" });
  const json = (await res.json().catch(() => ({}))) as { error?: string };
  return { ok: res.ok, status: res.status, error: json.error };
}

export function useAdminElementManager(initialElements: AdminElementSummary[]) {
  const [elements, setElements] = useState<AdminElementSummary[]>(initialElements);
  const [editingElement, setEditingElement] = useState<AdminElementSummary | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo<CategoryOption[]>(() => {
    const map = new Map<string, string>();
    for (const el of elements) {
      if (el.categoryId && el.categoryName) map.set(el.categoryId, el.categoryName);
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [elements]);

  const refreshElements = async () => {
    const res = await fetch("/api/admin/elements").catch(() => null);
    if (res?.ok) {
      const json = (await res.json()) as { data?: AdminElementSummary[] };
      if (json.data) setElements(json.data);
    }
  };

  const handleOpenCreate = () => { setEditingElement(null); setIsFormOpen(true); setError(null); setFeedback(null); };
  const handleOpenEdit = (el: AdminElementSummary) => { setEditingElement(el); setIsFormOpen(true); setError(null); setFeedback(null); };
  const handleCancelForm = () => { setIsFormOpen(false); setEditingElement(null); };

  const handleCreateSubmit = useCallback(async (payload: CreateAdminElementPayload) => {
    setIsSubmitting(true); setError(null); setFeedback(null);
    const res = await postAdminElement(payload);
    if (!res.ok) { setError(res.error || `Create failed (HTTP ${res.status})`); setIsSubmitting(false); return; }
    setFeedback(`Element "${payload.name}" created successfully.`); setIsFormOpen(false);
    await refreshElements(); setIsSubmitting(false);
  }, []);

  const handleUpdateSubmit = useCallback(async (elementId: string, payload: UpdateAdminElementPayload) => {
    setIsSubmitting(true); setError(null); setFeedback(null);
    const res = await patchAdminElement(elementId, payload);
    if (!res.ok) { setError(res.error || `Update failed (HTTP ${res.status})`); setIsSubmitting(false); return; }
    setFeedback("Element updated successfully."); setIsFormOpen(false); setEditingElement(null);
    await refreshElements(); setIsSubmitting(false);
  }, []);

  const handleArchiveElement = useCallback(async (elementId: string, name: string) => {
    if (!window.confirm(`Archive master element "${name}"? It will be hidden from normal discovery library but retained in learning records.`)) return;
    setIsSubmitting(true); setError(null); setFeedback(null);
    const res = await deleteAdminElementApi(elementId);
    if (!res.ok) { setError(res.error || `Archive failed (HTTP ${res.status})`); setIsSubmitting(false); return; }
    setFeedback(`Element "${name}" archived successfully.`);
    await refreshElements(); setIsSubmitting(false);
  }, []);

  const handleQuickStatusChange = useCallback(async (elementId: string, status: ContentStatusEnum) => {
    await handleUpdateSubmit(elementId, { status });
  }, [handleUpdateSubmit]);

  return {
    elements, categories, editingElement, isFormOpen, isSubmitting, feedback, error,
    handleOpenCreate, handleOpenEdit, handleCancelForm, handleCreateSubmit, handleUpdateSubmit, handleArchiveElement, handleQuickStatusChange,
  };
}
