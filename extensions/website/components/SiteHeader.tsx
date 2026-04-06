"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

interface SearchEntry {
  slug: string;
  href: string;
  title: string;
  directory: string;
}

interface SiteHeaderProps {
  entries: SearchEntry[];
}

export function SiteHeader({ entries }: SiteHeaderProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const deferred = useDeferredValue(query.trim().toLowerCase());

  const results = deferred
    ? entries
        .filter((e) => e.title.toLowerCase().includes(deferred) || e.slug.includes(deferred))
        .slice(0, 8)
    : [];

  return (
    <header className="sticky top-4 z-50">
      <div className="surface mx-auto flex max-w-7xl items-center gap-4 rounded-[2rem] px-4 py-3 sm:px-5">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[35%_65%_55%_45%_/_40%_35%_65%_60%] bg-[color:var(--accent)] font-serif text-lg font-semibold text-[color:var(--accent-contrast)] shadow-[var(--shadow-soft)]">
            M
          </span>
          <span className="hidden font-serif text-xl leading-none tracking-[-0.04em] text-[color:var(--foreground)] sm:block">
            MyWiki
          </span>
        </Link>

        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => deferred && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            placeholder="Search entries..."
            className="h-10 w-full max-w-md rounded-full border border-[color:var(--border)] bg-[color:var(--surface-card)] px-4 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--accent-soft)]"
            type="search"
          />
          {open && results.length > 0 && (
            <div className="surface absolute left-0 top-[calc(100%+0.5rem)] w-full max-w-md rounded-2xl p-2 shadow-[var(--shadow-float)]">
              {results.map((entry) => (
                <Link
                  key={entry.slug}
                  href={entry.href}
                  className="block rounded-xl px-3 py-2 text-sm transition hover:bg-[color:var(--accent-soft)]"
                >
                  <span className="text-[color:var(--foreground)]">{entry.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <nav className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-card)] px-4 py-2 text-sm font-medium transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)]"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
