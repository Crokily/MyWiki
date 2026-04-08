"use client";

import Graph from "graphology";
import { useLoadGraph, useRegisterEvents, useSigma } from "@react-sigma/core";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { GraphData, GraphNode } from "@/lib/graph";
import { resolveGraphPosition } from "@/lib/graph-position";
import { SigmaStage } from "@/components/SigmaStage";

interface MiniGraphProps {
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

const EDGE_COLOR = "rgba(120, 120, 108, 0.12)";
const HIGHLIGHT_EDGE_COLOR = "rgba(120, 120, 108, 0.24)";
const DIMMED_EDGE_COLOR = "rgba(120, 120, 108, 0.05)";
const FOREGROUND_COLOR = "#2c2c24";

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
      size: Math.max(2.8, Math.min(8, 1.4 + node.size * 0.28)),
    });
  });

  for (const edge of data.edges) {
    if (!graph.hasNode(edge.source) || !graph.hasNode(edge.target) || graph.hasEdge(edge.source, edge.target)) {
      continue;
    }

    graph.addEdge(edge.source, edge.target, {
      color: EDGE_COLOR,
      size: 0.6,
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
    container.style.cursor = "pointer";

    return () => {
      container.style.cursor = "";
    };
  }, [sigma]);

  useEffect(() => {
    registerEvents({
      enterNode: ({ node }) => {
        setHoveredNode(node);
      },
      leaveNode: () => {
        setHoveredNode(null);
      },
      clickNode: ({ node, preventSigmaDefault }) => {
        preventSigmaDefault();

        const target = nodeLookup.get(node);

        if (target) {
          router.push(target.href);
        }
      },
      clickStage: () => {
        router.push("/graph/");
      },
      leaveStage: () => {
        setHoveredNode(null);
      },
    });
  }, [nodeLookup, registerEvents, router, setHoveredNode]);

  useEffect(() => {
    const graph = sigma.getGraph();
    const neighborSet = new Set<string>();

    if (hoveredNode && graph.hasNode(hoveredNode)) {
      for (const neighbor of graph.neighbors(hoveredNode)) {
        neighborSet.add(neighbor);
      }
    }

    sigma.setSetting("nodeReducer", (node, attributes) => {
      if (!hoveredNode) {
        return {
          ...attributes,
          hidden: false,
          label: null,
        };
      }

      if (node === hoveredNode) {
        return {
          ...attributes,
          hidden: false,
          color: attributes.color,
          size: attributes.size + 1.3,
          forceLabel: true,
          zIndex: 2,
        };
      }

      if (neighborSet.has(node)) {
        return {
          ...attributes,
          hidden: false,
          color: attributes.color,
          zIndex: 1,
        };
      }

      return {
        ...attributes,
        hidden: false,
        color: hexToRgba(attributes.color, 0.55),
        label: null,
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
          size: 0.9,
          zIndex: 1,
        };
      }

      return {
        ...attributes,
        hidden: false,
        color: DIMMED_EDGE_COLOR,
        size: 0.5,
      };
    });

    sigma.refresh();

    return () => {
      sigma.setSetting("nodeReducer", null);
      sigma.setSetting("edgeReducer", null);
      sigma.refresh();
    };
  }, [hoveredNode, sigma]);

  return null;
}

export function MiniGraph({ data }: MiniGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    setHoveredNode(null);
  }, [data]);

  if (data.nodes.length === 0) {
    return null;
  }

  return (
    <>
      <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-card)]">
        <div className="relative h-[180px] w-full">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(193,140,93,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(93,112,82,0.1),transparent_38%)]" />

          <SigmaStage
            containerClassName="h-full w-full"
            settings={{
              autoCenter: true,
              autoRescale: true,
              defaultEdgeColor: EDGE_COLOR,
              defaultNodeColor: "#5d7052",
              enableCameraPanning: false,
              enableCameraRotation: false,
              enableCameraZooming: false,
              enableEdgeEvents: false,
              hideEdgesOnMove: false,
              hideLabelsOnMove: false,
              labelColor: { color: FOREGROUND_COLOR },
              labelDensity: 1,
              labelFont: "serif",
              labelRenderedSizeThreshold: 999,
              labelSize: 11,
              labelWeight: "500",
              maxCameraRatio: 1,
              minCameraRatio: 1,
              renderEdgeLabels: false,
              renderLabels: true,
              stagePadding: 24,
              zIndex: true,
            }}
            sigmaClassName="mini-graph-sigma"
          >
            <GraphScene data={data} hoveredNode={hoveredNode} setHoveredNode={setHoveredNode} />
          </SigmaStage>

          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex justify-center">
            <span className="rounded-full border border-[color:var(--border)] bg-white/78 px-3 py-1 text-[0.68rem] font-medium tracking-[0.04em] text-[color:var(--muted)] shadow-[var(--shadow-soft)] backdrop-blur-sm">
              Click to explore the full graph
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .mini-graph-sigma {
          position: relative;
          height: 100%;
          width: 100%;
          background: transparent;
        }

        .mini-graph-sigma .sigma-container {
          height: 100%;
          width: 100%;
          background: transparent;
        }

        .mini-graph-sigma canvas {
          background: transparent;
        }

        .mini-graph-sigma .sigma-mouse {
          cursor: inherit;
        }
      `}</style>
    </>
  );
}
