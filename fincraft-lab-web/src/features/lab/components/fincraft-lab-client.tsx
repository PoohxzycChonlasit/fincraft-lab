"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { AvailableElement, CraftDiscoveryResult, CraftElementResult } from "@/features/craft/public";
import { useCanvasNodes, type InitialEdgeInput, type InitialNodeInput, type PersistableCanvasNode, type SaveStatus } from "@/features/canvas/public";
import { saveWorkspaceCanvasApi, type CanvasSnapshot, type WorkspaceSummary } from "@/features/workspace/public.client";
import { useLabCraftCombine } from "../hooks/use-lab-craft-combine";
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
  getPersistableEdges: () => Array<{ id: string; sourceNodeId: string; targetNodeId: string; label?: string }>,
  getLastDiscovery: () => CraftDiscoveryResult | null,
  markSaved: () => void,
) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    if (!workspaceId || saveStatus === "saving") return;
    setSaveStatus("saving");
    setSaveError(null);
    const result = await saveWorkspaceCanvasApi(
      workspaceId,
      getPersistableNodes(),
      getPersistableEdges(),
      getLastDiscovery(),
    );
    if (result.success) {
      markSaved();
      setSaveStatus("saved");
      return;
    }
    setSaveStatus("error");
    setSaveError(result.errorMessage);
  }, [workspaceId, saveStatus, getPersistableNodes, getPersistableEdges, getLastDiscovery, markSaved]);

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

function buildInitialCanvasEdges(initialWorkspace?: InitialWorkspace): InitialEdgeInput[] | undefined {
  return initialWorkspace?.snapshot.edges?.map((edge) => ({
    id: edge.id,
    sourceNodeId: edge.sourceNodeId,
    targetNodeId: edge.targetNodeId,
    label: edge.label,
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
  const initialCanvasEdges = useMemo(() => buildInitialCanvasEdges(initialWorkspace), [initialWorkspace]);

  const canvas = useCanvasNodes(initialCanvasNodes, initialCanvasEdges);
  const handleDiscovery = useCallback((element: CraftElementResult) => {
    toast.success(`Discovered: ${element.emoji} ${element.name}!`, { duration: 3500 });
    if (!isAuthenticated) return;
    setLocalElements((current) => current.some((item) => item.id === element.id)
      ? current
      : [...current, toAvailableElement(element)]);
  }, [isAuthenticated]);

  const combine = useLabCraftCombine({ canvas, isAuthenticated, onDiscovery: handleDiscovery });
  const getLastDiscovery = useCallback(() => combine.lastDiscovery, [combine.lastDiscovery]);

  const save = useLabWorkspaceSave(
    initialWorkspace?.workspaceId,
    canvas.getPersistableNodes,
    canvas.getPersistableEdges,
    getLastDiscovery,
    canvas.markSaved,
  );

  const { addElementsToCanvas } = canvas;
  const handlePlaceElement = useCallback((element: AvailableElement) => {
    addElementsToCanvas([{
      id: element.id,
      name: element.name,
      emoji: element.emoji,
      categoryName: element.elementType,
    }]);
  }, [addElementsToCanvas]);

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
      handlePlaceElement={handlePlaceElement}
    />
  );
}
