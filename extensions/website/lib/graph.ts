import Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";

import { getAllPages, type ContentDirectory, type WikiEntry } from "@/lib/content";

const DIRECTORY_COLORS: Record<ContentDirectory, string> = {
  pages: "#5d7052",
  sources: "#c18c5d",
  maps: "#5a7fa0",
  queries: "#8b6ba0",
};

type GraphEdgeAttributes = Record<string, never>;
type WikiGraph = Graph<GraphNode, GraphEdgeAttributes>;

interface GraphState {
  graph: WikiGraph;
  data: GraphData;
}

export interface GraphNode {
  slug: string;
  label: string;
  directory: ContentDirectory;
  classification: string;
  tags: string[];
  href: string;
  size: number;
  color: string;
  x: number;
  y: number;
  isCenter?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphStats {
  nodeCount: number;
  edgeCount: number;
  avgDegree: number;
  components: number;
}

let cachedGraphState: GraphState | null = null;

function createNode(entry: WikiEntry): GraphNode {
  return {
    slug: entry.slug,
    label: entry.title,
    directory: entry.directory,
    classification: entry.classification,
    tags: [...entry.tags],
    href: entry.href,
    size: 5,
    color: DIRECTORY_COLORS[entry.directory],
    x: Math.random() * 100,
    y: Math.random() * 100,
  };
}

function cloneNode(node: GraphNode): GraphNode {
  return {
    ...node,
    tags: [...node.tags],
  };
}

function cloneGraphData(data: GraphData): GraphData {
  return {
    nodes: data.nodes.map(cloneNode),
    edges: data.edges.map((edge) => ({ ...edge })),
  };
}

function countComponents(graph: WikiGraph) {
  const remaining = new Set(graph.nodes());
  let components = 0;

  while (remaining.size > 0) {
    const [start] = remaining;

    if (!start) {
      break;
    }

    components += 1;
    remaining.delete(start);

    const stack = [start];

    while (stack.length > 0) {
      const node = stack.pop();

      if (!node) {
        continue;
      }

      for (const neighbor of graph.neighbors(node)) {
        if (!remaining.has(neighbor)) {
          continue;
        }

        remaining.delete(neighbor);
        stack.push(neighbor);
      }
    }
  }

  return components;
}

function buildGraphState(): GraphState {
  const entries = getAllPages();
  const graph = new Graph<GraphNode, GraphEdgeAttributes>({ type: "undirected" });
  const nodeSlugs = new Set(entries.map((entry) => entry.slug));

  for (const entry of entries) {
    graph.addNode(entry.slug, createNode(entry));
  }

  for (const entry of entries) {
    for (const targetSlug of entry.links) {
      if (targetSlug === entry.slug || !nodeSlugs.has(targetSlug) || graph.hasUndirectedEdge(entry.slug, targetSlug)) {
        continue;
      }

      graph.addEdge(entry.slug, targetSlug);
    }
  }

  graph.forEachNode((slug) => {
    const size = Math.min(20, 5 + graph.degree(slug) * 2);
    graph.setNodeAttribute(slug, "size", size);
  });

  if (graph.order > 0) {
    forceAtlas2.assign(graph, {
      iterations: 50,
      settings: forceAtlas2.inferSettings(graph),
    });
  }

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  graph.forEachNode((_slug, attributes) => {
    nodes.push(cloneNode(attributes));
  });

  graph.forEachEdge((_edge, _attributes, source, target) => {
    edges.push({ source, target });
  });

  return {
    graph,
    data: {
      nodes,
      edges,
    },
  };
}

function getGraphState() {
  if (!cachedGraphState) {
    cachedGraphState = buildGraphState();
  }

  return cachedGraphState;
}

export function getGraphData(): GraphData {
  return cloneGraphData(getGraphState().data);
}

export function getLocalGraph(slug: string, depth = 1): GraphData {
  const { graph, data } = getGraphState();

  if (!graph.hasNode(slug)) {
    return {
      nodes: [],
      edges: [],
    };
  }

  const maxDepth = Number.isFinite(depth) ? Math.max(0, Math.floor(depth)) : 1;
  const included = new Set<string>([slug]);
  let frontier = new Set<string>([slug]);

  for (let level = 0; level < maxDepth; level += 1) {
    const nextFrontier = new Set<string>();

    for (const node of frontier) {
      for (const neighbor of graph.neighbors(node)) {
        if (included.has(neighbor)) {
          continue;
        }

        included.add(neighbor);
        nextFrontier.add(neighbor);
      }
    }

    if (nextFrontier.size === 0) {
      break;
    }

    frontier = nextFrontier;
  }

  return {
    nodes: data.nodes
      .filter((node) => included.has(node.slug))
      .map((node) => ({
        ...cloneNode(node),
        ...(node.slug === slug ? { isCenter: true } : {}),
      })),
    edges: data.edges
      .filter((edge) => included.has(edge.source) && included.has(edge.target))
      .map((edge) => ({ ...edge })),
  };
}

export function getGraphStats(): GraphStats {
  const { graph } = getGraphState();

  return {
    nodeCount: graph.order,
    edgeCount: graph.size,
    avgDegree: graph.order === 0 ? 0 : (graph.size * 2) / graph.order,
    components: countComponents(graph),
  };
}
