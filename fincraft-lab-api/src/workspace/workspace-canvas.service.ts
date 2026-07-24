import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserStatus } from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import type { SaveCanvasSnapshotDto } from './dto/save-canvas-snapshot.dto';
import { mapCanvasSnapshotResponse } from './mappers/workspace-canvas.mapper';
import type { CanvasSnapshotResponse } from './types/canvas-snapshot-response.type';
import {
  validateAggregatePayloadSize,
  validateAndNormalizeEdges,
  validateAndNormalizeNodes,
  validateCollectionCountLimits,
} from './validators/workspace-canvas.validator';
import { WorkspaceCanvasWriterService } from './workspace-canvas-writer.service';

@Injectable()
export class WorkspaceCanvasService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(WorkspaceCanvasWriterService)
    private readonly writer: WorkspaceCanvasWriterService,
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

    // 3. Delegate to Transactional Writer
    return this.writer.saveSnapshotTransaction(
      userId,
      workspaceId,
      normalizedNodes,
      normalizedEdges,
      nodeIdsSet,
      edgeIdsSet,
    );
  }
}
