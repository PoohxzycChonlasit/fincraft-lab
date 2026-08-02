"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { Archive, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AdminArchiveDialogProps = {
  trigger: ReactElement;
  itemName: string;
  description: string;
  isPending: boolean;
  onConfirm: () => Promise<boolean>;
};

export function AdminArchiveDialog({
  trigger,
  itemName,
  description,
  isPending,
  onConfirm,
}: AdminArchiveDialogProps) {
  const [open, setOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = isPending || isConfirming;

  const handleConfirm = async () => {
    setError(null);
    setIsConfirming(true);
    try {
      const archived = await onConfirm();
      if (archived) setOpen(false);
      else setError("The status did not change. Review the message on the list and try again.");
    } catch {
      setError("The lifecycle change could not be completed. The record remains unchanged.");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (busy) return;
        setError(null);
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-1rem)] max-w-md overflow-hidden p-0">
        <DialogHeader className="p-5 pr-14">
          <DialogTitle className="break-words">Archive {itemName}?</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {error ? <div role="alert" className="mx-5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs leading-5 text-destructive">{error}</div> : null}
        <DialogFooter className="mx-0 mb-0">
          <DialogClose asChild>
            <button type="button" disabled={busy} className="min-h-11 rounded-xl border border-(--border-subtle) bg-(--surface-inset) px-4 text-xs font-semibold text-foreground hover:bg-(--surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) disabled:opacity-60">
              Keep active
            </button>
          </DialogClose>
          <button type="button" onClick={() => void handleConfirm()} disabled={busy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 text-xs font-semibold text-white hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:opacity-60">
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Archive className="size-4" aria-hidden="true" />}
            {busy ? "Archiving..." : "Archive"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
