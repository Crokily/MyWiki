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
  variant?: "default" | "recent";
}

export function EntryCard({ entry, index = 0, compact = false, variant = "default" }: EntryCardProps) {
  const shapeClass = CARD_SHAPES[index % CARD_SHAPES.length];
  const isRecent = variant === "recent";
  const previewTags = entry.tags.slice(0, compact ? 2 : 3);
  const displayDate = formatDate(entry.sortDate);

  return (
    <Link
      href={entry.href}
      className={`group block border border-[color:var(--border)] bg-[color:var(--surface-card)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--accent)] hover:shadow-[var(--shadow-float)] ${shapeClass} ${isRecent ? "h-[15.5rem] p-4" : compact ? "p-4" : "p-4 md:p-5"}`}
    >
      <div className="flex h-full flex-col">
        {isRecent ? (
          <p className="text-[0.68rem] font-medium tracking-[0.04em] text-[color:var(--muted)]">
            {entry.classification.toLowerCase()} / {DIRECTORY_LABELS[entry.directory].toLowerCase()}
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="pill-chip pill-chip-primary text-[0.72rem]">{entry.classification}</span>
            <span className="pill-chip text-[0.72rem]">{DIRECTORY_LABELS[entry.directory]}</span>
          </div>
        )}

        <h3
          className={`font-serif leading-tight tracking-[-0.03em] text-[color:var(--foreground)] transition duration-300 group-hover:text-[color:var(--accent-strong)] ${isRecent ? "mt-2.5 truncate text-lg" : compact ? "mt-3 text-base" : "mt-3 text-lg"}`}
        >
          {entry.title}
        </h3>

        <p
          className={`mt-2 text-[color:var(--muted)] ${isRecent ? "line-clamp-4 text-xs leading-[1.3rem]" : compact ? "line-clamp-2 text-xs" : "line-clamp-2 text-sm"}`}
        >
          {entry.excerpt || "Open this entry to read the full content."}
        </p>

        {isRecent ? (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[0.68rem] leading-4 text-[color:var(--muted)]">
            {displayDate && (
              <span className="rounded-full bg-[color:var(--accent-soft)] px-2 py-0.5 text-[color:var(--accent-strong)]">
                {displayDate}
              </span>
            )}
            {previewTags.map((tag) => (
              <span key={`${entry.slug}-${tag}`} className="rounded-full border border-[color:var(--border)] px-2 py-0.5">
                #{tag}
              </span>
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </Link>
  );
}
