"use client";

import { useState, useMemo, useCallback } from "react";
import type {
  AdminElementSummary,
  CategoryOption,
  ContentStatusEnum,
  CreateAdminElementPayload,
  UpdateAdminElementPayload,
} from "../types/admin-element.type";

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
    try {
      const res = await fetch("/api/admin/elements");
      if (res.ok) {
        const json = (await res.json()) as { data?: AdminElementSummary[] };
        if (json.data) setElements(json.data);
      }
    } catch {
      // Keep state if background refresh fails
    }
  };

  const handleOpenCreate = () => { setEditingElement(null); setIsFormOpen(true); setError(null); setFeedback(null); };
  const handleOpenEdit = (element: AdminElementSummary) => { setEditingElement(element); setIsFormOpen(true); setError(null); setFeedback(null); };
  const handleCancelForm = () => { setIsFormOpen(false); setEditingElement(null); };

  const handleCreateSubmit = useCallback(async (payload: CreateAdminElementPayload) => {
    setIsSubmitting(true); setError(null); setFeedback(null);
    try {
      const res = await fetch("/api/admin/elements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) { setError(json.error || `Create failed (HTTP ${res.status})`); return; }
      setFeedback(`Element "${payload.name}" created successfully.`);
      setIsFormOpen(false);
      await refreshElements();
    } catch { setError("Network error creating element."); } finally { setIsSubmitting(false); }
  }, []);

  const handleUpdateSubmit = useCallback(async (elementId: string, payload: UpdateAdminElementPayload) => {
    setIsSubmitting(true); setError(null); setFeedback(null);
    try {
      const res = await fetch(`/api/admin/elements/${elementId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) { setError(json.error || `Update failed (HTTP ${res.status})`); return; }
      setFeedback("Element updated successfully.");
      setIsFormOpen(false); setEditingElement(null);
      await refreshElements();
    } catch { setError("Network error updating element."); } finally { setIsSubmitting(false); }
  }, []);

  const handleQuickStatusChange = useCallback(async (elementId: string, status: ContentStatusEnum) => {
    await handleUpdateSubmit(elementId, { status });
  }, [handleUpdateSubmit]);

  return {
    elements, categories, editingElement, isFormOpen, isSubmitting, feedback, error,
    handleOpenCreate, handleOpenEdit, handleCancelForm, handleCreateSubmit, handleUpdateSubmit, handleQuickStatusChange,
  };
}
