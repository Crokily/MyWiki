import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackLinks } from "@/components/BackLinks";
import { PageMeta } from "@/components/PageMeta";
import { getBacklinks, getPageBySlug, getAllPages } from "@/lib/content";
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

  return (
    <>
      <header className="surface rounded-[2rem] p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--muted)]">/{page.slug}</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{page.title}</h1>
      </header>

      <PageMeta page={page} />

      <article className="surface rounded-[2rem] p-6 md:p-8">
        <div className="prose prose-lg dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      <BackLinks pages={backlinks} />
    </>
  );
}

