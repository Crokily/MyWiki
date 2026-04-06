import Link from "next/link";

import type { TagGroup } from "@/lib/content";
import { tagToHref } from "@/lib/content";

interface TagCloudProps {
  tags: TagGroup[];
}

export function TagCloud({ tags }: TagCloudProps) {
  if (tags.length === 0) {
    return <p className="text-sm text-[color:var(--muted)]">暂无标签。</p>;
  }

  const maxCount = Math.max(...tags.map((tag) => tag.count));

  return (
    <div className="flex flex-wrap gap-3">
      {tags.map((tag) => {
        const scale = tag.count / maxCount;
        const fontSize = 0.9 + scale * 0.45;

        return (
          <Link
            key={tag.tag}
            href={tagToHref(tag.tag)}
            className="tag-chip rounded-full px-3 py-1.5 text-sm transition hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            style={{ fontSize: `${fontSize}rem` }}
          >
            #{tag.tag}
            <span className="ml-2 text-xs text-[color:var(--muted)]">{tag.count}</span>
          </Link>
        );
      })}
    </div>
  );
}

