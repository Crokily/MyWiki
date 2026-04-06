import Link from "next/link";

import type { WikiEntry } from "@/lib/content";
import { formatDate, getPageBySlug, tagToHref } from "@/lib/content";
import { parseWikiLink } from "@/lib/wikilinks";

interface PageMetaProps {
  page: WikiEntry;
}

function renderLinkLikeValue(value: string) {
  const parsed = parseWikiLink(value);

  if (!parsed) {
    return value;
  }

  const target = getPageBySlug(parsed.slug);
  const label = parsed.text || target?.title || parsed.slug;

  return (
    <Link href={`/${parsed.slug}`} className="hover:text-[color:var(--accent)]">
      {label}
    </Link>
  );
}

function renderStringList(values: string[]) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span key={value} className="rounded-full border border-[color:var(--border)] px-3 py-1 text-sm">
          {renderLinkLikeValue(value)}
        </span>
      ))}
    </div>
  );
}

export function PageMeta({ page }: PageMetaProps) {
  const { frontmatter } = page;
  const classification = frontmatter.type || frontmatter.kind || page.directory;
  const tags = page.tags;
  const sourceLinks = Array.isArray(frontmatter.sources) ? frontmatter.sources.filter((value): value is string => typeof value === "string") : [];
  const touches = Array.isArray(frontmatter.touches) ? frontmatter.touches.filter((value): value is string => typeof value === "string") : [];

  return (
    <section className="surface rounded-[1.75rem] p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-sm font-medium text-[color:var(--accent)]">
          {classification}
        </span>
        <span className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted)]">{page.directory}</span>
      </div>

      <dl className="mt-5 grid gap-4 text-sm md:grid-cols-2">
        <div>
          <dt className="mb-2 text-[color:var(--muted)]">Tags</dt>
          <dd className="flex flex-wrap gap-2">
            {tags.length === 0 ? (
              <span>暂无</span>
            ) : (
              tags.map((tag) => (
                <Link
                  key={tag}
                  href={tagToHref(tag)}
                  className="tag-chip rounded-full px-3 py-1 transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                >
                  #{tag}
                </Link>
              ))
            )}
          </dd>
        </div>

        <div>
          <dt className="mb-2 text-[color:var(--muted)]">Dates</dt>
          <dd className="space-y-1">
            {frontmatter.updated ? <div>更新于 {formatDate(frontmatter.updated)}</div> : null}
            {frontmatter.created ? <div>创建于 {formatDate(frontmatter.created)}</div> : null}
            {typeof frontmatter.ingested === "string" ? <div>摄入于 {formatDate(frontmatter.ingested)}</div> : null}
            {typeof frontmatter.published === "string" ? <div>发布于 {formatDate(frontmatter.published)}</div> : null}
            {typeof frontmatter.asked === "string" ? <div>记录于 {formatDate(frontmatter.asked)}</div> : null}
          </dd>
        </div>

        {sourceLinks.length > 0 ? (
          <div>
            <dt className="mb-2 text-[color:var(--muted)]">Sources</dt>
            <dd>{renderStringList(sourceLinks)}</dd>
          </div>
        ) : null}

        {touches.length > 0 ? (
          <div>
            <dt className="mb-2 text-[color:var(--muted)]">Touches</dt>
            <dd>{renderStringList(touches)}</dd>
          </div>
        ) : null}

        {typeof frontmatter.author === "string" ? (
          <div>
            <dt className="mb-2 text-[color:var(--muted)]">Author</dt>
            <dd>{renderLinkLikeValue(frontmatter.author)}</dd>
          </div>
        ) : null}

        {typeof frontmatter.raw === "string" ? (
          <div>
            <dt className="mb-2 text-[color:var(--muted)]">Raw</dt>
            <dd>{renderLinkLikeValue(frontmatter.raw)}</dd>
          </div>
        ) : null}

        {typeof frontmatter.url === "string" ? (
          <div className="md:col-span-2">
            <dt className="mb-2 text-[color:var(--muted)]">URL</dt>
            <dd>
              <a href={frontmatter.url} className="break-all text-[color:var(--accent)] underline" target="_blank" rel="noreferrer">
                {frontmatter.url}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

