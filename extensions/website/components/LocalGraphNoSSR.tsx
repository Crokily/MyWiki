"use client";

import dynamic from "next/dynamic";

export const LocalGraph = dynamic(() => import("./LocalGraph").then((m) => m.LocalGraph), { ssr: false });
