"use client";

import { SigmaContainer } from "@react-sigma/core";
import type { Attributes } from "graphology-types";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import type { Settings } from "sigma/settings";

interface SigmaStageProps<N extends Attributes = Attributes, E extends Attributes = Attributes, G extends Attributes = Attributes> {
  children: ReactNode;
  containerClassName?: string;
  settings?: Partial<Settings<N, E, G>>;
  sigmaClassName?: string;
}

export function SigmaStage<N extends Attributes = Attributes, E extends Attributes = Attributes, G extends Attributes = Attributes>({
  children,
  containerClassName,
  settings,
  sigmaClassName,
}: SigmaStageProps<N, E, G>) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    let frameId = 0;

    const updateReadiness = () => {
      const { width, height } = host.getBoundingClientRect();

      setIsReady(width > 0 && height > 0);
    };

    const scheduleReadinessCheck = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateReadiness);
    };

    scheduleReadinessCheck();

    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleReadinessCheck);
    resizeObserver?.observe(host);
    window.addEventListener("resize", scheduleReadinessCheck);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", scheduleReadinessCheck);
    };
  }, []);

  return (
    <div ref={hostRef} className={containerClassName}>
      {isReady ? (
        <SigmaContainer
          className={sigmaClassName}
          style={{ height: "100%", width: "100%" }}
          settings={{
            allowInvalidContainer: true,
            ...settings,
          }}
        >
          {children}
        </SigmaContainer>
      ) : null}
    </div>
  );
}
