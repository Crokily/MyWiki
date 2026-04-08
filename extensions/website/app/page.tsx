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
        {/* Hero */}
        <section className="surface relative overflow-hidden rounded-[2.5rem] px-5 py-6 sm:px-7 sm:py-8">
          <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] bg-[color:var(--secondary-soft)] blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-[32%_68%_67%_33%_/_38%_35%_65%_62%] bg-[color:var(--accent-soft)] blur-3xl" />
          <div className="relative">
            <h1 className="max-w-3xl font-serif text-4xl leading-[1] tracking-[-0.05em] text-[color:var(--foreground)] sm:text-5xl md:text-6xl">
              Knowledge Base
            </h1>
            <p className="mt-4 max-w-2xl text-base text-[color:var(--muted)] md:text-lg">
              A markdown knowledge base incrementally maintained by LLM agents. Cross-referenced, continuously evolving.
            </p>
          </div>
        </section>

        {/* Recent Entries */}
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl tracking-[-0.03em]">Recent Updates</h2>
            <span className="text-sm text-[color:var(--muted)]">{recentEntries.length} entries</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recentEntries.map((page, index) => (
              <EntryCard key={page.slug} entry={page} index={index} />
            ))}
          </div>
        </section>
      </div>

      {/* ── Sidebar ── */}
      <aside className="hidden space-y-5 lg:block">
        <div className="sticky top-24 space-y-5">
          {/* Content Stats */}
          <section className="surface rounded-[2rem] px-4 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">Content Stats</p>
            <div className="mt-4 space-y-3">
              {nonEmptyDirectories.map(([dir, label]) => (
                <div key={dir} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[color:var(--foreground)]">{label}</span>
                  <span className="text-sm font-semibold text-[color:var(--foreground)]">{counts[dir]}</span>
                </div>
              ))}
              <div className="border-t border-[color:var(--border)] pt-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-[color:var(--foreground)]">Total</span>
                  <span className="text-sm font-semibold text-[color:var(--foreground)]">
                    {Object.values(counts).reduce((a, b) => a + b, 0)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {hasGraph && (
            <section className="surface rounded-[2rem] px-4 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">Knowledge Graph</p>
              <div className="mt-4">
                <MiniGraph data={graphData} />
              </div>
            </section>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <section className="surface rounded-[2rem] px-4 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">Tags</p>
              <div className="mt-4 space-y-2">
                {tags.map((tag) => (
                  <Link
                    key={tag.tag}
                    href={tagToHref(tag.tag)}
                    className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-[color:var(--accent-soft)]"
                  >
                    <span className="text-[color:var(--foreground)]">#{tag.tag}</span>
                    <span className="text-xs text-[color:var(--muted)]">{tag.count}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </aside>

      {/* ── Mobile-only sidebar content ── */}
      <div className="space-y-5 lg:hidden">
        {hasGraph && (
          <section className="surface rounded-[2rem] px-5 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">Knowledge Graph</p>
            <div className="mt-4">
              <MiniGraph data={graphData} />
            </div>
          </section>
        )}

        {tags.length > 0 && (
          <section className="surface rounded-[2rem] px-5 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">Tags</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.tag}
                  href={tagToHref(tag.tag)}
                  className="pill-chip hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)]"
                >
                  #{tag.tag}
                  <span className="ml-1.5 text-xs text-[color:var(--muted)]">{tag.count}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
