export interface WikiLinkMatch {
  slug: string;
  text?: string;
}

const INLINE_WIKILINK_PATTERN = /\[\[([^[\]|]+)(?:\|([^[\]]+))?\]\]/g;
const FULL_WIKILINK_PATTERN = /^\[\[([^[\]|]+)(?:\|([^[\]]+))?\]\]$/;

export function parseWikiLink(value: string): WikiLinkMatch | null {
  const match = FULL_WIKILINK_PATTERN.exec(value.trim());

  if (!match) {
    return null;
  }

  return {
    slug: match[1].trim(),
    text: match[2]?.trim(),
  };
}

export function extractWikiLinksFromText(value: string): WikiLinkMatch[] {
  const matches: WikiLinkMatch[] = [];

  for (const match of value.matchAll(INLINE_WIKILINK_PATTERN)) {
    const slug = match[1]?.trim();

    if (!slug) {
      continue;
    }

    matches.push({
      slug,
      text: match[2]?.trim(),
    });
  }

  return matches;
}

