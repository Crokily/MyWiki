import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

import { getAllPages } from "@/lib/content";
import { extractWikiLinksFromText } from "@/lib/wikilinks";

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface MarkdownNode {
  type: string;
  value?: string;
  url?: string;
  data?: {
    hProperties?: Record<string, unknown>;
  };
  children?: MarkdownNode[];
}

function textToNodes(value: string, resolveTitle: (slug: string) => string | undefined): MarkdownNode[] {
  if (!value.includes("[[")) {
    return [{ type: "text", value }];
  }

  const nodes: MarkdownNode[] = [];
  let cursor = 0;

  for (const match of value.matchAll(/\[\[([^[\]|]+)(?:\|([^[\]]+))?\]\]/g)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;

    if (start > cursor) {
      nodes.push({
        type: "text",
        value: value.slice(cursor, start),
      });
    }

    const slug = match[1]?.trim();

    if (!slug) {
      nodes.push({ type: "text", value: match[0] });
      cursor = end;
      continue;
    }

    const label = match[2]?.trim() || resolveTitle(slug) || slug;

    nodes.push({
      type: "link",
      url: `/${slug}`,
      data: {
        hProperties: {
          className: ["wikilink"],
        },
      },
      children: [{ type: "text", value: label }],
    });

    cursor = end;
  }

  if (cursor < value.length) {
    nodes.push({
      type: "text",
      value: value.slice(cursor),
    });
  }

  return nodes;
}

function transformNode(node: MarkdownNode, resolveTitle: (slug: string) => string | undefined) {
  if (!node.children?.length) {
    return;
  }

  const nextChildren: MarkdownNode[] = [];

  for (const child of node.children) {
    if (child.type === "text" && typeof child.value === "string" && extractWikiLinksFromText(child.value).length > 0) {
      nextChildren.push(...textToNodes(child.value, resolveTitle));
      continue;
    }

    transformNode(child, resolveTitle);
    nextChildren.push(child);
  }

  node.children = nextChildren;
}

function remarkWikiLinks() {
  const titleMap = new Map(getAllPages().map((entry) => [entry.slug, entry.title]));

  return (tree: MarkdownNode) => {
    transformNode(tree, (slug) => titleMap.get(slug));
  };
}

export async function renderMarkdown(content: string) {
  const rendered = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkWikiLinks)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return String(rendered);
}

export function extractHeadings(html: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const regex = /<h([23])\s+id="([^"]+)"[^>]*>(.*?)<\/h[23]>/gi;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const level = Number(match[1]) as 2 | 3;
    const id = match[2];
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    if (text) {
      headings.push({ id, text, level });
    }
  }

  return headings;
}

