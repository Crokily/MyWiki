"use client";

import { useDeferredValue, useState } from "react";

import { EntryCard, type EntryCardData } from "@/components/EntryCard";
import { DIRECTORY_LABELS } from "@/lib/site";

const FILTERS = [
  ["all", "全部"],
  ["pages", DIRECTORY_LABELS.pages],
  ["sources", DIRECTORY_LABELS.sources],
  ["maps", DIRECTORY_LABELS.maps],
  ["queries", DIRECTORY_LABELS.queries],
] as const;

type FilterKey = (typeof FILTERS)[number][0];

interface HomeExplorerProps {
  entries: EntryCardData[];
}

export function HomeExplorer({ entries }: HomeExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredEntries = entries
    .filter((entry) => activeFilter === "all" || entry.directory === activeFilter)
    .filter((entry) => {
      if (!deferredQuery) {
        return true;
      }

      const searchableText = [
        entry.title,
        entry.excerpt,
        entry.slug,
        entry.classification,
        ...entry.tags,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(deferredQuery);
    })
    .slice(0, 6);

  return (
    <section className="mt-8 rounded-[2rem] border border-[color:var(--border)] bg-white/55 p-4 shadow-[var(--shadow-soft)] sm:p-5">
      <label className="block">
        <span className="sr-only">搜索 wiki 条目</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索文档、来源、主题或标签"
          className="h-12 w-full rounded-full border border-[color:var(--border)] bg-[color:var(--surface-card)] px-5 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--accent-soft)]"
          type="search"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map(([value, label]) => {
          const isActive = activeFilter === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => setActiveFilter(value)}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition duration-300 ${isActive ? "bg-[color:var(--accent)] text-[color:var(--accent-contrast)] shadow-[var(--shadow-soft)]" : "border border-[color:var(--border)] bg-[color:var(--surface-card)] text-[color:var(--foreground)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)]"}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 text-sm text-[color:var(--muted)]">
        <span>{deferredQuery ? `匹配 “${query.trim()}” 的结果` : "最近可读的条目"}</span>
        <span>{filteredEntries.length} 条</span>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="mt-5 rounded-[1.6rem] border border-dashed border-[color:var(--border)] px-5 py-8 text-sm text-[color:var(--muted)]">
          没有匹配结果，试试别名、英文 slug 或标签名。
        </div>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {filteredEntries.map((entry, index) => (
            <EntryCard key={entry.slug} entry={entry} index={index} compact />
          ))}
        </div>
      )}
    </section>
  );
}
