"use client";

import { useEffect, useState } from "react";

import type { TocHeading } from "@/lib/markdown";

interface TableOfContentsProps {
  headings: TocHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 },
    );

    for (const heading of headings) {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground)]">Contents</p>
      <ul className="mt-3 space-y-1">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block text-xs leading-snug transition ${heading.level === 3 ? "pl-4" : ""} ${isActive ? "font-medium text-[color:var(--accent-strong)]" : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"}`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
