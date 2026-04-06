import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate, getAllTags, getPagesByTag } from "@/lib/content";

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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">#{fullTag}</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">{pages.length} pages</p>
      </div>

      <div className="space-y-2">
        {pages.map((page) => (
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
    </>
  );
}
