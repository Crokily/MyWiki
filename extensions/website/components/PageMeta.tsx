import Link from "next/link";

import type { WikiEntry } from "@/lib/content";
import { formatDate, getPageBySlug } from "@/lib/content";
import { parseWikiLink } from "@/lib/wikilinks";

interface PageMetaProps {
  page: WikiEntry;
}

function renderLinkValue(value: string) {
  const parsed = parseWikiLink(value);

  if (!parsed) {
    return <span>{value}</span>;
  }

  const target = getPageBySlug(parsed.slug);
  const label = parsed.text || target?.title || parsed.slug;

  return (
    <Link href={`/${parsed.slug}`} className="text-[color:var(--accent)] hover:underline">
      {label}
    </Link>
  );
}

export function PageMeta({ page }: PageMetaProps) {
  const { frontmatter } = page;
  const sourceLinks = Array.isArray(frontmatter.sources)
    ? frontmatter.sources.filter((v): v is string => typeof v === "string")
    : [];
  const touches = Array.isArray(frontmatter.touches)
    ? frontmatter.touches.filter((v): v is string => typeof v === "string")
    : [];

  const hasExtra =
    sourceLinks.length > 0 ||
    touches.length > 0 ||
    typeof frontmatter.author === "string" ||
    typeof frontmatter.url === "string";

  if (!hasExtra) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[color:var(--muted)]">
      {typeof frontmatter.author === "string" ? (
        <span>{renderLinkValue(frontmatter.author)}</span>
      ) : null}

      {sourceLinks.length > 0 ? (
        <span className="flex items-center gap-1.5">
          <span>Sources:</span>
          {sourceLinks.map((s) => (
            <span key={s}>{renderLinkValue(s)}</span>
          ))}
        </span>
      ) : null}

      {touches.length > 0 ? (
        <span className="flex items-center gap-1.5">
          <span>Related:</span>
          {touches.map((t) => (
            <span key={t}>{renderLinkValue(t)}</span>
          ))}
        </span>
      ) : null}

      {typeof frontmatter.url === "string" ? (
        <a
          href={frontmatter.url}
          className="text-[color:var(--accent)] hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          External link
        </a>
      ) : null}
    </div>
  );
}
