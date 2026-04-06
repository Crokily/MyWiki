import Link from "next/link";

import { TagCloud } from "@/components/TagCloud";
import { formatDate, getAllPages, getAllTags, getDirectoryCounts, getRecentPages } from "@/lib/content";

const DIRECTORY_LABELS = {
  pages: "Pages",
  sources: "Sources",
  maps: "Maps",
  queries: "Queries",
} as const;

export default function HomePage() {
  const counts = getDirectoryCounts();
  const entries = getAllPages();
  const tags = getAllTags();
  const recentPages = getRecentPages(8);

  return (
    <>
      <section className="surface overflow-hidden rounded-[2rem] p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--muted)]">Static Knowledge Base</p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
              将 MyWiki 直接渲染为可部署到 Vercel 的静态文档站点。
            </h1>
            <p className="mt-5 max-w-2xl text-base text-[color:var(--muted)] md:text-lg">
              站点在构建期直接读取 wiki 根目录 markdown，不复制内容，不引入 CMS，保留扁平 slug 和
              Obsidian 风格 `[[wikilink]]`。
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {Object.entries(DIRECTORY_LABELS).map(([directory, label]) => (
              <div key={directory} className="rounded-[1.4rem] border border-[color:var(--border)] bg-white/35 p-4 dark:bg-black/10">
                <div className="text-sm text-[color:var(--muted)]">{label}</div>
                <div className="mt-2 text-3xl font-semibold">{counts[directory as keyof typeof counts]}</div>
              </div>
            ))}
            <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-white/35 p-4 dark:bg-black/10">
              <div className="text-sm text-[color:var(--muted)]">Total Tags</div>
              <div className="mt-2 text-3xl font-semibold">{tags.length}</div>
            </div>
            <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-white/35 p-4 dark:bg-black/10">
              <div className="text-sm text-[color:var(--muted)]">Total Entries</div>
              <div className="mt-2 text-3xl font-semibold">{entries.length}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
        <div className="surface rounded-[1.75rem] p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl">Recent Pages</h2>
            <span className="text-sm text-[color:var(--muted)]">{recentPages.length} entries</span>
          </div>

          <div className="grid gap-4">
            {recentPages.map((page) => (
              <Link
                key={page.slug}
                href={page.href}
                className="rounded-[1.4rem] border border-[color:var(--border)] bg-white/30 p-5 transition hover:-translate-y-0.5 hover:border-[color:var(--accent)] dark:bg-black/10"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[color:var(--accent-soft)] px-2.5 py-1 text-xs font-medium text-[color:var(--accent)]">
                    {page.frontmatter.type || page.frontmatter.kind || page.directory}
                  </span>
                  <span className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">{page.directory}</span>
                </div>
                <h3 className="mt-3 font-serif text-2xl leading-snug">{page.title}</h3>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{page.excerpt}</p>
                <div className="mt-4 text-xs text-[color:var(--muted)]">{formatDate(page.sortDate) ?? "未标注日期"}</div>
              </Link>
            ))}
          </div>
        </div>

        <section className="surface rounded-[1.75rem] p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl">Tags</h2>
            <span className="text-sm text-[color:var(--muted)]">{tags.length} total</span>
          </div>
          <TagCloud tags={tags} />
        </section>
      </section>
    </>
  );
}

