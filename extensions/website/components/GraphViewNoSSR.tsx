"use client";

import dynamic from "next/dynamic";

export const GraphView = dynamic(() => import("./GraphView").then((m) => m.GraphView), { ssr: false });
