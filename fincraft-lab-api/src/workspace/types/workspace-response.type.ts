import { WorkspaceStatus } from '../../database/generated/prisma/client';

export interface WorkspaceResponse {
  id: string;
  name: string;
  status: WorkspaceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteWorkspaceResponse {
  id: string;
}
