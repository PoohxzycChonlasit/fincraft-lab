"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateWorkspaceAction,
  useRenameWorkspaceAction,
  useSwitchWorkspaceAction,
  type Feedback,
  type PendingAction,
  type WorkspaceActionContext,
} from "./workspace-manager-actions";
import { useDeleteWorkspaceAction } from "./workspace-manager-delete-action";
import type { WorkspaceSummary } from "../types/workspace.type";

function workspaceHref(workspaceId: string | null): string {
  return workspaceId ? `/lab?workspaceId=${encodeURIComponent(workspaceId)}` : "/lab";
}

function useWorkspaceNavigation() {
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();
  const navigateToWorkspace = useCallback((workspaceId: string | null) => {
    startTransition(() => router.replace(workspaceHref(workspaceId), { scroll: false }));
  }, [router]);
  const refresh = useCallback(() => router.refresh(), [router]);
  return { isNavigating, navigateToWorkspace, refresh };
}

export function useWorkspaceManager(initialWorkspaces: WorkspaceSummary[], initialSelectedWorkspace: WorkspaceSummary) {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedWorkspace.id);
  const [createName, setCreateName] = useState("");
  const [renameName, setRenameName] = useState(initialSelectedWorkspace.name);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const { isNavigating, navigateToWorkspace, refresh } = useWorkspaceNavigation();
  const selectedWorkspace = workspaces.find((workspace) => workspace.id === selectedId) ?? null;
  const isBusy = pendingAction !== null || isNavigating;
  const actionContext: WorkspaceActionContext = {
    workspaces, selectedId, selectedWorkspace, createName, renameName, isBusy,
    setCreateName, setRenameName, setWorkspaces, setSelectedId, setPendingAction,
    setFeedback, navigateToWorkspace, refresh,
  };
  const handleSwitch = useSwitchWorkspaceAction(actionContext);
  const handleCreate = useCreateWorkspaceAction(actionContext);
  const handleRename = useRenameWorkspaceAction(actionContext);
  const handleDelete = useDeleteWorkspaceAction(actionContext);

  return {
    workspaces, selectedId, selectedWorkspace, createName, renameName,
    pendingAction, feedback, isBusy, setCreateName, setRenameName,
    handleSwitch, handleCreate, handleRename, handleDelete,
  };
}
