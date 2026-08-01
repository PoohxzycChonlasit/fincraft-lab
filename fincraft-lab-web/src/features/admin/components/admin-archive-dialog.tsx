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
  const busy = isPending || isConfirming;

  const handleConfirm = async () => {
    setIsConfirming(true);
    const archived = await onConfirm();
    setIsConfirming(false);
    if (archived) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!busy) setOpen(nextOpen); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Archive {itemName}?</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <button type="button" disabled={busy} className="min-h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-4 text-xs font-semibold text-foreground hover:bg-[var(--surface-raised)] disabled:opacity-60">
              Keep active
            </button>
          </DialogClose>
          <button type="button" onClick={handleConfirm} disabled={busy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 text-xs font-semibold text-white hover:bg-amber-800 disabled:opacity-60">
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Archive className="size-4" aria-hidden="true" />}
            Archive
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
