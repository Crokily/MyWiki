import Link from "next/link";

import { formatDate, getAllPages, getAllTags, getRecentPages } from "@/lib/content";

export default function HomePage() {
  const entries = getAllPages();
  const tags = getAllTags();
  const recentPages = getRecentPages(12);

  return (
    <>
      {/* Compact header */}
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Pages</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            {entries.length} entries &middot; {tags.length} tags
          </p>
        </div>
      </div>

      {/* Page list */}
      <div className="space-y-2">
        {recentPages.map((page) => (
          <Link
            key={page.slug}
            href={page.href}
            className="surface flex items-start gap-4 rounded-lg p-4 transition-colors hover:border-[color:var(--accent)]"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-medium">{page.title}</h2>
                <span className="rounded-md bg-[color:var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[color:var(--accent)]">
                  {page.frontmatter.type || page.frontmatter.kind || page.directory}
                </span>
              </div>
              {page.excerpt ? (
                <p className="mt-1 line-clamp-1 text-sm text-[color:var(--muted)]">{page.excerpt}</p>
              ) : null}
            </div>
            <span className="shrink-0 text-xs text-[color:var(--muted)] pt-1">
              {formatDate(page.sortDate) ?? ""}
            </span>
          </Link>
        ))}
      </div>

      {/* Remaining pages if more than recent */}
      {entries.length > recentPages.length ? (
        <div>
          <h2 className="mb-3 text-lg font-semibold tracking-tight">All Entries</h2>
          <div className="space-y-1">
            {entries
              .filter((e) => !recentPages.some((r) => r.slug === e.slug))
              .map((page) => (
                <Link
                  key={page.slug}
                  href={page.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[color:var(--accent-soft)]"
                >
                  <span className="min-w-0 flex-1 truncate font-medium">{page.title}</span>
                  <span className="rounded-md bg-[color:var(--accent-soft)] px-1.5 py-0.5 text-xs text-[color:var(--accent)]">
                    {page.frontmatter.type || page.frontmatter.kind || page.directory}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
