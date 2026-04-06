import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllTags, getPagesByTag } from "@/lib/content";

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
    description: `Pages tagged with ${fullTag}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const fullTag = tag.join("/");
  const pages = getPagesByTag(fullTag);

  if (pages.length === 0) {
    notFound();
  }

  return (
    <>
      <section className="surface rounded-[2rem] p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--muted)]">Tag Archive</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">#{fullTag}</h1>
        <p className="mt-4 text-[color:var(--muted)]">{pages.length} pages reference this tag.</p>
      </section>

      <section className="surface rounded-[1.75rem] p-6">
        <div className="grid gap-4">
          {pages.map((page) => (
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
              <h2 className="mt-3 font-serif text-2xl leading-snug">{page.title}</h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{page.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

