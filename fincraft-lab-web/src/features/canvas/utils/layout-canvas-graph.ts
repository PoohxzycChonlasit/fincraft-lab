import type { Edge } from "@xyflow/react";
import type { ElementCanvasNode } from "../types/canvas-node.type";

const COLUMN_GAP = 320;
const ROW_GAP = 150;
const COMPONENT_ROW_GAP = 1;
const DISCONNECTED_COLUMN_COUNT = 3;
const START_X = 80;
const START_Y = 80;

type AdjacencyMap = Map<string, Set<string>>;
type GraphMaps = { incoming: AdjacencyMap; outgoing: AdjacencyMap; undirected: AdjacencyMap };
type Position = { x: number; y: number };

function compareText(left: string, right: string): number {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

function compareNodes(left: ElementCanvasNode, right: ElementCanvasNode): number {
  return compareText(left.data.name.toLocaleLowerCase(), right.data.name.toLocaleLowerCase())
    || compareText(left.id, right.id);
}

function sortedIds(ids: Iterable<string>): string[] {
  return Array.from(ids).sort(compareText);
}

function buildGraphMaps(nodes: ElementCanvasNode[], edges: Edge[]): GraphMaps {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const incoming: AdjacencyMap = new Map();
  const outgoing: AdjacencyMap = new Map();
  const undirected: AdjacencyMap = new Map();

  for (const node of nodes) {
    incoming.set(node.id, new Set());
    outgoing.set(node.id, new Set());
    undirected.set(node.id, new Set());
  }

  for (const edge of edges) {
    if (!edge?.source || !edge.target || !nodeIds.has(edge.source) || !nodeIds.has(edge.target)) continue;
    outgoing.get(edge.source)?.add(edge.target);
    incoming.get(edge.target)?.add(edge.source);
    undirected.get(edge.source)?.add(edge.target);
    undirected.get(edge.target)?.add(edge.source);
  }

  return { incoming, outgoing, undirected };
}

function calculateTopologicalDepths(nodes: ElementCanvasNode[], incoming: AdjacencyMap, outgoing: AdjacencyMap) {
  const remainingIncoming = new Map(nodes.map((node) => [node.id, incoming.get(node.id)?.size ?? 0]));
  const depths = new Map(nodes.map((node) => [node.id, 0]));
  const queue = nodes.filter((node) => remainingIncoming.get(node.id) === 0).sort(compareNodes);
  const processed = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || processed.has(current.id)) continue;
    processed.add(current.id);

    for (const childId of sortedIds(outgoing.get(current.id) ?? [])) {
      depths.set(childId, Math.max(depths.get(childId) ?? 0, (depths.get(current.id) ?? 0) + 1));
      const nextIncoming = (remainingIncoming.get(childId) ?? 0) - 1;
      remainingIncoming.set(childId, nextIncoming);
      if (nextIncoming === 0) {
        const child = nodes.find((node) => node.id === childId);
        if (child) queue.push(child);
        queue.sort(compareNodes);
      }
    }
  }

  return { depths, unresolved: new Set(nodes.filter((node) => !processed.has(node.id)).map((node) => node.id)) };
}

function buildComponentOrder(nodes: ElementCanvasNode[], undirected: AdjacencyMap) {
  const unvisited = new Set(nodes.map((node) => node.id));
  const components: string[][] = [];

  while (unvisited.size > 0) {
    const seed = sortedIds(unvisited)[0];
    const component: string[] = [];
    const queue = [seed];
    unvisited.delete(seed);

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;
      component.push(current);
      for (const neighbor of sortedIds(undirected.get(current) ?? [])) {
        if (!unvisited.has(neighbor)) continue;
        unvisited.delete(neighbor);
        queue.push(neighbor);
      }
    }
    components.push(component);
  }

  components.sort((left, right) => compareText(left.slice().sort(compareText)[0], right.slice().sort(compareText)[0]));
  return new Map(components.flatMap((component, index) => component.map((nodeId) => [nodeId, index] as const)));
}

function neighborAverage(nodeId: string, neighbors: AdjacencyMap, positions: Map<string, number>): number | null {
  const indexes = sortedIds(neighbors.get(nodeId) ?? [])
    .map((neighborId) => positions.get(neighborId))
    .filter((index): index is number => index !== undefined);
  if (indexes.length === 0) return null;
  return indexes.reduce((sum, index) => sum + index, 0) / indexes.length;
}

function orderLayer(nodes: ElementCanvasNode[], neighborMap: AdjacencyMap, positions: Map<string, number>, componentOrder: Map<string, number>): ElementCanvasNode[] {
  return nodes.slice().sort((left, right) => {
    const componentCompare = (componentOrder.get(left.id) ?? 0) - (componentOrder.get(right.id) ?? 0);
    if (componentCompare !== 0) return componentCompare;
    const leftAverage = neighborAverage(left.id, neighborMap, positions);
    const rightAverage = neighborAverage(right.id, neighborMap, positions);
    if (leftAverage !== null && rightAverage !== null && leftAverage !== rightAverage) return leftAverage - rightAverage;
    if (leftAverage !== null && rightAverage === null) return -1;
    if (leftAverage === null && rightAverage !== null) return 1;
    return compareNodes(left, right);
  });
}

function orderLayers(layers: Map<number, ElementCanvasNode[]>, maxDepth: number, incoming: AdjacencyMap, outgoing: AdjacencyMap, componentOrder: Map<string, number>) {
  for (const [depth, layer] of layers) layers.set(depth, layer.slice().sort((left, right) => (componentOrder.get(left.id) ?? 0) - (componentOrder.get(right.id) ?? 0) || compareNodes(left, right)));

  for (let pass = 0; pass < 2; pass += 1) {
    for (let depth = 1; depth <= maxDepth; depth += 1) {
      const positions = new Map((layers.get(depth - 1) ?? []).map((node, index) => [node.id, index] as const));
      layers.set(depth, orderLayer(layers.get(depth) ?? [], incoming, positions, componentOrder));
    }
    for (let depth = maxDepth - 1; depth >= 0; depth -= 1) {
      const positions = new Map((layers.get(depth + 1) ?? []).map((node, index) => [node.id, index] as const));
      layers.set(depth, orderLayer(layers.get(depth) ?? [], outgoing, positions, componentOrder));
    }
  }
}

function placeLayer(layer: ElementCanvasNode[], depth: number, componentOrder: Map<string, number>, positions: Map<string, Position>): number {
  let row = 0;
  let previousComponent: number | null = null;
  for (const node of layer) {
    const component = componentOrder.get(node.id) ?? 0;
    if (previousComponent !== null && component !== previousComponent) row += COMPONENT_ROW_GAP;
    positions.set(node.id, { x: START_X + depth * COLUMN_GAP, y: START_Y + row * ROW_GAP });
    previousComponent = component;
    row += 1;
  }
  return row;
}

function placeDisconnectedNodes(nodes: ElementCanvasNode[], connectedRows: number, positions: Map<string, Position>) {
  for (const [index, node] of nodes.slice().sort(compareNodes).entries()) {
    const column = index % DISCONNECTED_COLUMN_COUNT;
    const row = connectedRows + COMPONENT_ROW_GAP + Math.floor(index / DISCONNECTED_COLUMN_COUNT);
    positions.set(node.id, { x: START_X + column * COLUMN_GAP, y: START_Y + row * ROW_GAP });
  }
}

export function layoutCanvasGraph(nodes: ElementCanvasNode[], edges: Edge[]): ElementCanvasNode[] {
  if (nodes.length === 0) return [];

  const { incoming, outgoing, undirected } = buildGraphMaps(nodes, edges);
  const { depths, unresolved } = calculateTopologicalDepths(nodes, incoming, outgoing);
  const connectedNodes = nodes.filter((node) => (incoming.get(node.id)?.size ?? 0) > 0 || (outgoing.get(node.id)?.size ?? 0) > 0);
  const disconnectedNodes = nodes.filter((node) => !connectedNodes.includes(node));
  const componentOrder = buildComponentOrder(nodes, undirected);
  const maxKnownDepth = connectedNodes.reduce((max, node) => Math.max(max, depths.get(node.id) ?? 0), 0);
  const fallbackDepth = unresolved.size > 0 ? maxKnownDepth + 1 : maxKnownDepth;
  const layers = new Map<number, ElementCanvasNode[]>();

  for (const node of connectedNodes) {
    const depth = unresolved.has(node.id) ? fallbackDepth : (depths.get(node.id) ?? 0);
    const layer = layers.get(depth) ?? [];
    layer.push(node);
    layers.set(depth, layer);
  }

  const maxDepth = Math.max(0, ...layers.keys());
  orderLayers(layers, maxDepth, incoming, outgoing, componentOrder);

  const positions = new Map<string, Position>();
  let connectedRows = placeLayer(layers.get(0) ?? [], 0, componentOrder, positions);
  for (const [depth, layer] of layers) {
    if (depth === 0) continue;
    connectedRows = Math.max(connectedRows, placeLayer(layer, depth, componentOrder, positions));
  }
  placeDisconnectedNodes(disconnectedNodes, connectedRows, positions);

  return nodes.map((node) => {
    const position = positions.get(node.id);
    return position ? { ...node, position } : node;
  });
}
