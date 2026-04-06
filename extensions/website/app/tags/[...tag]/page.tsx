import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EntryCard } from "@/components/EntryCard";
import { getAllTags, getPagesByTag, tagToHref } from "@/lib/content";

interface TagPageProps {
  params: Promise<{
    tag: string[];
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({
    tag: tag.segments,
  }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const fullTag = tag.join("/");

  return {
    title: `#${fullTag}`,
    description: `All entries tagged with ${fullTag}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const fullTag = tag.join("/");
  const pages = getPagesByTag(fullTag);
  const allTags = getAllTags();

  if (pages.length === 0) {
    notFound();
  }

  const items = pages.map((page) => ({
    slug: page.slug,
    href: page.href,
    title: page.title,
    excerpt: page.excerpt,
    directory: page.directory,
    classification: page.classification,
    sortDate: page.sortDate,
    tags: page.tags,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem] xl:grid-cols-[minmax(0,1fr)_18rem]">
      {/* ── Main Column ── */}
      <div className="space-y-6">
        <section className="surface overflow-hidden rounded-[2.5rem] px-5 py-6 sm:px-7 sm:py-8">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link href="/" className="text-[color:var(--muted)] transition hover:text-[color:var(--accent-strong)]">
              Home
            </Link>
            <span className="text-[color:var(--muted)]">/</span>
            <span className="text-[color:var(--foreground)]">Tags</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl leading-[0.95] tracking-[-0.05em] sm:text-5xl">#{fullTag}</h1>
          <p className="mt-4 max-w-2xl text-base text-[color:var(--muted)]">
            {pages.length} entries match this tag.
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((page, index) => (
            <EntryCard key={page.slug} entry={page} index={index} />
          ))}
        </div>
      </div>

      {/* ── Sidebar ── */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-5">
          <section className="surface rounded-[2rem] px-4 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">All Tags</p>
            <div className="mt-4 space-y-2">
              {allTags.map((t) => (
                <Link
                  key={t.tag}
                  href={tagToHref(t.tag)}
                  className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-[color:var(--accent-soft)] ${t.tag === fullTag ? "bg-[color:var(--accent-soft)] font-medium text-[color:var(--accent-strong)]" : "text-[color:var(--foreground)]"}`}
                >
                  <span>#{t.tag}</span>
                  <span className="text-xs text-[color:var(--muted)]">{t.count}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
