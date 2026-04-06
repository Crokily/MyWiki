import Link from "next/link";

import type { WikiEntry } from "@/lib/content";

interface BackLinksProps {
  pages: WikiEntry[];
}

export function BackLinks({ pages }: BackLinksProps) {
  if (pages.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[color:var(--border)] pt-5">
      <h2 className="mb-3 text-sm font-medium text-[color:var(--muted)]">
        Backlinks ({pages.length})
      </h2>
      <div className="flex flex-wrap gap-2">
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={page.href}
            className="rounded-md border border-[color:var(--border)] px-3 py-1.5 text-sm transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
          >
            {page.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
