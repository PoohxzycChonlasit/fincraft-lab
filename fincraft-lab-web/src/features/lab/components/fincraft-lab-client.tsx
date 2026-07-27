"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useCraftBaySelection,
  type AvailableElement,
  type CraftElementResult,
} from "@/features/craft/public";
import { useCanvasNodes, useCanvasCombine, type InitialNodeInput, type PersistableCanvasNode, type SaveStatus } from "@/features/canvas/public";
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

function buildInitialCanvasNodes(initialWorkspace?: InitialWorkspace): InitialNodeInput[] | undefined {
  return initialWorkspace?.snapshot.nodes.map((node) => ({
    id: node.id,
    elementId: node.elementId,
    positionX: node.positionX,
    positionY: node.positionY,
    name: node.element?.name,
    emoji: node.element?.emoji,
    categoryName: node.element?.elementType,
  }));
}

export function FinCraftLabClient({
  elements: initialElements,
  isAuthenticated,
  errorMessage,
  workspaceErrorMessage,
  initialWorkspace,
}: FinCraftLabClientProps) {
  const [localElements, setLocalElements] = useState<AvailableElement[]>(initialElements);

  const initialCanvasNodes = useMemo(() => buildInitialCanvasNodes(initialWorkspace), [initialWorkspace]);
  const canvas = useCanvasNodes(initialCanvasNodes);
  const save = useLabWorkspaceSave(initialWorkspace?.workspaceId, canvas.getPersistableNodes, canvas.markSaved);
  const selection = useCraftBaySelection();

  const handleDiscovery = useCallback((element: CraftElementResult) => {
    toast.success(`Discovered: ${element.emoji} ${element.name}!`, { duration: 3500 });
    setLocalElements((current) =>
      current.some((item) => item.id === element.id) ? current : [...current, toAvailableElement(element)],
    );
  }, []);

  const combine = useCanvasCombine({
    canvas,
    isAuthenticated,
    onDiscovery: handleDiscovery,
  });

  const handlePlaceOnCanvas = useCallback(() => {
    const selected = [selection.leftElement, selection.rightElement]
      .filter((el): el is AvailableElement => Boolean(el))
      .map((el) => ({ id: el.id, name: el.name, emoji: el.emoji, categoryName: el.elementType }));
    if (selected.length > 0) canvas.addElementsToCanvas(selected);
  }, [selection.leftElement, selection.rightElement, canvas]);

  if (errorMessage) return <LoadErrorBanner message={errorMessage} />;
  if (isAuthenticated && (workspaceErrorMessage || !initialWorkspace)) {
    return <LoadErrorBanner message={workspaceErrorMessage ?? "Workspace data is unavailable."} />;
  }

  return (
    <LabWorkspaceContent
      isAuthenticated={isAuthenticated}
      initialWorkspace={initialWorkspace}
      canvas={canvas}
      save={save}
      combine={combine}
      localElements={localElements}
      leftElement={selection.leftElement}
      rightElement={selection.rightElement}
      activeSlot={selection.activeSlot}
      handleSelectElement={selection.handleSelectElement}
      handleClearSlot={selection.handleClearSlot}
      setActiveSlot={selection.setActiveSlot}
      handlePlaceOnCanvas={handlePlaceOnCanvas}
    />
  );
}
