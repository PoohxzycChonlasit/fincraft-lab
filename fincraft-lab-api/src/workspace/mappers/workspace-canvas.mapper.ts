import type { ElementType } from '../../database/generated/prisma/client';
import { parseCraftSources } from '../../craft/parsers/craft-sources.parser';
import type {
  CanvasSnapshotResponse,
  JsonObject,
  JsonValue,
} from '../types/canvas-snapshot-response.type';

export interface RawDbWorkspaceNode {
  id: string;
  elementId: string;
  positionX: number;
  positionY: number;
  valueData: unknown;
  element: {
    id: string;
    name: string;
    slug: string;
    emoji: string;
    iconUrl: string | null;
    elementType: ElementType;
    isStarter: boolean;
    discoveryDetail?: {
      shortDescription: string;
      realLesson: string;
      example: string | null;
      possibleBenefit: string | null;
      possibleTradeoff: string | null;
      hiddenRisk: string | null;
      worksWhen: string | null;
      becomesDifficultWhen: string | null;
      sources: unknown;
    } | null;
  };
}

export interface RawDbWorkspaceEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label: string;
}

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value))
    return true;
  if (Array.isArray(value)) return value.every(isJsonValue);
  return isJsonObject(value);
}

function isJsonObject(value: unknown): value is JsonObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(isJsonValue)
  );
}

/**
 * Maps raw database workspace nodes and edges into the public CanvasSnapshotResponse shape.
 */
export function mapCanvasSnapshotResponse(
  workspaceId: string,
  workspaceUpdatedAt: Date,
  nodes: RawDbWorkspaceNode[],
  edges: RawDbWorkspaceEdge[],
  rawSnapshotJson?: unknown,
): CanvasSnapshotResponse {
  let lastDiscoveryObj: JsonObject | null = null;

  const discoveryNode = [...nodes]
    .reverse()
    .find((n) => !n.element.isStarter && n.element.discoveryDetail != null);

  if (discoveryNode && discoveryNode.element.discoveryDetail) {
    const detail = discoveryNode.element.discoveryDetail;
    let parsedSources: JsonValue[] = [];
    try {
      parsedSources = parseCraftSources(detail.sources).map((source) => ({
        title: source.title,
        organization: source.organization,
        url: source.url,
        ...(source.jurisdiction ? { jurisdiction: source.jurisdiction } : {}),
        ...(source.sourceType ? { sourceType: source.sourceType } : {}),
      }));
    } catch {
      parsedSources = [];
    }

    lastDiscoveryObj = {
      outcome: 'DISCOVERY',
      isNewDiscovery: false,
      element: {
        id: discoveryNode.element.id,
        name: discoveryNode.element.name,
        slug: discoveryNode.element.slug,
        emoji: discoveryNode.element.emoji,
        iconUrl: discoveryNode.element.iconUrl,
        elementType: discoveryNode.element.elementType,
        isStarter: discoveryNode.element.isStarter,
      },
      detail: {
        shortDescription: detail.shortDescription,
        realLesson: detail.realLesson,
        ...(detail.example ? { example: detail.example } : {}),
        ...(detail.possibleBenefit
          ? { possibleBenefit: detail.possibleBenefit }
          : {}),
        ...(detail.possibleTradeoff
          ? { possibleTradeoff: detail.possibleTradeoff }
          : {}),
        ...(detail.hiddenRisk ? { hiddenRisk: detail.hiddenRisk } : {}),
        ...(detail.worksWhen ? { worksWhen: detail.worksWhen } : {}),
        ...(detail.becomesDifficultWhen
          ? { becomesDifficultWhen: detail.becomesDifficultWhen }
          : {}),
        sources: parsedSources,
      },
    };
  }

  if (
    !lastDiscoveryObj &&
    isJsonObject(rawSnapshotJson) &&
    isJsonObject(rawSnapshotJson.lastDiscovery)
  ) {
    lastDiscoveryObj = rawSnapshotJson.lastDiscovery;
  }

  return {
    workspaceId,
    workspaceUpdatedAt: workspaceUpdatedAt.toISOString(),
    nodes: nodes.map((n) => {
      const rawValData = n.valueData;
      let valDataObj: JsonObject = {};

      if (isJsonObject(rawValData)) valDataObj = rawValData;

      return {
        id: n.id,
        workspaceId,
        elementId: n.elementId,
        positionX: n.positionX,
        positionY: n.positionY,
        valueData: valDataObj,
        element: {
          id: n.element.id,
          name: n.element.name,
          slug: n.element.slug,
          emoji: n.element.emoji,
          iconUrl: n.element.iconUrl,
          elementType: n.element.elementType,
          isStarter: n.element.isStarter,
        },
      };
    }),
    edges: edges.map((e) => ({
      id: e.id,
      workspaceId,
      sourceNodeId: e.sourceNodeId,
      targetNodeId: e.targetNodeId,
      label: e.label,
    })),
    ...(lastDiscoveryObj ? { lastDiscovery: lastDiscoveryObj } : {}),
  };
}
