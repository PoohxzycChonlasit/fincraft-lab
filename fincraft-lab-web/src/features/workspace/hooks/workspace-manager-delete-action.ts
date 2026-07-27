"use client";

import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import { deleteWorkspaceApi } from "../api/workspace.client";
import type { WorkspaceSummary } from "../types/workspace.type";
import type { Feedback, PendingAction } from "./workspace-manager-actions";

type DeleteActionInput = {
  selectedWorkspace: WorkspaceSummary | null;
  workspaces: WorkspaceSummary[];
  isBusy: boolean;
  setWorkspaces: Dispatch<SetStateAction<WorkspaceSummary[]>>;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setPendingAction: Dispatch<SetStateAction<PendingAction>>;
  setFeedback: Dispatch<SetStateAction<Feedback>>;
  navigateToWorkspace: (workspaceId: string | null) => void;
};

export function useDeleteWorkspaceAction(input: DeleteActionInput) {
  return useCallback(async () => {
    if (!input.selectedWorkspace || input.isBusy) return;
    const confirmed = window.confirm(`Delete workspace "${input.selectedWorkspace.name}"?\n\nThe Workspace and its Canvas will be removed.\nThis does not delete Elements, Discoveries, or your user account.`);
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
