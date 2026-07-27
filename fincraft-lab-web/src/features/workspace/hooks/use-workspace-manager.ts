"use client";

import { useCallback, useState, useTransition } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { createWorkspaceApi, deleteWorkspaceApi, updateWorkspaceApi } from "../api/workspace.client";
import type { WorkspaceSummary } from "../types/workspace.type";

type PendingAction = "create" | "rename" | "delete" | "switch" | null;
type Feedback = { kind: "success" | "error"; message: string } | null;
type SetPendingAction = Dispatch<SetStateAction<PendingAction>>;
type SetFeedback = Dispatch<SetStateAction<Feedback>>;
type SetWorkspaces = Dispatch<SetStateAction<WorkspaceSummary[]>>;

function workspaceHref(workspaceId: string | null): string {
  return workspaceId ? `/lab?workspaceId=${encodeURIComponent(workspaceId)}` : "/lab";
}

function useWorkspaceNavigation() {
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();
  const navigateToWorkspace = useCallback(
    (workspaceId: string | null) => {
      startTransition(() => router.replace(workspaceHref(workspaceId), { scroll: false }));
    },
    [router],
  );
  const refresh = useCallback(() => router.refresh(), [router]);
  return { isNavigating, navigateToWorkspace, refresh };
}

type CreateActionInput = {
  createName: string;
  setCreateName: Dispatch<SetStateAction<string>>;
  setWorkspaces: SetWorkspaces;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setPendingAction: SetPendingAction;
  setFeedback: SetFeedback;
  navigateToWorkspace: (workspaceId: string | null) => void;
};

function useCreateWorkspaceAction(input: CreateActionInput) {
  return useCallback(async () => {
    const name = input.createName.trim();
    if (!name) {
      input.setFeedback({ kind: "error", message: "Workspace name is required." });
      return;
    }

    input.setPendingAction("create");
    input.setFeedback(null);
    const result = await createWorkspaceApi({ name });
    if (!result.success) {
      input.setPendingAction(null);
      input.setFeedback({ kind: "error", message: result.errorMessage });
      return;
    }

    input.setWorkspaces((current) => [result.data, ...current]);
    input.setSelectedId(result.data.id);
    input.setCreateName("");
    input.setFeedback({ kind: "success", message: `Workspace "${result.data.name}" created.` });
    input.setPendingAction(null);
    input.navigateToWorkspace(result.data.id);
  }, [input]);
}

type RenameActionInput = {
  selectedWorkspace: WorkspaceSummary | null;
  renameName: string;
  setRenameName: Dispatch<SetStateAction<string>>;
  setWorkspaces: SetWorkspaces;
  setPendingAction: SetPendingAction;
  setFeedback: SetFeedback;
  refresh: () => void;
};

function useRenameWorkspaceAction(input: RenameActionInput) {
  return useCallback(async () => {
    if (!input.selectedWorkspace) return;
    const name = input.renameName.trim();
    if (!name) {
      input.setFeedback({ kind: "error", message: "Workspace name is required." });
      return;
    }

    input.setPendingAction("rename");
    input.setFeedback(null);
    const result = await updateWorkspaceApi(input.selectedWorkspace.id, { name });
    if (!result.success) {
      input.setPendingAction(null);
      input.setFeedback({ kind: "error", message: result.errorMessage });
      return;
    }

    input.setWorkspaces((current) =>
      current.map((workspace) => (workspace.id === result.data.id ? result.data : workspace)),
    );
    input.setRenameName(result.data.name);
    input.setFeedback({ kind: "success", message: `Workspace renamed to "${result.data.name}".` });
    input.setPendingAction(null);
    input.refresh();
  }, [input]);
}

type DeleteActionInput = {
  selectedWorkspace: WorkspaceSummary | null;
  workspaces: WorkspaceSummary[];
  isBusy: boolean;
  setWorkspaces: SetWorkspaces;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setPendingAction: SetPendingAction;
  setFeedback: SetFeedback;
  navigateToWorkspace: (workspaceId: string | null) => void;
};

function useDeleteWorkspaceAction(input: DeleteActionInput) {
  return useCallback(async () => {
    if (!input.selectedWorkspace || input.isBusy) return;
    const confirmed = window.confirm(
      `Delete workspace "${input.selectedWorkspace.name}"?\n\nThe Workspace and its Canvas will be removed.\nThis does not delete Elements, Discoveries, or your user account.`,
    );
    if (!confirmed) return;

    input.setPendingAction("delete");
    input.setFeedback(null);
    const result = await deleteWorkspaceApi(input.selectedWorkspace.id);
    if (!result.success) {
      input.setPendingAction(null);
      input.setFeedback({ kind: "error", message: result.errorMessage });
      return;
    }

    const remaining = input.workspaces.filter((workspace) => workspace.id !== result.data.id);
    const nextWorkspace = remaining[0] ?? null;
    input.setWorkspaces(remaining);
    input.setSelectedId(nextWorkspace?.id ?? null);
    input.setFeedback({ kind: "success", message: `Workspace "${input.selectedWorkspace.name}" deleted.` });
    input.setPendingAction(null);
    input.navigateToWorkspace(nextWorkspace?.id ?? null);
  }, [input]);
}

type SwitchActionInput = {
  isBusy: boolean;
  selectedId: string | null;
  setFeedback: SetFeedback;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setPendingAction: SetPendingAction;
  navigateToWorkspace: (workspaceId: string | null) => void;
};

function useSwitchWorkspaceAction(input: SwitchActionInput) {
  return useCallback(
    (workspaceId: string) => {
      if (input.isBusy || workspaceId === input.selectedId) return;
      input.setFeedback(null);
      input.setSelectedId(workspaceId);
      input.setPendingAction("switch");
      input.navigateToWorkspace(workspaceId);
      input.setPendingAction(null);
    },
    [input],
  );
}

type WorkspaceActionContext = {
  workspaces: WorkspaceSummary[];
  selectedId: string | null;
  selectedWorkspace: WorkspaceSummary | null;
  createName: string;
  renameName: string;
  isBusy: boolean;
  setCreateName: Dispatch<SetStateAction<string>>;
  setRenameName: Dispatch<SetStateAction<string>>;
  setWorkspaces: SetWorkspaces;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setPendingAction: SetPendingAction;
  setFeedback: SetFeedback;
  navigateToWorkspace: (workspaceId: string | null) => void;
  refresh: () => void;
};

function useWorkspaceCrudActions(input: WorkspaceActionContext) {
  const handleSwitch = useSwitchWorkspaceAction(input);
  const handleCreate = useCreateWorkspaceAction(input);
  const handleRename = useRenameWorkspaceAction(input);
  const handleDelete = useDeleteWorkspaceAction(input);
  return { handleSwitch, handleCreate, handleRename, handleDelete };
}

export function useWorkspaceManager(
  initialWorkspaces: WorkspaceSummary[],
  initialSelectedWorkspace: WorkspaceSummary,
) {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedWorkspace.id);
  const [createName, setCreateName] = useState("");
  const [renameName, setRenameName] = useState(initialSelectedWorkspace.name);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const { isNavigating, navigateToWorkspace, refresh } = useWorkspaceNavigation();

  const selectedWorkspace = workspaces.find((workspace) => workspace.id === selectedId) ?? null;
  const isBusy = pendingAction !== null || isNavigating;
  const actions = useWorkspaceCrudActions({
    workspaces, selectedId, selectedWorkspace, createName, renameName, isBusy,
    setCreateName, setRenameName, setWorkspaces, setSelectedId, setPendingAction,
    setFeedback, navigateToWorkspace, refresh,
  });

  return {
    workspaces,
    selectedId,
    selectedWorkspace,
    createName,
    renameName,
    pendingAction,
    feedback,
    isBusy,
    setCreateName,
    setRenameName,
    ...actions,
  };
}
