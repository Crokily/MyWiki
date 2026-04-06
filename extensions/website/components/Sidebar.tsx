import Link from "next/link";

import type { TagGroup } from "@/lib/content";
import { getRootTagGroups, tagToHref } from "@/lib/content";

interface SidebarContentProps {
  tags: TagGroup[];
}

function SidebarContent({ tags }: SidebarContentProps) {
  const groups = getRootTagGroups();

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <Link href="/" className="text-xl font-semibold tracking-tight">
          MyWiki
        </Link>
        <p className="mt-1 text-xs text-[color:var(--muted)]">Personal Knowledge Base</p>
      </div>

      <nav className="space-y-0.5 text-sm">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-2.5 py-1.5 font-medium transition-colors hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--accent)]"
        >
          Home
        </Link>
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <h2 className="mb-2 px-2.5 text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">
          Tags
        </h2>

        <div className="space-y-4">
          {groups.map((group) => (
            <section key={group.root}>
              <h3 className="mb-1.5 px-2.5 text-xs font-semibold text-[color:var(--muted)]">{group.root}</h3>
              <div className="space-y-0.5">
                {group.tags.map((tag) => (
                  <Link
                    key={tag.tag}
                    href={tagToHref(tag.tag)}
                    className="flex items-center justify-between rounded-md px-2.5 py-1 text-sm transition-colors hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--accent)]"
                  >
                    <span>{tag.tag.replace(`${group.root}/`, "")}</span>
                    <span className="text-xs text-[color:var(--muted)]">{tag.count}</span>
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
      {/* Desktop sidebar */}
      <aside className="hidden lg:sticky lg:top-6 lg:flex lg:h-[calc(100vh-3rem)] lg:w-60 lg:shrink-0 lg:flex-col lg:rounded-lg lg:border lg:border-[color:var(--border)] lg:bg-[color:var(--panel)] lg:p-4">
        <SidebarContent tags={tags} />
      </aside>

      {/* Mobile navigation */}
      <details className="rounded-lg border border-[color:var(--border)] bg-[color:var(--panel)] p-3 lg:hidden">
        <summary className="cursor-pointer list-none text-sm font-medium">
          <span className="flex items-center justify-between gap-4">
            <span>MyWiki</span>
            <span className="text-xs text-[color:var(--muted)]">Menu</span>
          </span>
        </summary>
        <div className="mt-3 border-t border-[color:var(--border)] pt-3">
          <SidebarContent tags={tags} />
        </div>
      </details>
    </>
  );
}
