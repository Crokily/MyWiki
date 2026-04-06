import Link from "next/link";

import type { TagGroup } from "@/lib/content";
import { getRootTagGroups, tagToHref } from "@/lib/content";

interface SidebarContentProps {
  tags: TagGroup[];
}

function SidebarContent({ tags }: SidebarContentProps) {
  const groups = getRootTagGroups();

  return (
    <div className="flex h-full flex-col gap-8">
      <div>
        <Link href="/" className="font-serif text-3xl tracking-tight">
          MyWiki
        </Link>
        <p className="mt-3 text-sm text-[color:var(--muted)]">
          由 markdown 驱动的静态知识库，直接读取 wiki 根目录内容构建。
        </p>
      </div>

      <nav className="space-y-3 text-sm">
        <Link href="/" className="block rounded-xl px-3 py-2 transition hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--accent)]">
          Home
        </Link>
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Tag Categories</h2>
          <span className="text-xs text-[color:var(--muted)]">{tags.length}</span>
        </div>

        <div className="space-y-5">
          {groups.map((group) => (
            <section key={group.root}>
              <h3 className="mb-2 text-sm font-medium">{group.root}</h3>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => (
                  <Link
                    key={tag.tag}
                    href={tagToHref(tag.tag)}
                    className="tag-chip rounded-full px-2.5 py-1 text-xs transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                  >
                    {tag.tag.replace(`${group.root}/`, "")}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ tags }: SidebarContentProps) {
  return (
    <>
      <aside className="surface hidden lg:sticky lg:top-6 lg:flex lg:h-[calc(100vh-3rem)] lg:w-80 lg:flex-col lg:rounded-[2rem] lg:p-6">
        <SidebarContent tags={tags} />
      </aside>

      <details className="surface rounded-[1.5rem] p-4 lg:hidden">
        <summary className="cursor-pointer list-none text-sm font-medium">
          <span className="flex items-center justify-between gap-4">
            <span>MyWiki Navigation</span>
            <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Open</span>
          </span>
        </summary>
        <div className="mt-4 border-t border-[color:var(--border)] pt-4">
          <SidebarContent tags={tags} />
        </div>
      </details>
    </>
  );
}

