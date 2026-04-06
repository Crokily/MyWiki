import Link from "next/link";

import { DIRECTORY_LABELS, formatDate } from "@/lib/site";

const CARD_SHAPES = [
  "rounded-[2rem] rounded-tr-[3.75rem]",
  "rounded-[2rem] rounded-bl-[3.5rem]",
  "rounded-[2rem] rounded-tl-[3.5rem]",
  "rounded-[2rem] rounded-br-[3.75rem]",
] as const;

export interface EntryCardData {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  directory: keyof typeof DIRECTORY_LABELS;
  classification: string;
  sortDate?: string;
  tags: string[];
}

interface EntryCardProps {
  entry: EntryCardData;
  index?: number;
  compact?: boolean;
}

export function EntryCard({ entry, index = 0, compact = false }: EntryCardProps) {
  const shapeClass = CARD_SHAPES[index % CARD_SHAPES.length];
  const previewTags = entry.tags.slice(0, compact ? 2 : 3);

  return (
    <Link
      href={entry.href}
      className={`group block border border-[color:var(--border)] bg-[color:var(--surface-card)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--accent)] hover:shadow-[var(--shadow-float)] ${shapeClass} ${compact ? "p-4" : "p-5 md:p-6"}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="pill-chip pill-chip-primary">{entry.classification}</span>
        <span className="pill-chip">{DIRECTORY_LABELS[entry.directory]}</span>
      </div>

      <h3
        className={`mt-4 font-serif leading-tight tracking-[-0.03em] text-[color:var(--foreground)] transition duration-300 group-hover:text-[color:var(--accent-strong)] ${compact ? "text-xl" : "text-2xl md:text-[1.9rem]"}`}
      >
        {entry.title}
      </h3>

      <p className={`mt-3 text-[color:var(--muted)] ${compact ? "text-sm" : "text-[0.98rem]"}`}>
        {entry.excerpt || "打开这篇条目继续阅读正文。"}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
        {formatDate(entry.sortDate) ? (
          <span className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-[color:var(--accent-strong)]">
            {formatDate(entry.sortDate)}
          </span>
        ) : null}
        {previewTags.map((tag) => (
          <span key={`${entry.slug}-${tag}`} className="rounded-full border border-[color:var(--border)] px-3 py-1">
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
