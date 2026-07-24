import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ActiveStatus,
  ContentStatus,
  Prisma,
  UserStatus,
  WorkspaceStatus,
} from '../../database/generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import type { SaveCanvasSnapshotDto } from '../dto/save-canvas-snapshot.dto';
import { mapCanvasSnapshotResponse } from '../mappers/workspace-canvas.mapper';
import type { CanvasSnapshotResponse } from '../types/canvas-snapshot-response.type';
import {
  validateAggregatePayloadSize,
  validateAndNormalizeEdges,
  validateAndNormalizeNodes,
  validateCollectionCountLimits,
} from '../validators/workspace-canvas.validator';

@Injectable()
export class WorkspaceCanvasService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Retrieves current Canvas graph snapshot for an owned Workspace.
   */
  async getSnapshot(
    userId: string,
    workspaceId: string,
  ): Promise<CanvasSnapshotResponse> {
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

    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, userId },
      select: { id: true, updatedAt: true },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const nodes = await this.prisma.workspaceNode.findMany({
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

    const edges = await this.prisma.workspaceEdge.findMany({
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
      workspace.id,
      workspace.updatedAt,
      nodes,
      edges,
    );
  }

  /**
   * Atomically replaces entire Canvas graph for an owned ACTIVE Workspace inside transaction.
   */
  async saveSnapshot(
    userId: string,
    workspaceId: string,
    dto: SaveCanvasSnapshotDto,
  ): Promise<CanvasSnapshotResponse> {
    // 1. User Lookup & Status Check
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

    // 2. Pre-transaction Payload & Structure Validation
    validateAggregatePayloadSize(dto);
    validateCollectionCountLimits(dto.nodes.length, dto.edges.length);
    const { normalizedNodes, nodeIdsSet } = validateAndNormalizeNodes(
      dto.nodes,
    );
    const { normalizedEdges, edgeIdsSet } = validateAndNormalizeEdges(
      dto.edges,
      nodeIdsSet,
    );

    // 3. Interactive Database Transaction
    return this.prisma.$transaction(async (tx) => {
      // 3a. Find owned Workspace
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

      // 3b. Atomic Workspace claim & updatedAt mutation
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

      // 3c. Validate Element Availability inside Transaction
      const requestedElementIds = Array.from(
        new Set(normalizedNodes.map((n) => n.elementId)),
      );

      if (requestedElementIds.length > 0) {
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

      // 3d. Check Global Node/Edge ID Collisions Against Other Workspaces
      const requestedNodeIds = Array.from(nodeIdsSet);
      if (requestedNodeIds.length > 0) {
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

      const requestedEdgeIds = Array.from(edgeIdsSet);
      if (requestedEdgeIds.length > 0) {
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

      // 3e. Delete Current Graph & Create New Graph
      await tx.workspaceEdge.deleteMany({ where: { workspaceId } });
      await tx.workspaceNode.deleteMany({ where: { workspaceId } });

      if (normalizedNodes.length > 0) {
        await tx.workspaceNode.createMany({
          data: normalizedNodes.map((n) => ({
            id: n.id,
            workspaceId,
            elementId: n.elementId,
            positionX: n.positionX,
            positionY: n.positionY,
            valueData: n.valueData as Prisma.InputJsonValue,
          })),
        });
      }

      if (normalizedEdges.length > 0) {
        await tx.workspaceEdge.createMany({
          data: normalizedEdges.map((e) => ({
            id: e.id,
            workspaceId,
            sourceNodeId: e.sourceNodeId,
            targetNodeId: e.targetNodeId,
            label: e.label,
          })),
        });
      }

      // 3f. Query Updated Workspace Timestamp & Committed Graph
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
    });
  }
}
