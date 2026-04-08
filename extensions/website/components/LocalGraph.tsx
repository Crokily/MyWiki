"use client";

import Graph from "graphology";
import { useLoadGraph, useRegisterEvents, useSigma } from "@react-sigma/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { GraphData, GraphNode } from "@/lib/graph";
import { resolveGraphPosition } from "@/lib/graph-position";
import { SigmaStage } from "@/components/SigmaStage";

interface LocalGraphProps {
  data: GraphData;
}

interface SigmaEdgeAttributes {
  color: string;
  size: number;
}

interface GraphSceneProps {
  data: GraphData;
  hoveredNode: string | null;
  setHoveredNode: (node: string | null) => void;
}

const DIRECTORY_COLORS = {
  pages: "#5d7052",
  sources: "#c18c5d",
  maps: "#5a7fa0",
  queries: "#8b6ba0",
} as const;

const EDGE_COLOR = "rgba(100, 100, 90, 0.30)";
const HIGHLIGHT_EDGE_COLOR = "rgba(100, 100, 90, 0.50)";
const DIMMED_EDGE_COLOR = "rgba(100, 100, 90, 0.10)";
const FOREGROUND_COLOR = "#2c2c24";
const LOCAL_GRAPH_SETTINGS = {
  autoCenter: true,
  autoRescale: true,
  defaultEdgeColor: EDGE_COLOR,
  defaultNodeColor: DIRECTORY_COLORS.pages,
  enableCameraPanning: false,
  enableCameraRotation: false,
  enableCameraZooming: false,
  enableEdgeEvents: false,
  hideEdgesOnMove: false,
  hideLabelsOnMove: false,
  labelColor: { color: FOREGROUND_COLOR },
  labelFont: "serif",
  labelRenderedSizeThreshold: 6,
  labelSize: 12,
  labelWeight: "500",
  maxCameraRatio: 1,
  minCameraRatio: 1,
  renderEdgeLabels: false,
  renderLabels: true,
  stagePadding: 20,
  zIndex: true,
} as const;

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const safeHex = normalized.length === 3 ? normalized.split("").map((char) => `${char}${char}`).join("") : normalized;

  const red = Number.parseInt(safeHex.slice(0, 2), 16);
  const green = Number.parseInt(safeHex.slice(2, 4), 16);
  const blue = Number.parseInt(safeHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function createSigmaGraph(data: GraphData) {
  const graph = new Graph<GraphNode, SigmaEdgeAttributes>({ type: "undirected" });

  data.nodes.forEach((node, index) => {
    graph.addNode(node.slug, {
      ...node,
      ...resolveGraphPosition(node.x, node.y, index, data.nodes.length),
      color: DIRECTORY_COLORS[node.directory],
      size: node.isCenter ? 11 : 5.5,
    });
  });

  for (const edge of data.edges) {
    if (!graph.hasNode(edge.source) || !graph.hasNode(edge.target) || graph.hasEdge(edge.source, edge.target)) {
      continue;
    }

    graph.addEdge(edge.source, edge.target, {
      color: EDGE_COLOR,
      size: 0.7,
    });
  }

  return graph;
}

function GraphScene({ data, hoveredNode, setHoveredNode }: GraphSceneProps) {
  const loadGraph = useLoadGraph<GraphNode, SigmaEdgeAttributes>();
  const registerEvents = useRegisterEvents<GraphNode, SigmaEdgeAttributes>();
  const sigma = useSigma<GraphNode, SigmaEdgeAttributes>();
  const router = useRouter();

  const sigmaGraph = useMemo(() => createSigmaGraph(data), [data]);
  const nodeLookup = useMemo(() => new Map(data.nodes.map((node) => [node.slug, node] as const)), [data.nodes]);

  useEffect(() => {
    loadGraph(sigmaGraph);
  }, [loadGraph, sigmaGraph]);

  useEffect(() => {
    const container = sigma.getContainer();
    container.style.cursor = "default";

    return () => {
      container.style.cursor = "";
    };
  }, [sigma]);

  useEffect(() => {
    registerEvents({
      enterNode: ({ node }) => {
        setHoveredNode(node);
        sigma.getContainer().style.cursor = "pointer";
      },
      leaveNode: () => {
        setHoveredNode(null);
        sigma.getContainer().style.cursor = "default";
      },
      clickNode: ({ node, preventSigmaDefault }) => {
        preventSigmaDefault();

        const target = nodeLookup.get(node);

        if (target) {
          router.push(target.href);
        }
      },
      leaveStage: () => {
        setHoveredNode(null);
        sigma.getContainer().style.cursor = "default";
      },
    });
  }, [nodeLookup, registerEvents, router, setHoveredNode, sigma]);

  useEffect(() => {
    const graph = sigma.getGraph();
    const neighborSet = new Set<string>();

    if (hoveredNode && graph.hasNode(hoveredNode)) {
      for (const neighbor of graph.neighbors(hoveredNode)) {
        neighborSet.add(neighbor);
      }
    }

    sigma.setSetting("nodeReducer", (node, attributes) => {
      const isCenter = attributes.isCenter === true;

      if (!hoveredNode) {
        return {
          ...attributes,
          hidden: false,
          forceLabel: isCenter,
          highlighted: isCenter,
          zIndex: isCenter ? 2 : 0,
        };
      }

      if (node === hoveredNode) {
        return {
          ...attributes,
          hidden: false,
          color: attributes.color,
          size: attributes.size + 1.8,
          forceLabel: true,
          highlighted: true,
          zIndex: 3,
        };
      }

      if (isCenter) {
        return {
          ...attributes,
          hidden: false,
          color: neighborSet.has(node) ? attributes.color : hexToRgba(attributes.color, 0.95),
          forceLabel: true,
          highlighted: true,
          zIndex: 2,
        };
      }

      if (neighborSet.has(node)) {
        return {
          ...attributes,
          hidden: false,
          color: attributes.color,
          highlighted: true,
          zIndex: 1,
        };
      }

      return {
        ...attributes,
        hidden: false,
        color: hexToRgba(attributes.color, 0.18),
        label: null,
        highlighted: false,
        zIndex: 0,
      };
    });

    sigma.setSetting("edgeReducer", (edge, attributes) => {
      if (!hoveredNode) {
        return {
          ...attributes,
          hidden: false,
          color: attributes.color,
          size: attributes.size,
        };
      }

      const [source, target] = graph.extremities(edge);
      const isConnected = source === hoveredNode || target === hoveredNode;

      if (isConnected) {
        return {
          ...attributes,
          hidden: false,
          color: HIGHLIGHT_EDGE_COLOR,
          size: 1.2,
          zIndex: 1,
        };
      }

      return {
        ...attributes,
        hidden: false,
        color: DIMMED_EDGE_COLOR,
        size: 0.7,
      };
    });

    // SigmaContainer tears down the renderer on unmount, so cleanup must not
    // touch the instance again or React/Next strict re-mounts will crash it.
    sigma.refresh();
  }, [hoveredNode, sigma]);

  return null;
}

export function LocalGraph({ data }: LocalGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodeLookup = useMemo(() => new Map(data.nodes.map((node) => [node.slug, node] as const)), [data.nodes]);
  const centerNode = useMemo(() => data.nodes.find((node) => node.isCenter) ?? data.nodes[0] ?? null, [data.nodes]);

  useEffect(() => {
    setHoveredNode(null);
  }, [data]);

  if (data.nodes.length === 0) {
    return null;
  }

  const activeLabel = hoveredNode ? nodeLookup.get(hoveredNode)?.label ?? null : centerNode?.label ?? null;

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-card)]">
        <div className="h-[200px] w-full">
          <SigmaStage
            containerClassName="h-full w-full"
            settings={LOCAL_GRAPH_SETTINGS}
            sigmaClassName="local-graph-sigma"
          >
            <GraphScene data={data} hoveredNode={hoveredNode} setHoveredNode={setHoveredNode} />
          </SigmaStage>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[0.72rem] text-[color:var(--muted)]">
        <span className="truncate">{activeLabel ?? "Immediate neighbors"}</span>
        <Link href="/graph/" className="shrink-0 transition hover:text-[color:var(--accent-strong)]">
          {Math.max(0, data.nodes.length - 1)} links &rarr;
        </Link>
      </div>

      <style jsx global>{`
        .local-graph-sigma {
          position: relative;
          height: 100%;
          width: 100%;
          background: transparent;
        }

        .local-graph-sigma .sigma-container {
          height: 100%;
          width: 100%;
          background: transparent;
        }

        .local-graph-sigma canvas {
          background: transparent;
        }

        .local-graph-sigma .sigma-mouse {
          cursor: inherit;
        }
      `}</style>
    </>
  );
}
