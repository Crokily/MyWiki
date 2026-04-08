"use client";

import dynamic from "next/dynamic";

export const MiniGraph = dynamic(() => import("./MiniGraph").then((m) => m.MiniGraph), { ssr: false });
