import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ActiveStatus,
  ContentStatus,
  Prisma,
  WorkspaceStatus,
} from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { mapCanvasSnapshotResponse } from './mappers/workspace-canvas.mapper';
import type { CanvasSnapshotResponse } from './types/canvas-snapshot-response.type';
import type {
  NormalizedCanvasEdgeInput,
  NormalizedCanvasNodeInput,
} from './validators/workspace-canvas.validator';

@Injectable()
export class WorkspaceCanvasWriterService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Executes atomic Canvas graph replacement inside interactive transaction.
   */
  async saveSnapshotTransaction(
    userId: string,
    workspaceId: string,
    normalizedNodes: NormalizedCanvasNodeInput[],
    normalizedEdges: NormalizedCanvasEdgeInput[],
    nodeIdsSet: Set<string>,
    edgeIdsSet: Set<string>,
  ): Promise<CanvasSnapshotResponse> {
    return this.prisma.$transaction(async (tx) => {
      await this.claimActiveWorkspace(tx, workspaceId, userId);
      await this.validateAvailableElements(tx, userId, normalizedNodes);
      await this.assertNodeIdentifiersAvailable(tx, workspaceId, nodeIdsSet);
      await this.assertEdgeIdentifiersAvailable(tx, workspaceId, edgeIdsSet);
      await this.replaceGraph(
        tx,
        workspaceId,
        normalizedNodes,
        normalizedEdges,
      );
      return this.loadCommittedSnapshot(tx, workspaceId);
    });
  }

  private async claimActiveWorkspace(
    tx: Prisma.TransactionClient,
    workspaceId: string,
    userId: string,
  ): Promise<void> {
    const workspace = await tx.workspace.findFirst({
      where: { id: workspaceId, userId },
      select: { id: true, status: true },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (workspace.status === WorkspaceStatus.ARCHIVED) {
      throw new ConflictException('Workspace is archived');
    }

    const updateCount = await tx.workspace.updateMany({
      where: { id: workspaceId, userId, status: WorkspaceStatus.ACTIVE },
      data: { updatedAt: new Date() },
    });

    if (updateCount.count === 0) {
      const recheck = await tx.workspace.findFirst({
        where: { id: workspaceId, userId },
        select: { status: true },
      });

      if (!recheck) {
        throw new NotFoundException('Workspace not found');
      }
      if (recheck.status === WorkspaceStatus.ARCHIVED) {
        throw new ConflictException('Workspace is archived');
      }
      throw new NotFoundException('Workspace not found');
    }
  }

  private async validateAvailableElements(
    tx: Prisma.TransactionClient,
    userId: string,
    nodes: NormalizedCanvasNodeInput[],
  ): Promise<void> {
    const requestedElementIds = Array.from(
      new Set(nodes.map((n) => n.elementId)),
    );

    if (requestedElementIds.length === 0) {
      return;
    }

    const elementsInDb = await tx.element.findMany({
      where: { id: { in: requestedElementIds } },
      select: {
        id: true,
        status: true,
        isStarter: true,
        category: {
          select: {
            status: true,
          },
        },
      },
    });

    const foundElementMap = new Map(elementsInDb.map((e) => [e.id, e]));

    for (const elemId of requestedElementIds) {
      const elem = foundElementMap.get(elemId);
      if (!elem) {
        throw new NotFoundException('Element not found');
      }
      if (elem.status !== ContentStatus.ACTIVE) {
        throw new BadRequestException('Element is not active');
      }
      if (elem.category.status !== ActiveStatus.ACTIVE) {
        throw new BadRequestException('Element category is not active');
      }
    }

    const nonStarterIds = requestedElementIds.filter(
      (id) => !foundElementMap.get(id)?.isStarter,
    );

    if (nonStarterIds.length > 0) {
      const unlockedUserElements = await tx.userElement.findMany({
        where: {
          userId,
          elementId: { in: nonStarterIds },
        },
        select: { elementId: true },
      });

      const unlockedSet = new Set(
        unlockedUserElements.map((ue) => ue.elementId),
      );

      for (const nsId of nonStarterIds) {
        if (!unlockedSet.has(nsId)) {
          throw new ForbiddenException('Element is not unlocked by user');
        }
      }
    }
  }

  private async assertNodeIdentifiersAvailable(
    tx: Prisma.TransactionClient,
    workspaceId: string,
    nodeIdsSet: Set<string>,
  ): Promise<void> {
    const requestedNodeIds = Array.from(nodeIdsSet);
    if (requestedNodeIds.length === 0) {
      return;
    }

    const otherNodeCollision = await tx.workspaceNode.findFirst({
      where: {
        id: { in: requestedNodeIds },
        workspaceId: { not: workspaceId },
      },
      select: { id: true },
    });

    if (otherNodeCollision) {
      throw new ConflictException('Canvas identifier conflict');
    }
  }

  private async assertEdgeIdentifiersAvailable(
    tx: Prisma.TransactionClient,
    workspaceId: string,
    edgeIdsSet: Set<string>,
  ): Promise<void> {
    const requestedEdgeIds = Array.from(edgeIdsSet);
    if (requestedEdgeIds.length === 0) {
      return;
    }

    const otherEdgeCollision = await tx.workspaceEdge.findFirst({
      where: {
        id: { in: requestedEdgeIds },
        workspaceId: { not: workspaceId },
      },
      select: { id: true },
    });

    if (otherEdgeCollision) {
      throw new ConflictException('Canvas identifier conflict');
    }
  }

  private async replaceGraph(
    tx: Prisma.TransactionClient,
    workspaceId: string,
    nodes: NormalizedCanvasNodeInput[],
    edges: NormalizedCanvasEdgeInput[],
  ): Promise<void> {
    await tx.workspaceEdge.deleteMany({ where: { workspaceId } });
    await tx.workspaceNode.deleteMany({ where: { workspaceId } });

    if (nodes.length > 0) {
      await tx.workspaceNode.createMany({
        data: nodes.map((n) => ({
          id: n.id,
          workspaceId,
          elementId: n.elementId,
          positionX: n.positionX,
          positionY: n.positionY,
          valueData: n.valueData as Prisma.InputJsonValue,
        })),
      });
    }

    if (edges.length > 0) {
      await tx.workspaceEdge.createMany({
        data: edges.map((e) => ({
          id: e.id,
          workspaceId,
          sourceNodeId: e.sourceNodeId,
          targetNodeId: e.targetNodeId,
          label: e.label,
        })),
      });
    }
  }

  private async loadCommittedSnapshot(
    tx: Prisma.TransactionClient,
    workspaceId: string,
  ): Promise<CanvasSnapshotResponse> {
    const updatedWorkspace = await tx.workspace.findUniqueOrThrow({
      where: { id: workspaceId },
      select: { id: true, updatedAt: true },
    });

    const committedNodes = await tx.workspaceNode.findMany({
      where: { workspaceId },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        elementId: true,
        positionX: true,
        positionY: true,
        valueData: true,
        element: {
          select: {
            id: true,
            name: true,
            slug: true,
            emoji: true,
            iconUrl: true,
            elementType: true,
            isStarter: true,
          },
        },
      },
    });

    const committedEdges = await tx.workspaceEdge.findMany({
      where: { workspaceId },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        sourceNodeId: true,
        targetNodeId: true,
        label: true,
      },
    });

    return mapCanvasSnapshotResponse(
      updatedWorkspace.id,
      updatedWorkspace.updatedAt,
      committedNodes,
      committedEdges,
    );
  }
}
