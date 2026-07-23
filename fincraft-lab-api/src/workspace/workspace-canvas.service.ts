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
} from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import type { SaveCanvasSnapshotDto } from './dto/save-canvas-snapshot.dto';
import type {
  CanvasSnapshotResponse,
  JsonObject,
} from './types/canvas-snapshot-response.type';
import {
  MAX_CANVAS_EDGES,
  MAX_CANVAS_EDGE_LABEL_LENGTH,
  MAX_CANVAS_NODES,
  MAX_CANVAS_SNAPSHOT_BYTES,
  MAX_NODE_VALUE_DATA_BYTES,
} from './workspace.constants';

@Injectable()
export class WorkspaceCanvasService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Retrieves the current Canvas graph snapshot for an owned Workspace.
   *
   * Rules:
   * 1. Validates User account and active status.
   * 2. Validates owned Workspace existence.
   * 3. Both ACTIVE and ARCHIVED workspaces are readable.
   * 4. Returns Workspace.updatedAt as workspaceUpdatedAt.
   * 5. Joins current public Element display metadata (does not filter inactive elements).
   * 6. Orders Nodes by id ASC and Edges by id ASC.
   * 7. Zero database writes.
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

    return {
      workspaceId: workspace.id,
      workspaceUpdatedAt: workspace.updatedAt.toISOString(),
      nodes: nodes.map((node) => ({
        id: node.id,
        elementId: node.elementId,
        element: {
          id: node.element.id,
          name: node.element.name,
          slug: node.element.slug,
          emoji: node.element.emoji,
          iconUrl: node.element.iconUrl,
          elementType: node.element.elementType,
          isStarter: node.element.isStarter,
        },
        positionX: node.positionX,
        positionY: node.positionY,
        valueData: (node.valueData as JsonObject) ?? {},
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        sourceNodeId: edge.sourceNodeId,
        targetNodeId: edge.targetNodeId,
        label: edge.label,
      })),
    };
  }

  /**
   * Atomically replaces the entire Canvas graph for an owned ACTIVE Workspace.
   *
   * Pre-transaction checks:
   * 1. Validates User account and active status.
   * 2. Validates aggregate payload size (MAX_CANVAS_SNAPSHOT_BYTES = 512 KB).
   * 3. Validates node/edge counts, DTO structure, valueData limits, and graph integrity.
   *
   * In-transaction sequence:
   * 4. Claims active Workspace and locks updatedAt.
   * 5. Validates Element availability (existence, active status, category status, starter/unlocks).
   * 6. Validates global Node/Edge ID collisions against other workspaces.
   * 7. Deletes existing Edges and Nodes.
   * 8. Creates new Nodes and Edges.
   * 9. Returns committed CanvasSnapshotResponse with updated workspaceUpdatedAt.
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

    // 2. Aggregate Payload Size Check (512 KB domain ceiling)
    const rawPayloadBytes = Buffer.byteLength(JSON.stringify(dto), 'utf8');
    if (rawPayloadBytes > MAX_CANVAS_SNAPSHOT_BYTES) {
      throw new BadRequestException('Canvas snapshot payload is too large');
    }

    // 3. Collection Count Limits
    if (dto.nodes.length > MAX_CANVAS_NODES) {
      throw new BadRequestException(
        `Canvas exceeds maximum node limit (${MAX_CANVAS_NODES})`,
      );
    }

    if (dto.edges.length > MAX_CANVAS_EDGES) {
      throw new BadRequestException(
        `Canvas exceeds maximum edge limit (${MAX_CANVAS_EDGES})`,
      );
    }

    // 4. Pre-transaction Node & ValueData Validation
    const nodeIdsSet = new Set<string>();
    const normalizedNodes = dto.nodes.map((node) => {
      if (nodeIdsSet.has(node.id)) {
        throw new BadRequestException(
          `Duplicate node ID '${node.id}' in snapshot`,
        );
      }
      nodeIdsSet.add(node.id);

      const rawValueData = node.valueData;
      let valueData: Record<string, unknown> = {};

      if (rawValueData !== undefined) {
        if (
          typeof rawValueData !== 'object' ||
          rawValueData === null ||
          Array.isArray(rawValueData)
        ) {
          throw new BadRequestException('valueData must be a plain object');
        }
        valueData = rawValueData;
      }

      const serializedValueData = JSON.stringify(valueData);
      if (
        Buffer.byteLength(serializedValueData, 'utf8') >
        MAX_NODE_VALUE_DATA_BYTES
      ) {
        throw new BadRequestException(
          `valueData exceeds maximum size limit (${MAX_NODE_VALUE_DATA_BYTES} bytes)`,
        );
      }

      return {
        id: node.id,
        elementId: node.elementId,
        positionX: node.positionX,
        positionY: node.positionY,
        valueData: JSON.parse(serializedValueData) as Record<string, unknown>,
      };
    });

    // 5. Pre-transaction Edge & Graph Integrity Validation
    const edgeIdsSet = new Set<string>();
    const edgeTuplesSet = new Set<string>();

    const normalizedEdges = dto.edges.map((edge) => {
      if (edgeIdsSet.has(edge.id)) {
        throw new BadRequestException(
          `Duplicate edge ID '${edge.id}' in snapshot`,
        );
      }
      edgeIdsSet.add(edge.id);

      if (!nodeIdsSet.has(edge.sourceNodeId)) {
        throw new BadRequestException(
          `Source node '${edge.sourceNodeId}' does not exist in canvas snapshot`,
        );
      }

      if (!nodeIdsSet.has(edge.targetNodeId)) {
        throw new BadRequestException(
          `Target node '${edge.targetNodeId}' does not exist in canvas snapshot`,
        );
      }

      if (edge.sourceNodeId === edge.targetNodeId) {
        throw new BadRequestException('Self-connecting edges are not allowed');
      }

      if (typeof edge.label !== 'string') {
        throw new BadRequestException('label must be a string');
      }

      const trimmedLabel = edge.label.trim();
      if (trimmedLabel.length > MAX_CANVAS_EDGE_LABEL_LENGTH) {
        throw new BadRequestException(
          `label exceeds maximum length (${MAX_CANVAS_EDGE_LABEL_LENGTH})`,
        );
      }

      const tupleKey = `${edge.sourceNodeId}:${edge.targetNodeId}:${trimmedLabel}`;
      if (edgeTuplesSet.has(tupleKey)) {
        throw new BadRequestException(
          'Duplicate edge connection in canvas snapshot',
        );
      }
      edgeTuplesSet.add(tupleKey);

      return {
        id: edge.id,
        sourceNodeId: edge.sourceNodeId,
        targetNodeId: edge.targetNodeId,
        label: trimmedLabel,
      };
    });

    // 6. Interactive Database Transaction
    return this.prisma.$transaction(async (tx) => {
      // 6a. Find owned Workspace
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

      // 6b. Atomic Workspace claim & updatedAt mutation
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

      // 6c. Validate Element Availability inside Transaction
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

      // 6d. Check Global Node/Edge ID Collisions Against Other Workspaces
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

      // 6e. Delete Current Graph & Create New Graph
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

      // 6f. Query Updated Workspace Timestamp & Committed Graph
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

      return {
        workspaceId: updatedWorkspace.id,
        workspaceUpdatedAt: updatedWorkspace.updatedAt.toISOString(),
        nodes: committedNodes.map((node) => ({
          id: node.id,
          elementId: node.elementId,
          element: {
            id: node.element.id,
            name: node.element.name,
            slug: node.element.slug,
            emoji: node.element.emoji,
            iconUrl: node.element.iconUrl,
            elementType: node.element.elementType,
            isStarter: node.element.isStarter,
          },
          positionX: node.positionX,
          positionY: node.positionY,
          valueData: (node.valueData as JsonObject) ?? {},
        })),
        edges: committedEdges.map((edge) => ({
          id: edge.id,
          sourceNodeId: edge.sourceNodeId,
          targetNodeId: edge.targetNodeId,
          label: edge.label,
        })),
      };
    });
  }
}
