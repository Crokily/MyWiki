import Link from "next/link";

import type { WikiEntry } from "@/lib/content";

interface BackLinksProps {
  pages: WikiEntry[];
}

export function BackLinks({ pages }: BackLinksProps) {
  return (
    <section className="surface rounded-[1.75rem] p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-serif text-2xl">Backlinks</h2>
        <span className="text-sm text-[color:var(--muted)]">{pages.length} references</span>
      </div>

      {pages.length === 0 ? (
        <p className="text-sm text-[color:var(--muted)]">当前还没有其他页面引用这里。</p>
      ) : (
        <ul className="space-y-3">
          {pages.map((page) => (
            <li key={page.slug} className="rounded-2xl border border-[color:var(--border)] bg-white/30 p-4 dark:bg-black/10">
              <Link href={page.href} className="font-medium hover:text-[color:var(--accent)]">
                {page.title}
              </Link>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                {page.excerpt || "该页面包含对当前条目的引用。"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

