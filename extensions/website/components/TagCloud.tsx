import Link from "next/link";

import type { TagGroup } from "@/lib/content";
import { tagToHref } from "@/lib/content";

interface TagCloudProps {
  tags: TagGroup[];
}

export function TagCloud({ tags }: TagCloudProps) {
  if (tags.length === 0) {
    return <p className="text-sm text-[color:var(--muted)]">No tags yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.tag}
          href={tagToHref(tag.tag)}
          className="tag-chip rounded-md px-2.5 py-1 text-xs transition"
        >
          {tag.tag}
          <span className="ml-1.5 text-[color:var(--muted)]">{tag.count}</span>
        </Link>
      ))}
    </div>
  );
}
