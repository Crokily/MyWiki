import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BackLinksSidebar } from "@/components/BackLinks";
import { LocalGraph } from "@/components/LocalGraphNoSSR";
import { PageMetaSidebar } from "@/components/PageMeta";
import { TableOfContents } from "@/components/TableOfContents";
import { getBacklinks, getPageBySlug, getAllPages } from "@/lib/content";
import { getLocalGraph } from "@/lib/graph";
import { renderMarkdown, extractHeadings } from "@/lib/markdown";
import { DIRECTORY_LABELS, formatDate } from "@/lib/site";

interface WikiPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPages().map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: WikiPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    return { title: "Not Found" };
  }

  return {
    title: page.title,
    description: page.excerpt,
  };
}

export default async function WikiPage({ params }: WikiPageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const html = await renderMarkdown(page.body);
  const headings = extractHeadings(html);
  const backlinks = getBacklinks(page.slug);
  const localGraph = getLocalGraph(page.slug);
  const { classification } = page;
  const primaryDate =
    page.frontmatter.updated ||
    page.frontmatter.created ||
    (typeof page.frontmatter.ingested === "string" ? page.frontmatter.ingested : undefined);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem] xl:grid-cols-[minmax(0,1fr)_18rem]">
      {/* ── Main Column ── */}
      <div className="min-w-0 space-y-6">
        {/* Breadcrumb + Date — inline, no card */}
        <nav className="flex flex-wrap items-center gap-2 px-1 text-sm">
          <Link href="/" className="text-[color:var(--muted)] transition hover:text-[color:var(--accent-strong)]">
            Home
          </Link>
          <span className="text-[color:var(--muted)]">/</span>
          <span className="pill-chip pill-chip-primary text-xs">{classification}</span>
          <span className="pill-chip text-xs">{DIRECTORY_LABELS[page.directory]}</span>
          {primaryDate && (
            <span className="text-xs text-[color:var(--muted)]">{formatDate(primaryDate)}</span>
          )}
        </nav>

        {/* Article Body */}
        <article className="surface rounded-xl px-5 py-6 sm:px-7 sm:py-8">
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
        </article>

        {/* Mobile-only meta & backlinks (shown below article on small screens) */}
        <div className="space-y-5 lg:hidden">
          {localGraph.nodes.length > 1 && (
            <section className="surface rounded-xl px-4 py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground)]">Local Graph</p>
              <div className="mt-3">
                <LocalGraph data={localGraph} />
              </div>
            </section>
          )}
          <section className="surface rounded-xl px-5 py-5">
            <PageMetaSidebar page={page} />
          </section>
          {backlinks.length > 0 && (
            <section className="surface rounded-xl px-5 py-5">
              <BackLinksSidebar pages={backlinks} />
            </section>
          )}
        </div>
      </div>

      {/* ── Sidebar ── */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-5">
          {localGraph.nodes.length > 1 && (
            <section className="surface rounded-xl px-4 py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground)]">Local Graph</p>
              <div className="mt-3">
                <LocalGraph data={localGraph} />
              </div>
            </section>
          )}

          {/* Table of Contents */}
          {headings.length > 0 && (
            <section className="surface rounded-xl px-4 py-5">
              <TableOfContents headings={headings} />
            </section>
          )}

          {/* Page Meta */}
          <section className="surface rounded-xl px-4 py-5">
            <PageMetaSidebar page={page} />
          </section>

          {/* Backlinks */}
          {backlinks.length > 0 && (
            <section className="surface rounded-xl px-4 py-5">
              <BackLinksSidebar pages={backlinks} />
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}
