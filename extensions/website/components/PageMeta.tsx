import Link from "next/link";

import type { WikiEntry } from "@/lib/content";
import { getPageBySlug, tagToHref } from "@/lib/content";
import { DIRECTORY_LABELS, formatDate } from "@/lib/site";
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
    <Link href={`/${parsed.slug}`} className="hover:text-[color:var(--accent-strong)]">
      {label}
    </Link>
  );
}

export function PageMetaSidebar({ page }: PageMetaProps) {
  const { frontmatter } = page;
  const classification = frontmatter.type || frontmatter.kind || page.directory;
  const tags = page.tags;
  const sourceLinks = Array.isArray(frontmatter.sources) ? frontmatter.sources.filter((v): v is string => typeof v === "string") : [];
  const touches = Array.isArray(frontmatter.touches) ? frontmatter.touches.filter((v): v is string => typeof v === "string") : [];

  const timeline = [
    frontmatter.updated ? `更新 ${formatDate(frontmatter.updated)}` : null,
    frontmatter.created ? `创建 ${formatDate(frontmatter.created)}` : null,
    typeof frontmatter.ingested === "string" ? `摄入 ${formatDate(frontmatter.ingested)}` : null,
  ].filter((item): item is string => Boolean(item));

  return (
    <div className="space-y-5">
      {/* Classification & Directory */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">信息</p>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[color:var(--muted)]">类型</span>
            <span className="pill-chip pill-chip-primary text-xs">{classification}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[color:var(--muted)]">目录</span>
            <span className="text-[color:var(--foreground)]">{DIRECTORY_LABELS[page.directory]}</span>
          </div>
          {timeline.map((item) => (
            <div key={item} className="text-xs text-[color:var(--muted)]">{item}</div>
          ))}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">标签</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={tagToHref(tag)}
                className="tag-chip rounded-full px-2.5 py-1 text-xs transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)]"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sources */}
      {sourceLinks.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">来源</p>
          <div className="mt-3 space-y-1.5">
            {sourceLinks.map((src) => (
              <div key={src} className="text-sm">{renderLinkLikeValue(src)}</div>
            ))}
          </div>
        </div>
      )}

      {/* Touches */}
      {touches.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">关联</p>
          <div className="mt-3 space-y-1.5">
            {touches.map((t) => (
              <div key={t} className="text-sm">{renderLinkLikeValue(t)}</div>
            ))}
          </div>
        </div>
      )}

      {/* URL */}
      {typeof frontmatter.url === "string" && (
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">链接</p>
          <a href={frontmatter.url} className="mt-2 block break-all text-sm text-[color:var(--accent-strong)] underline" target="_blank" rel="noreferrer">
            {frontmatter.url}
          </a>
        </div>
      )}

      {/* Author */}
      {typeof frontmatter.author === "string" && (
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">作者</p>
          <div className="mt-2 text-sm">{renderLinkLikeValue(frontmatter.author)}</div>
        </div>
      )}
    </div>
  );
}
