import type { Metadata } from "next";

import { GraphView } from "@/components/GraphViewNoSSR";
import { getGraphData, getGraphStats } from "@/lib/graph";

export function generateMetadata(): Metadata {
  return {
    title: "Knowledge Graph",
  };
}

export default function GraphPage() {
  const data = getGraphData();
  const stats = getGraphStats();

  return <GraphView data={data} stats={stats} />;
}
