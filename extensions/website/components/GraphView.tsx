"use client";

import Graph from "graphology";
import { useLoadGraph, useRegisterEvents, useSigma } from "@react-sigma/core";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import type { GraphData, GraphNode, GraphStats } from "@/lib/graph";
import { resolveGraphPosition } from "@/lib/graph-position";
import { DIRECTORY_LABELS } from "@/lib/site";
import { SigmaStage } from "@/components/SigmaStage";

type DirectoryKey = keyof typeof DIRECTORY_LABELS;

interface GraphViewProps {
  data: GraphData;
  stats: GraphStats;
}

interface SigmaEdgeAttributes {
  color: string;
  size: number;
}

interface GraphSceneProps {
  data: GraphData;
  activeDirectories: Record<DirectoryKey, boolean>;
  hoveredNode: string | null;
  setHoveredNode: (node: string | null) => void;
}

interface SidebarPanelsProps {
  stats: GraphStats;
  directoryCounts: Record<DirectoryKey, number>;
  activeDirectories: Record<DirectoryKey, boolean>;
  onToggleDirectory: (directory: DirectoryKey) => void;
}

interface SidebarCardProps {
  title: string;
  children: ReactNode;
}

const DIRECTORY_KEYS = Object.keys(DIRECTORY_LABELS) as DirectoryKey[];

const DIRECTORY_COLORS: Record<DirectoryKey, string> = {
  pages: "#5d7052",
  sources: "#c18c5d",
  maps: "#5a7fa0",
  queries: "#8b6ba0",
};

const EDGE_COLOR = "rgba(120, 120, 108, 0.15)";
const HIGHLIGHT_EDGE_COLOR = "rgba(120, 120, 108, 0.32)";
const DIMMED_EDGE_COLOR = "rgba(120, 120, 108, 0.06)";
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
    });
  });

  for (const edge of data.edges) {
    if (!graph.hasNode(edge.source) || !graph.hasNode(edge.target) || graph.hasEdge(edge.source, edge.target)) {
      continue;
    }

    graph.addEdge(edge.source, edge.target, {
      color: EDGE_COLOR,
      size: 1,
    });
  }

  return graph;
}

function SidebarCard({ title, children }: SidebarCardProps) {
  return (
    <section className="surface rounded-[2rem] px-4 py-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">{title}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SidebarPanels({ stats, directoryCounts, activeDirectories, onToggleDirectory }: SidebarPanelsProps) {
  return (
    <>
      <SidebarCard title="Graph Stats">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[color:var(--surface-card)] px-3 py-3">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">Nodes</p>
            <p className="mt-2 font-serif text-2xl leading-none tracking-[-0.04em] text-[color:var(--foreground)]">
              {stats.nodeCount}
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[color:var(--surface-card)] px-3 py-3">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">Edges</p>
            <p className="mt-2 font-serif text-2xl leading-none tracking-[-0.04em] text-[color:var(--foreground)]">
              {stats.edgeCount}
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[color:var(--surface-card)] px-3 py-3">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">Avg Degree</p>
            <p className="mt-2 font-serif text-2xl leading-none tracking-[-0.04em] text-[color:var(--foreground)]">
              {stats.avgDegree.toFixed(1)}
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[color:var(--surface-card)] px-3 py-3">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">Components</p>
            <p className="mt-2 font-serif text-2xl leading-none tracking-[-0.04em] text-[color:var(--foreground)]">
              {stats.components}
            </p>
          </div>
        </div>
      </SidebarCard>

      <SidebarCard title="Legend">
        <div className="space-y-2">
          {DIRECTORY_KEYS.map((directory) => (
            <div key={directory} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2">
              <span className="flex items-center gap-3 text-sm text-[color:var(--foreground)]">
                <span
                  className="h-3 w-3 rounded-full border border-white/70 shadow-[0_0_0_4px_rgba(255,255,255,0.42)]"
                  style={{ backgroundColor: DIRECTORY_COLORS[directory] }}
                />
                {DIRECTORY_LABELS[directory]}
              </span>
              <span className="text-xs text-[color:var(--muted)]">{directoryCounts[directory]}</span>
            </div>
          ))}
        </div>
      </SidebarCard>

      <SidebarCard title="Filters">
        <div className="space-y-2">
          {DIRECTORY_KEYS.map((directory) => (
            <label
              key={directory}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-[color:var(--accent-soft)]"
            >
              <span className="flex items-center gap-3 text-[color:var(--foreground)]">
                <input
                  checked={activeDirectories[directory]}
                  onChange={() => onToggleDirectory(directory)}
                  type="checkbox"
                  className="h-4 w-4 rounded border border-[color:var(--border)]"
                  style={{ accentColor: DIRECTORY_COLORS[directory] }}
                />
                {DIRECTORY_LABELS[directory]}
              </span>
              <span className="text-xs text-[color:var(--muted)]">{directoryCounts[directory]}</span>
            </label>
          ))}
        </div>
      </SidebarCard>
    </>
  );
}

function GraphScene({ data, activeDirectories, hoveredNode, setHoveredNode }: GraphSceneProps) {
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
    container.style.cursor = "grab";

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
        sigma.getContainer().style.cursor = "grab";
      },
      clickNode: ({ node, preventSigmaDefault }) => {
        preventSigmaDefault();

        const target = nodeLookup.get(node);

        if (target) {
          router.push(target.href);
        }
      },
      leaveStage: () => {
        sigma.getContainer().style.cursor = "grab";
      },
    });
  }, [nodeLookup, registerEvents, router, setHoveredNode, sigma]);

  useEffect(() => {
    const graph = sigma.getGraph();
    const activeDirectorySet = new Set(
      DIRECTORY_KEYS.filter((directory) => activeDirectories[directory]),
    ) as Set<DirectoryKey>;

    const hoveredDirectory =
      hoveredNode && graph.hasNode(hoveredNode)
        ? (graph.getNodeAttribute(hoveredNode, "directory") as DirectoryKey)
        : null;
    const shouldHighlight = hoveredNode !== null && hoveredDirectory !== null && activeDirectorySet.has(hoveredDirectory);

    const neighborSet = new Set<string>();

    if (shouldHighlight && hoveredNode) {
      for (const neighbor of graph.neighbors(hoveredNode)) {
        const directory = graph.getNodeAttribute(neighbor, "directory") as DirectoryKey;

        if (activeDirectorySet.has(directory)) {
          neighborSet.add(neighbor);
        }
      }
    }

    sigma.setSetting("nodeReducer", (node, attributes) => {
      const directory = attributes.directory as DirectoryKey;

      if (!activeDirectorySet.has(directory)) {
        return {
          ...attributes,
          hidden: true,
          label: null,
        };
      }

      if (!shouldHighlight || !hoveredNode) {
        return {
          ...attributes,
          hidden: false,
          forceLabel: attributes.size >= 12,
        };
      }

      if (node === hoveredNode) {
        return {
          ...attributes,
          hidden: false,
          color: attributes.color,
          forceLabel: true,
          zIndex: 2,
        };
      }

      if (neighborSet.has(node)) {
        return {
          ...attributes,
          hidden: false,
          color: attributes.color,
          forceLabel: true,
          zIndex: 1,
        };
      }

      return {
        ...attributes,
        hidden: false,
        color: hexToRgba(attributes.color, 0.18),
        label: null,
      };
    });

    sigma.setSetting("edgeReducer", (edge, attributes) => {
      const [source, target] = graph.extremities(edge);
      const sourceDirectory = graph.getNodeAttribute(source, "directory") as DirectoryKey;
      const targetDirectory = graph.getNodeAttribute(target, "directory") as DirectoryKey;

      if (!activeDirectorySet.has(sourceDirectory) || !activeDirectorySet.has(targetDirectory)) {
        return {
          ...attributes,
          hidden: true,
        };
      }

      if (!shouldHighlight || !hoveredNode) {
        return {
          ...attributes,
          hidden: false,
          color: attributes.color,
          size: attributes.size,
        };
      }

      const isConnected = source === hoveredNode || target === hoveredNode;

      if (isConnected) {
        return {
          ...attributes,
          hidden: false,
          color: HIGHLIGHT_EDGE_COLOR,
          size: 1.8,
          zIndex: 1,
        };
      }

      return {
        ...attributes,
        hidden: false,
        color: DIMMED_EDGE_COLOR,
        size: 1,
      };
    });

    sigma.refresh();

    return () => {
      sigma.setSetting("nodeReducer", null);
      sigma.setSetting("edgeReducer", null);
      sigma.refresh();
    };
  }, [activeDirectories, hoveredNode, sigma]);

  return null;
}

export function GraphView({ data, stats }: GraphViewProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeDirectories, setActiveDirectories] = useState<Record<DirectoryKey, boolean>>({
    pages: true,
    sources: true,
    maps: true,
    queries: true,
  });

  const nodeLookup = useMemo(() => new Map(data.nodes.map((node) => [node.slug, node] as const)), [data.nodes]);

  const directoryCounts = useMemo(() => {
    const counts = {
      pages: 0,
      sources: 0,
      maps: 0,
      queries: 0,
    } satisfies Record<DirectoryKey, number>;

    for (const node of data.nodes) {
      counts[node.directory] += 1;
    }

    return counts;
  }, [data.nodes]);

  const visibleNodeCount = useMemo(
    () => data.nodes.filter((node) => activeDirectories[node.directory]).length,
    [activeDirectories, data.nodes],
  );

  const hoveredLabel = hoveredNode ? nodeLookup.get(hoveredNode)?.label ?? hoveredNode : null;

  useEffect(() => {
    if (!hoveredNode) {
      return;
    }

    const node = nodeLookup.get(hoveredNode);

    if (!node || !activeDirectories[node.directory]) {
      setHoveredNode(null);
    }
  }, [activeDirectories, hoveredNode, nodeLookup]);

  const toggleDirectory = (directory: DirectoryKey) => {
    setActiveDirectories((current) => ({
      ...current,
      [directory]: !current[directory],
    }));
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem] xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <section
            className="surface relative overflow-hidden rounded-[2.5rem]"
            style={{ height: "calc(100vh - 10rem)", minHeight: "30rem" }}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-[4.5rem] top-8 h-56 w-56 rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] bg-[color:var(--secondary-soft)] blur-3xl" />
              <div className="absolute bottom-2 right-4 h-64 w-64 rounded-[32%_68%_67%_33%_/_38%_35%_65%_62%] bg-[color:var(--accent-soft)] blur-3xl" />
            </div>

            <div className="pointer-events-none absolute left-5 top-5 z-10 max-w-xs rounded-[1.6rem] border border-[color:var(--border)] bg-white/70 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-md">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[color:var(--muted)]">Network View</p>
              <h1 className="mt-2 font-serif text-2xl leading-none tracking-[-0.04em] text-[color:var(--foreground)]">
                Knowledge Graph
              </h1>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                Hover to trace links, zoom to reveal labels, and click any node to open that entry.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="pill-chip bg-white/75">{visibleNodeCount} visible</span>
                {hoveredLabel && <span className="pill-chip bg-white/75">{hoveredLabel}</span>}
              </div>
            </div>

            <div className="relative h-full w-full">
              <SigmaStage
                containerClassName="h-full w-full"
                settings={{
                  autoCenter: true,
                  autoRescale: true,
                  defaultEdgeColor: EDGE_COLOR,
                  defaultNodeColor: DIRECTORY_COLORS.pages,
                  enableEdgeEvents: false,
                  hideEdgesOnMove: false,
                  hideLabelsOnMove: false,
                  labelColor: { color: FOREGROUND_COLOR },
                  labelDensity: 1.1,
                  labelFont: "serif",
                  labelRenderedSizeThreshold: 10,
                  labelSize: 14,
                  labelWeight: "500",
                  minCameraRatio: 0.08,
                  maxCameraRatio: 8,
                  renderEdgeLabels: false,
                  renderLabels: true,
                  stagePadding: 36,
                  zIndex: true,
                }}
                sigmaClassName="graph-sigma"
              >
                <GraphScene
                  data={data}
                  activeDirectories={activeDirectories}
                  hoveredNode={hoveredNode}
                  setHoveredNode={setHoveredNode}
                />
              </SigmaStage>
            </div>
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <SidebarPanels
              stats={stats}
              directoryCounts={directoryCounts}
              activeDirectories={activeDirectories}
              onToggleDirectory={toggleDirectory}
            />
          </div>
        </aside>

        <div className="space-y-5 lg:hidden">
          <SidebarPanels
            stats={stats}
            directoryCounts={directoryCounts}
            activeDirectories={activeDirectories}
            onToggleDirectory={toggleDirectory}
          />
        </div>
      </div>

      <style jsx global>{`
        .graph-sigma {
          position: relative;
          height: 100%;
          width: 100%;
          background: transparent;
        }

        .graph-sigma .sigma-container {
          height: 100%;
          width: 100%;
          background: transparent;
        }

        .graph-sigma canvas {
          background: transparent;
        }

        .graph-sigma .sigma-mouse {
          cursor: inherit;
        }
      `}</style>
    </>
  );
}
