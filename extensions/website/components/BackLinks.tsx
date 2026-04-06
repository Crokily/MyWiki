import Link from "next/link";

import type { WikiEntry } from "@/lib/content";

interface BackLinksProps {
  pages: WikiEntry[];
}

export function BackLinksSidebar({ pages }: BackLinksProps) {
  if (pages.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">
        反向引用
        <span className="ml-2 font-normal">{pages.length}</span>
      </p>
      <div className="mt-3 space-y-1.5">
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={page.href}
            className="block rounded-xl px-3 py-2 text-sm text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
          >
            {page.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
