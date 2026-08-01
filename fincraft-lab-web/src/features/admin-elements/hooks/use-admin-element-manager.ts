"use client";

import { useCallback, useMemo, useState } from "react";
import type { AdminElementSummary, CategoryOption, ContentStatusEnum, CreateAdminElementPayload, UpdateAdminElementPayload } from "../types/admin-element.type";

async function readMutation(path: string, method: "POST" | "PATCH" | "DELETE", body?: unknown) { const response = await fetch(path, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined }); const payload = (await response.json().catch(() => ({}))) as { error?: string }; return { ok: response.ok, status: response.status, error: payload.error }; }

function useElementState(initialElements: AdminElementSummary[]) {
  const [elements, setElements] = useState(initialElements);
  const [editingElement, setEditingElement] = useState<AdminElementSummary | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const categories = useMemo<CategoryOption[]>(() => { const categoryMap = new Map<string, string>(); for (const element of elements) { if (element.categoryId && element.categoryName) categoryMap.set(element.categoryId, element.categoryName); } return Array.from(categoryMap.entries()).map(([id, name]) => ({ id, name })); }, [elements]);
  const refreshElements = async () => { const response = await fetch("/api/admin/elements", { cache: "no-store" }).catch(() => null); if (!response?.ok) return false; const payload = (await response.json().catch(() => null)) as { data?: AdminElementSummary[] } | null; if (!payload || !Array.isArray(payload.data)) return false; setElements(payload.data); return true; };
  return { elements, setElements, categories, editingElement, setEditingElement, isFormOpen, setIsFormOpen, isSubmitting, setIsSubmitting, feedback, setFeedback, error, setError, refreshElements };
}

function useElementActions(state: ReturnType<typeof useElementState>) {
  const handleOpenCreate = () => { state.setEditingElement(null); state.setIsFormOpen(true); state.setError(null); state.setFeedback(null); };
  const handleOpenEdit = (element: AdminElementSummary) => { state.setEditingElement(element); state.setIsFormOpen(true); state.setError(null); state.setFeedback(null); };
  const handleCancelForm = () => { state.setIsFormOpen(false); state.setEditingElement(null); };
  const handleCreateSubmit = useCallback(async (payload: CreateAdminElementPayload) => { state.setIsSubmitting(true); state.setError(null); state.setFeedback(null); const result = await readMutation("/api/admin/elements", "POST", payload); if (!result.ok) { state.setError(result.error || `Create failed (HTTP ${result.status})`); state.setIsSubmitting(false); return; } state.setFeedback(`Element "${payload.name}" created successfully.`); state.setIsFormOpen(false); await state.refreshElements(); state.setIsSubmitting(false); }, [state]);
  const handleUpdateSubmit = useCallback(async (elementId: string, payload: UpdateAdminElementPayload) => { state.setIsSubmitting(true); state.setError(null); state.setFeedback(null); const result = await readMutation(`/api/admin/elements/${elementId}`, "PATCH", payload); if (!result.ok) { state.setError(result.error || `Update failed (HTTP ${result.status})`); state.setIsSubmitting(false); return; } state.setFeedback("Element updated successfully."); state.setIsFormOpen(false); state.setEditingElement(null); await state.refreshElements(); state.setIsSubmitting(false); }, [state]);
  const handleArchiveElement = useCallback(async (elementId: string, name: string): Promise<boolean> => { state.setIsSubmitting(true); state.setError(null); state.setFeedback(null); const result = await readMutation(`/api/admin/elements/${elementId}`, "DELETE"); if (!result.ok) { state.setError(result.error || `Archive failed (HTTP ${result.status})`); state.setIsSubmitting(false); return false; } state.setFeedback(`Element "${name}" archived successfully.`); const refreshed = await state.refreshElements(); state.setIsSubmitting(false); return refreshed; }, [state]);
  const handleReactivateElement = useCallback(async (elementId: string, name: string): Promise<boolean> => { state.setIsSubmitting(true); state.setError(null); state.setFeedback(null); const result = await readMutation(`/api/admin/elements/${elementId}`, "PATCH", { status: "ACTIVE" }); if (!result.ok) { state.setError(result.error || `Reactivation failed (HTTP ${result.status})`); state.setIsSubmitting(false); return false; } state.setFeedback(`Element "${name}" reactivated successfully.`); const refreshed = await state.refreshElements(); state.setIsSubmitting(false); return refreshed; }, [state]);
  const handleQuickStatusChange = useCallback(async (elementId: string, status: ContentStatusEnum) => { await handleUpdateSubmit(elementId, { status }); }, [handleUpdateSubmit]);
  const handleDetailSaved = useCallback((elementId: string) => { state.setElements((current) => current.map((element) => element.id === elementId ? { ...element, hasDiscoveryDetail: true } : element)); state.setFeedback("Discovery Detail saved successfully."); }, [state]);
  return { handleOpenCreate, handleOpenEdit, handleCancelForm, handleCreateSubmit, handleUpdateSubmit, handleArchiveElement, handleReactivateElement, handleQuickStatusChange, handleDetailSaved };
}

export function useAdminElementManager(initialElements: AdminElementSummary[]) {
  const state = useElementState(initialElements);
  const actions = useElementActions(state);
  return { elements: state.elements, categories: state.categories, editingElement: state.editingElement, isFormOpen: state.isFormOpen, isSubmitting: state.isSubmitting, feedback: state.feedback, error: state.error, ...actions };
}
