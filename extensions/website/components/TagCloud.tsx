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
      {tags.map((tag, index) => {
        const scale = tag.count / maxCount;
        const fontSize = 0.88 + scale * 0.36;
        const radiusClass =
          index % 3 === 0
            ? "rounded-[999px_999px_999px_999px]"
            : index % 3 === 1
              ? "rounded-[999px_999px_999px_1.4rem]"
              : "rounded-[1.4rem_999px_999px_999px]";

        return (
          <Link
            key={tag.tag}
            href={tagToHref(tag.tag)}
            className={`tag-chip inline-flex items-center gap-2 px-4 py-2 text-sm transition duration-300 hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)] ${radiusClass}`}
            style={{ fontSize: `${fontSize}rem` }}
          >
            <span>#{tag.tag}</span>
            <span className="text-xs text-[color:var(--muted)]">{tag.count}</span>
          </Link>
        );
      })}
    </div>
  );
}
