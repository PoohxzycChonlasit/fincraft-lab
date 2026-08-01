"use client";

import { useRef, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ElementCanvasNode } from "../types/canvas-node.type";

type CanvasNodeRemovalDialogProps = {
  node: ElementCanvasNode | null;
  incidentEdgeCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isProcessing: boolean;
  removeTriggerRef: RefObject<HTMLButtonElement | null>;
  frameRef: RefObject<HTMLDivElement | null>;
};

export function CanvasNodeRemovalDialog({ node, incidentEdgeCount, open, onOpenChange, onConfirm, isProcessing, removeTriggerRef, frameRef }: CanvasNodeRemovalDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  if (!node) return null;

  const connectionLabel = `${incidentEdgeCount} lineage connection${incidentEdgeCount === 1 ? "" : "s"}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md"
        onOpenAutoFocus={(event) => {
          if (!cancelButtonRef.current) return;
          event.preventDefault();
          cancelButtonRef.current.focus({ preventScroll: true });
        }}
        onCloseAutoFocus={(event) => {
          const focusTarget = removeTriggerRef.current ?? frameRef.current;
          if (!focusTarget) return;
          event.preventDefault();
          focusTarget.focus({ preventScroll: true });
        }}
      >
        <DialogHeader>
          <DialogTitle>Remove {node.data.name} from this Canvas?</DialogTitle>
          <DialogDescription>
            This removes the Canvas Node and its {connectionLabel}. The financial Element, learned Discovery and master content remain available.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button ref={cancelButtonRef} type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>Cancel</Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isProcessing} aria-busy={isProcessing}>{isProcessing ? "Removing..." : "Remove Node"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
