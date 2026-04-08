import Link from "next/link";

import { EntryCard } from "@/components/EntryCard";
import { MiniGraph } from "@/components/MiniGraphNoSSR";
import { getAllTags, getDirectoryCounts, getRecentPages, tagToHref } from "@/lib/content";
import { getGraphData } from "@/lib/graph";
import { DIRECTORY_LABELS } from "@/lib/site";

export default function HomePage() {
  const counts = getDirectoryCounts();
  const graphData = getGraphData();
  const hasGraph = graphData.nodes.length > 0;
  const tags = getAllTags();
  const recentEntries = getRecentPages(18).map((page) => ({
    slug: page.slug,
    href: page.href,
    title: page.title,
    excerpt: page.excerpt,
    directory: page.directory,
    classification: page.classification,
    sortDate: page.sortDate,
    tags: page.tags,
  }));

  const nonEmptyDirectories = (Object.entries(DIRECTORY_LABELS) as [keyof typeof DIRECTORY_LABELS, string][]).filter(
    ([dir]) => counts[dir] > 0,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem] xl:grid-cols-[minmax(0,1fr)_18rem]">
      {/* ── Main Column ── */}
      <div className="space-y-6">
        {/* Recent Entries */}
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl tracking-[-0.03em]">Recent Updates</h2>
            <span className="text-sm text-[color:var(--muted)]">{recentEntries.length} entries</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {recentEntries.map((page) => (
              <EntryCard key={page.slug} entry={page} />
            ))}
          </div>
        </section>
      </div>

      {/* ── Sidebar ── */}
      <aside className="hidden space-y-5 lg:block">
        <div className="sticky top-24 space-y-5">
          {hasGraph && (
            <section className="surface rounded-xl px-4 py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground)]">Knowledge Graph</p>
              <div className="mt-3">
                <MiniGraph data={graphData} />
              </div>
            </section>
          )}

          {/* Content Stats & Tags — inline, no card */}
          <section className="px-1">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground)]">Content Stats</p>
            <div className="mt-3 space-y-2">
              {nonEmptyDirectories.map(([dir, label]) => (
                <div key={dir} className="flex items-center justify-between gap-3">
                  <span className="text-xs text-[color:var(--foreground)]">{label}</span>
                  <span className="text-xs font-semibold text-[color:var(--foreground)]">{counts[dir]}</span>
                </div>
              ))}
              <div className="border-t border-[color:var(--border)] pt-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[color:var(--foreground)]">Total</span>
                  <span className="text-xs font-semibold text-[color:var(--foreground)]">
                    {Object.values(counts).reduce((a, b) => a + b, 0)}
                  </span>
                </div>
              </div>
            </div>

            {tags.length > 0 && (
              <>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground)]">Tags</p>
                <div className="mt-3 space-y-1">
                  {tags.map((tag) => (
                    <Link
                      key={tag.tag}
                      href={tagToHref(tag.tag)}
                      className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs transition hover:bg-[color:var(--accent-soft)]"
                    >
                      <span className="text-[color:var(--foreground)]">#{tag.tag}</span>
                      <span className="text-[0.65rem] text-[color:var(--muted)]">{tag.count}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </aside>

      {/* ── Mobile-only sidebar content ── */}
      <div className="space-y-5 lg:hidden">
        {hasGraph && (
          <section className="surface rounded-xl px-5 py-5">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground)]">Knowledge Graph</p>
            <div className="mt-3">
              <MiniGraph data={graphData} />
            </div>
          </section>
        )}

        {tags.length > 0 && (
          <section className="px-1">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground)]">Tags</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.tag}
                  href={tagToHref(tag.tag)}
                  className="pill-chip text-xs hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)]"
                >
                  #{tag.tag}
                  <span className="ml-1.5 text-[0.65rem] text-[color:var(--muted)]">{tag.count}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
