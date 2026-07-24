import { BadRequestException } from '@nestjs/common';
import {
  MAX_CANVAS_EDGES,
  MAX_CANVAS_EDGE_LABEL_LENGTH,
  MAX_CANVAS_NODES,
  MAX_CANVAS_SNAPSHOT_BYTES,
  MAX_NODE_VALUE_DATA_BYTES,
} from '../constants/workspace.constants';
import type { SaveCanvasSnapshotDto } from '../dto/save-canvas-snapshot.dto';
import type { WorkspaceEdgeInputDto } from '../dto/workspace-edge-input.dto';
import type { WorkspaceNodeInputDto } from '../dto/workspace-node-input.dto';

export interface NormalizedCanvasNodeInput {
  id: string;
  elementId: string;
  positionX: number;
  positionY: number;
  valueData: Record<string, unknown>;
}

export interface NormalizedCanvasEdgeInput {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label: string;
}

/**
 * Validates total aggregate byte size of Canvas snapshot payload.
 */
export function validateAggregatePayloadSize(dto: SaveCanvasSnapshotDto): void {
  const rawPayloadBytes = Buffer.byteLength(JSON.stringify(dto), 'utf8');
  if (rawPayloadBytes > MAX_CANVAS_SNAPSHOT_BYTES) {
    throw new BadRequestException('Canvas snapshot payload is too large');
  }
}

/**
 * Validates maximum node and edge collection count limits.
 */
export function validateCollectionCountLimits(
  nodesCount: number,
  edgesCount: number,
): void {
  if (nodesCount > MAX_CANVAS_NODES) {
    throw new BadRequestException(
      `Canvas exceeds maximum node limit (${MAX_CANVAS_NODES})`,
    );
  }

  if (edgesCount > MAX_CANVAS_EDGES) {
    throw new BadRequestException(
      `Canvas exceeds maximum edge limit (${MAX_CANVAS_EDGES})`,
    );
  }
}

/**
 * Validates individual nodes, valueData limits, plain object structure, and duplicate node IDs.
 */
export function validateAndNormalizeNodes(nodes: WorkspaceNodeInputDto[]): {
  normalizedNodes: NormalizedCanvasNodeInput[];
  nodeIdsSet: Set<string>;
} {
  const nodeIdsSet = new Set<string>();
  const normalizedNodes = nodes.map((node) => {
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
      Buffer.byteLength(serializedValueData, 'utf8') > MAX_NODE_VALUE_DATA_BYTES
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

  return { normalizedNodes, nodeIdsSet };
}

/**
 * Validates individual edges, dangling nodes, self-edges, label length, and duplicate directed tuples.
 */
export function validateAndNormalizeEdges(
  edges: WorkspaceEdgeInputDto[],
  nodeIdsSet: Set<string>,
): {
  normalizedEdges: NormalizedCanvasEdgeInput[];
  edgeIdsSet: Set<string>;
} {
  const edgeIdsSet = new Set<string>();
  const edgeTuplesSet = new Set<string>();

  const normalizedEdges = edges.map((edge) => {
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

  return { normalizedEdges, edgeIdsSet };
}
