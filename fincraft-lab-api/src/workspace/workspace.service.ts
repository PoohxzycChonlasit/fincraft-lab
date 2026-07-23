import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  UserStatus,
  Workspace,
  WorkspaceStatus,
} from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import type { CreateWorkspaceDto } from './dto/create-workspace.dto';
import type { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import type {
  DeleteWorkspaceResponse,
  WorkspaceResponse,
} from './types/workspace-response.type';

@Injectable()
export class WorkspaceService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  private async validateUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, status: true },
    });

    if (!user) {
      throw new UnauthorizedException('User account not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('User account is disabled');
    }
  }

  private mapWorkspaceResponse(workspace: Workspace): WorkspaceResponse {
    return {
      id: workspace.id,
      name: workspace.name,
      status: workspace.status,
      createdAt: workspace.createdAt.toISOString(),
      updatedAt: workspace.updatedAt.toISOString(),
    };
  }

  async createWorkspace(
    userId: string,
    dto: CreateWorkspaceDto,
  ): Promise<WorkspaceResponse> {
    await this.validateUser(userId);

    const trimmedName =
      typeof dto.name === 'string' ? dto.name.trim() : dto.name;

    if (!trimmedName || trimmedName.length === 0) {
      throw new BadRequestException('Workspace name cannot be empty');
    }

    const workspace = await this.prisma.workspace.create({
      data: {
        userId,
        name: trimmedName,
      },
    });

    return this.mapWorkspaceResponse(workspace);
  }

  async getWorkspaces(userId: string): Promise<WorkspaceResponse[]> {
    await this.validateUser(userId);

    const workspaces = await this.prisma.workspace.findMany({
      where: { userId },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }],
    });

    return workspaces.map((w) => this.mapWorkspaceResponse(w));
  }

  async getWorkspace(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceResponse> {
    await this.validateUser(userId);

    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, userId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return this.mapWorkspaceResponse(workspace);
  }

  async updateWorkspace(
    userId: string,
    workspaceId: string,
    dto: UpdateWorkspaceDto,
  ): Promise<WorkspaceResponse> {
    await this.validateUser(userId);

    if (
      !dto ||
      Object.keys(dto).length === 0 ||
      (dto.name === undefined && dto.status === undefined)
    ) {
      throw new BadRequestException(
        'At least one field must be provided for update',
      );
    }

    if (dto.name === null || dto.status === null) {
      throw new BadRequestException('Field values cannot be null');
    }

    const updateData: { name?: string; status?: WorkspaceStatus } = {};

    if (dto.name !== undefined) {
      const trimmedName =
        typeof dto.name === 'string' ? dto.name.trim() : dto.name;
      if (!trimmedName || trimmedName.length === 0) {
        throw new BadRequestException('Workspace name cannot be empty');
      }
      updateData.name = trimmedName;
    }

    if (dto.status !== undefined) {
      updateData.status = dto.status;
    }

    const updatedCount = await this.prisma.workspace.updateMany({
      where: { id: workspaceId, userId },
      data: updateData,
    });

    if (updatedCount.count === 0) {
      throw new NotFoundException('Workspace not found');
    }

    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, userId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return this.mapWorkspaceResponse(workspace);
  }

  async deleteWorkspace(
    userId: string,
    workspaceId: string,
  ): Promise<DeleteWorkspaceResponse> {
    await this.validateUser(userId);

    const deleteResult = await this.prisma.workspace.deleteMany({
      where: { id: workspaceId, userId },
    });

    if (deleteResult.count === 0) {
      throw new NotFoundException('Workspace not found');
    }

    return { id: workspaceId };
  }
}
