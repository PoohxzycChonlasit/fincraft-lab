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

type InitialWorkspace = {
  workspaceId: string;
  workspaces: WorkspaceSummary[];
  selectedWorkspace: WorkspaceSummary;
  snapshot: CanvasSnapshot;
};

export type FinCraftLabClientProps = {
  elements: AvailableElement[];
  isAuthenticated: boolean;
  errorMessage?: string;
  workspaceErrorMessage?: string;
  initialWorkspace?: InitialWorkspace;
};

type LabCraftState = {
  canvas: ReturnType<typeof useCanvasNodes>;
  save: ReturnType<typeof useLabWorkspaceSave>;
  localElements: AvailableElement[];
  leftElement: AvailableElement | null;
  rightElement: AvailableElement | null;
  activeSlot: "left" | "right";
  isSubmitting: boolean;
  craftError: string | null;
  craftResult: ReturnType<typeof useCraft>["craftResult"];
  handleReset: () => void;
  handleSelectElement: (element: AvailableElement) => void;
  handleClearSlot: (slot: "left" | "right") => void;
  setActiveSlot: (slot: "left" | "right") => void;
  handleCraft: () => void;
  handlePlaceOnCanvas: () => void;
  dismissError: () => void;
};

function toAvailableElement(element: CraftElementResult): AvailableElement {
  return {
    id: element.id,
    name: element.name,
    slug: element.slug,
    emoji: element.emoji,
    iconUrl: element.iconUrl,
    elementType: element.elementType,
    isStarter: element.isStarter,
  };
}

function LoadErrorBanner({ message }: { message: string }) {
  return (
    <div className="surface-inset space-y-2 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
      <h2 className="text-base font-semibold text-destructive">Unable to Load Craft Lab</h2>
      <p className="text-xs leading-relaxed text-muted-foreground">{message}</p>
    </div>
  );
}

function useLabWorkspaceSave(
  workspaceId: string | undefined,
  getPersistableNodes: () => PersistableCanvasNode[],
  markSaved: () => void,
) {
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

function useLabCraftState(initialElements: AvailableElement[], isAuthenticated: boolean, initialWorkspace?: InitialWorkspace): LabCraftState {
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
    setLocalElements((current) => current.some((item) => item.id === element.id)
      ? current
      : [...current, toAvailableElement(element)]);
  }, []);
  const selection = useCraftBaySelection();
  const craft = useCraft({ onDiscovery: isAuthenticated ? handleDiscovery : undefined, isAuthenticated });
  const { addElementsToCanvas } = canvas;
  const handlePlaceOnCanvas = useCallback(() => {
    const selected = [selection.leftElement, selection.rightElement]
      .filter((element): element is AvailableElement => Boolean(element))
      .map((element) => ({ id: element.id, name: element.name, emoji: element.emoji, categoryName: element.elementType }));
    if (selected.length > 0) addElementsToCanvas(selected);
  }, [selection.leftElement, selection.rightElement, addElementsToCanvas]);

  return {
    canvas,
    save,
    localElements,
    leftElement: selection.leftElement,
    rightElement: selection.rightElement,
    activeSlot: selection.activeSlot,
    isSubmitting: craft.isSubmitting,
    craftError: craft.craftError,
    craftResult: craft.craftResult,
    handleReset: craft.handleReset,
    handleSelectElement: selection.handleSelectElement,
    handleClearSlot: selection.handleClearSlot,
    setActiveSlot: selection.setActiveSlot,
    handleCraft: () => void craft.handleCraft(selection.leftElement, selection.rightElement),
    handlePlaceOnCanvas,
    dismissError: craft.dismissError,
  };
}

export function FinCraftLabClient({
  elements: initialElements,
  isAuthenticated,
  errorMessage,
  workspaceErrorMessage,
  initialWorkspace,
}: FinCraftLabClientProps) {
  const lab = useLabCraftState(initialElements, isAuthenticated, initialWorkspace);

  if (errorMessage) return <LoadErrorBanner message={errorMessage} />;
  if (isAuthenticated && (workspaceErrorMessage || !initialWorkspace)) {
    return <LoadErrorBanner message={workspaceErrorMessage ?? "Workspace data is unavailable."} />;
  }

  return <LabWorkspaceContent isAuthenticated={isAuthenticated} initialWorkspace={initialWorkspace} {...lab} />;
}
