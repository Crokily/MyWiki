import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BackLinks } from "@/components/BackLinks";
import { PageMeta } from "@/components/PageMeta";
import { getBacklinks, getPageBySlug, getAllPages, formatDate, tagToHref } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";

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
    return {
      title: "Not Found",
    };
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
  const backlinks = getBacklinks(page.slug);
  const classification = page.frontmatter.type || page.frontmatter.kind || page.directory;
  const date = formatDate(page.sortDate);

  return (
    <>
      {/* Title + inline metadata */}
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{page.title}</h1>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-md bg-[color:var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[color:var(--accent)]">
            {classification}
          </span>
          {page.tags.map((tag) => (
            <Link
              key={tag}
              href={tagToHref(tag)}
              className="tag-chip rounded-md px-2 py-0.5 text-xs transition"
            >
              {tag}
            </Link>
          ))}
          {date ? (
            <span className="text-xs text-[color:var(--muted)]">{date}</span>
          ) : null}
        </div>

        <PageMeta page={page} />
      </header>

      {/* Content */}
      <article className="surface rounded-lg p-5 md:p-8">
        <div className="prose prose-base dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      <BackLinks pages={backlinks} />
    </>
  );
}
