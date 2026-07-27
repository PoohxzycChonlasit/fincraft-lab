"use client";

import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import { createWorkspaceApi, updateWorkspaceApi } from "../api/workspace.client";
import type { WorkspaceSummary } from "../types/workspace.type";

export type PendingAction = "create" | "rename" | "delete" | "switch" | null;
export type Feedback = { kind: "success" | "error"; message: string } | null;
type SetPendingAction = Dispatch<SetStateAction<PendingAction>>;
type SetFeedback = Dispatch<SetStateAction<Feedback>>;
type SetWorkspaces = Dispatch<SetStateAction<WorkspaceSummary[]>>;

type Navigation = (workspaceId: string | null) => void;

export type WorkspaceActionContext = {
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
  navigateToWorkspace: Navigation;
  refresh: () => void;
};

export function useSwitchWorkspaceAction(input: WorkspaceActionContext) {
  return useCallback((workspaceId: string) => {
    if (input.isBusy || workspaceId === input.selectedId) return;
    input.setFeedback(null);
    input.setSelectedId(workspaceId);
    input.setPendingAction("switch");
    input.navigateToWorkspace(workspaceId);
    input.setPendingAction(null);
  }, [input]);
}

export function useCreateWorkspaceAction(input: WorkspaceActionContext) {
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

export function useRenameWorkspaceAction(input: WorkspaceActionContext) {
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
    input.setWorkspaces((current) => current.map((workspace) => workspace.id === result.data.id ? result.data : workspace));
    input.setRenameName(result.data.name);
    input.setFeedback({ kind: "success", message: `Workspace renamed to "${result.data.name}".` });
    input.setPendingAction(null);
    input.refresh();
  }, [input]);
}
