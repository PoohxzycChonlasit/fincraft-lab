"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { toast } from "sonner";
import type { Edge } from "@xyflow/react";
import type { ElementCanvasNode } from "../types/canvas-node.type";

type CanvasActionOptions = {
  selectedNode: ElementCanvasNode | null;
  incidentEdges: Edge[];
  isBusy: boolean;
  onRemoveNode: (nodeId: string) => void;
  onClearTapSelection: () => void;
};

const EDITABLE_TARGET_SELECTOR = "input, textarea, select, button, a[href], [role=\"textbox\"], [role=\"combobox\"], [role=\"button\"]";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target.closest(EDITABLE_TARGET_SELECTOR)) return true;
  const editableAncestor = target.closest("[contenteditable]");
  return Boolean(editableAncestor && editableAncestor.getAttribute("contenteditable") !== "false");
}

export function useCanvasActions({ selectedNode, incidentEdges, isBusy, onRemoveNode, onClearTapSelection }: CanvasActionOptions) {
  const [removalDialogOpen, setRemovalDialogOpen] = useState(false);
  const removalNodeIdRef = useRef<string | null>(null);
  const removeTriggerRef = useRef<HTMLButtonElement>(null);
  const [removingNodeId, setRemovingNodeId] = useState<string | null>(null);
  const isRemovalProcessing = Boolean(selectedNode && removingNodeId === selectedNode.id);

  const removeSelectedNode = useCallback(() => {
    if (!selectedNode || isBusy || removalNodeIdRef.current === selectedNode.id) return false;
    removalNodeIdRef.current = selectedNode.id;
    setRemovingNodeId(selectedNode.id);
    const nodeName = selectedNode.data.name;
    const connectionCount = incidentEdges.length;
    onRemoveNode(selectedNode.id);
    onClearTapSelection();
    setRemovalDialogOpen(false);
    toast.success(connectionCount > 0
      ? `Removed ${nodeName} and ${connectionCount} lineage connection${connectionCount === 1 ? "" : "s"} from this Canvas.`
      : `Removed ${nodeName} from this Canvas.`);
    return true;
  }, [incidentEdges.length, isBusy, onClearTapSelection, onRemoveNode, selectedNode]);

  const requestRemoveSelectedNode = useCallback(() => {
    if (!selectedNode || isBusy || removalDialogOpen || removalNodeIdRef.current === selectedNode.id) return false;
    if (incidentEdges.length > 0) {
      setRemovalDialogOpen(true);
      return true;
    }
    return removeSelectedNode();
  }, [incidentEdges.length, isBusy, removalDialogOpen, removeSelectedNode, selectedNode]);

  const handleCanvasKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (event.key !== "Delete" && event.key !== "Backspace") return;
    if (isEditableTarget(event.target) || !selectedNode || isBusy || isRemovalProcessing || removalDialogOpen || removalNodeIdRef.current === selectedNode.id) return;
    if (requestRemoveSelectedNode()) event.preventDefault();
  }, [isBusy, isRemovalProcessing, removalDialogOpen, requestRemoveSelectedNode, selectedNode]);

  return { removalDialogOpen, setRemovalDialogOpen, isRemovalProcessing, removeTriggerRef, removeSelectedNode, requestRemoveSelectedNode, handleCanvasKeyDown };
}
