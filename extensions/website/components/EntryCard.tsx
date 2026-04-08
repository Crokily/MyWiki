import Link from "next/link";

import { DIRECTORY_LABELS, formatDate } from "@/lib/site";

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
  compact?: boolean;
}

export function EntryCard({ entry, compact = false }: EntryCardProps) {
  const previewTags = entry.tags.slice(0, compact ? 2 : 3);
  const displayDate = formatDate(entry.sortDate);

  return (
    <Link
      href={entry.href}
      className={`group block rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-card)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--accent)] hover:shadow-[var(--shadow-float)] ${compact ? "p-4" : "p-4 md:p-5"}`}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="pill-chip pill-chip-primary text-[0.72rem]">{entry.classification}</span>
        <span className="pill-chip text-[0.72rem]">{DIRECTORY_LABELS[entry.directory]}</span>
      </div>

      <h3
        className={`mt-3 font-serif leading-tight tracking-[-0.03em] text-[color:var(--foreground)] transition duration-300 group-hover:text-[color:var(--accent-strong)] ${compact ? "text-base" : "text-lg"}`}
      >
        {entry.title}
      </h3>

      <p className={`mt-2 line-clamp-2 text-[color:var(--muted)] ${compact ? "text-xs" : "text-sm"}`}>
        {entry.excerpt || "Open this entry to read the full content."}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-[color:var(--muted)]">
        {displayDate && (
          <span className="rounded-full bg-[color:var(--accent-soft)] px-2.5 py-0.5 text-[color:var(--accent-strong)]">
            {displayDate}
          </span>
        )}
        {previewTags.map((tag) => (
          <span key={`${entry.slug}-${tag}`} className="rounded-full border border-[color:var(--border)] px-2.5 py-0.5">
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
