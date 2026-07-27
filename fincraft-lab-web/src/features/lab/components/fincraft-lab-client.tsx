"use client";

import { useCallback, useMemo, useState } from "react";
import {
  useCraft,
  useCraftBaySelection,
  type AvailableElement,
  type CraftElementResult,
} from "@/features/craft/public";
import { useCanvasNodes, type InitialNodeInput, type PersistableCanvasNode, type SaveStatus } from "@/features/canvas/public";
import { saveWorkspaceCanvasApi, type CanvasSnapshot, type WorkspaceSummary } from "@/features/workspace/public.client";
import { LabWorkspaceContent } from "./lab-workspace-content";

export type FinCraftLabClientProps = {
  elements: AvailableElement[];
  errorMessage?: string;
  workspaceErrorMessage?: string;
  initialWorkspace?: {
    workspaceId: string;
    workspaces: WorkspaceSummary[];
    selectedWorkspace: WorkspaceSummary;
    snapshot: CanvasSnapshot;
  };
};

function toAvailableElement(el: CraftElementResult): AvailableElement {
  return { id: el.id, name: el.name, slug: el.slug, emoji: el.emoji, iconUrl: el.iconUrl, elementType: el.elementType, isStarter: el.isStarter };
}

function LoadErrorBanner({ message }: { message: string }) {
  return (
    <div className="surface-inset rounded-xl p-6 border border-destructive/30 bg-destructive/5 space-y-2">
      <h2 className="text-base font-semibold text-destructive">Unable to Load Craft Lab</h2>
      <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
    </div>
  );
}

function useLabWorkspaceSave(workspaceId: string | undefined, getPersistableNodes: () => PersistableCanvasNode[], markSaved: () => void) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const handleSave = useCallback(async () => {
    if (!workspaceId || saveStatus === "saving") return;
    setSaveStatus("saving");
    setSaveError(null);
    const result = await saveWorkspaceCanvasApi(workspaceId, getPersistableNodes());
    if (result.success) {
      markSaved();
      setSaveStatus("saved");
      return;
    }
    setSaveStatus("error");
    setSaveError(result.errorMessage);
  }, [workspaceId, saveStatus, getPersistableNodes, markSaved]);
  return { saveStatus, saveError, handleSave };
}

export function FinCraftLabClient({
  elements: initialElements,
  errorMessage,
  workspaceErrorMessage,
  initialWorkspace,
}: FinCraftLabClientProps) {
  const [localElements, setLocalElements] = useState<AvailableElement[]>(initialElements);
  const initialCanvasNodes = useMemo<InitialNodeInput[] | undefined>(() => initialWorkspace?.snapshot.nodes.map((node) => ({
    id: node.id,
    elementId: node.elementId,
    positionX: node.positionX,
    positionY: node.positionY,
    name: node.element?.name,
    emoji: node.element?.emoji,
    categoryName: node.element?.elementType,
  })), [initialWorkspace]);
  const canvas = useCanvasNodes(initialCanvasNodes);
  const save = useLabWorkspaceSave(initialWorkspace?.workspaceId, canvas.getPersistableNodes, canvas.markSaved);
  const handleDiscovery = useCallback((element: CraftElementResult) => {
    setLocalElements((current) => current.some((item) => item.id === element.id) ? current : [...current, toAvailableElement(element)]);
  }, []);
  const { activeSlot, setActiveSlot, leftElement, rightElement, handleSelectElement, handleClearSlot } = useCraftBaySelection();
  const { isSubmitting, craftError, craftResult, handleCraft, handleReset, dismissError } = useCraft({ onDiscovery: handleDiscovery });
  const { addElementsToCanvas } = canvas;
  const handlePlaceOnCanvas = useCallback(() => {
    const selected = [leftElement, rightElement].filter((element): element is AvailableElement => Boolean(element)).map((element) => ({ id: element.id, name: element.name, emoji: element.emoji, categoryName: element.elementType }));
    if (selected.length > 0) addElementsToCanvas(selected);
  }, [leftElement, rightElement, addElementsToCanvas]);

  if (errorMessage) return <LoadErrorBanner message={errorMessage} />;
  if (workspaceErrorMessage || !initialWorkspace) return <LoadErrorBanner message={workspaceErrorMessage ?? "Workspace data is unavailable."} />;

  return <LabWorkspaceContent initialWorkspace={initialWorkspace} canvas={canvas} save={save} localElements={localElements} leftElement={leftElement} rightElement={rightElement} activeSlot={activeSlot} isSubmitting={isSubmitting} craftError={craftError} craftResult={craftResult} handleReset={handleReset} handleSelectElement={handleSelectElement} handleClearSlot={handleClearSlot} setActiveSlot={setActiveSlot} handleCraft={() => void handleCraft(leftElement, rightElement)} handlePlaceOnCanvas={handlePlaceOnCanvas} dismissError={dismissError} />;
}
