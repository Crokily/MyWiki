import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export { formatDate } from "@/lib/site";
import { extractWikiLinksFromText } from "@/lib/wikilinks";

export const CONTENT_DIRECTORIES = ["pages", "sources", "maps", "queries"] as const;

export type ContentDirectory = (typeof CONTENT_DIRECTORIES)[number];

export interface WikiFrontmatter {
  title?: string;
  tags?: string[];
  aliases?: string[];
  type?: string;
  kind?: string;
  created?: string;
  updated?: string;
  sources?: string[];
  [key: string]: unknown;
}

export interface WikiEntry {
  slug: string;
  directory: ContentDirectory;
  href: string;
  title: string;
  body: string;
  excerpt: string;
  tags: string[];
  links: string[];
  frontmatter: WikiFrontmatter;
  sortDate?: string;
}

export interface TagGroup {
  tag: string;
  pages: WikiEntry[];
  count: number;
  segments: string[];
}

const WIKI_ROOT = path.resolve(process.cwd(), "../..");

let cachedEntries: WikiEntry[] | null = null;

function getDirectoryPath(directory: ContentDirectory) {
  return path.join(WIKI_ROOT, directory);
}

function normalizeFrontmatterValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeFrontmatterValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, normalizeFrontmatterValue(entryValue)]),
    );
  }

  return value;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function collectLinksFromValue(value: unknown, links: Set<string>) {
  if (typeof value === "string") {
    for (const match of extractWikiLinksFromText(value)) {
      links.add(match.slug);
    }

    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectLinksFromValue(item, links);
    }

    return;
  }

  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      collectLinksFromValue(item, links);
    }
  }
}

function createExcerpt(body: string) {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function getSortDate(frontmatter: WikiFrontmatter) {
  const candidates = [
    frontmatter.updated,
    frontmatter.created,
    typeof frontmatter.ingested === "string" ? frontmatter.ingested : undefined,
    typeof frontmatter.published === "string" ? frontmatter.published : undefined,
    typeof frontmatter.asked === "string" ? frontmatter.asked : undefined,
  ];

  return candidates.find(Boolean);
}

function loadEntries(): WikiEntry[] {
  const entries: WikiEntry[] = [];

  for (const directory of CONTENT_DIRECTORIES) {
    const directoryPath = getDirectoryPath(directory);

    if (!fs.existsSync(directoryPath)) {
      continue;
    }

    const filenames = fs
      .readdirSync(directoryPath)
      .filter((name) => name.endsWith(".md"))
      .sort((left, right) => left.localeCompare(right));

    for (const filename of filenames) {
      const fullPath = path.join(directoryPath, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const parsed = matter(fileContents);
      const slug = path.basename(filename, ".md");
      const frontmatter = normalizeFrontmatterValue(parsed.data) as WikiFrontmatter;
      const links = new Set<string>();

      collectLinksFromValue(frontmatter, links);
      collectLinksFromValue(parsed.content, links);

      entries.push({
        slug,
        directory,
        href: `/${slug}`,
        title: frontmatter.title?.trim() || slug,
        body: parsed.content.trim(),
        excerpt: createExcerpt(parsed.content),
        tags: normalizeStringArray(frontmatter.tags),
        links: Array.from(links),
        frontmatter,
        sortDate: getSortDate(frontmatter),
      });
    }
  }

  return entries;
}

export function getAllPages(): WikiEntry[] {
  if (!cachedEntries) {
    cachedEntries = loadEntries();
  }

  return cachedEntries;
}

export function getPageBySlug(slug: string): WikiEntry | undefined {
  return getAllPages().find((entry) => entry.slug === slug);
}

export function getAllTags(): TagGroup[] {
  const tagMap = new Map<string, WikiEntry[]>();

  for (const entry of getAllPages()) {
    for (const tag of entry.tags) {
      const list = tagMap.get(tag) ?? [];
      list.push(entry);
      tagMap.set(tag, list);
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, pages]) => ({
      tag,
      pages: pages.sort((left, right) => left.title.localeCompare(right.title, "zh-Hans-CN")),
      count: pages.length,
      segments: tag.split("/"),
    }))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.tag.localeCompare(right.tag, "zh-Hans-CN");
    });
}

export function getPagesByTag(tag: string): WikiEntry[] {
  return getAllPages()
    .filter((entry) => entry.tags.includes(tag))
    .sort((left, right) => left.title.localeCompare(right.title, "zh-Hans-CN"));
}

export function getBacklinks(slug: string): WikiEntry[] {
  return getAllPages()
    .filter((entry) => entry.slug !== slug && entry.links.includes(slug))
    .sort((left, right) => left.title.localeCompare(right.title, "zh-Hans-CN"));
}

export function getDirectoryCounts() {
  return CONTENT_DIRECTORIES.reduce<Record<ContentDirectory, number>>((counts, directory) => {
    counts[directory] = getAllPages().filter((entry) => entry.directory === directory).length;
    return counts;
  }, {
    pages: 0,
    sources: 0,
    maps: 0,
    queries: 0,
  });
}

export function getRecentPages(limit = 6) {
  return [...getAllPages()]
    .sort((left, right) => (right.sortDate ?? "").localeCompare(left.sortDate ?? ""))
    .slice(0, limit);
}

export function tagToHref(tag: string) {
  return `/tags/${tag.split("/").map((segment) => encodeURIComponent(segment)).join("/")}`;
}

export function getRootTagGroups() {
  const grouped = new Map<string, TagGroup[]>();

  for (const tag of getAllTags()) {
    const root = tag.segments[0];
    const list = grouped.get(root) ?? [];
    list.push(tag);
    grouped.set(root, list);
  }

  return Array.from(grouped.entries())
    .map(([root, tags]) => ({
      root,
      tags,
    }))
    .sort((left, right) => left.root.localeCompare(right.root, "zh-Hans-CN"));
}
