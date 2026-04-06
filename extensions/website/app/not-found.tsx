import Link from "next/link";

export default function NotFound() {
  return (
    <section className="surface rounded-[2.5rem] px-5 py-8 sm:px-7">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">404</p>
      <h1 className="mt-4 font-serif text-5xl leading-none tracking-[-0.05em]">Page Not Found</h1>
      <p className="mt-4 max-w-2xl text-[color:var(--muted)]">
        No matching entry was found. Try browsing from the home page or searching.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-[color:var(--accent-contrast)] transition hover:scale-[1.02] hover:bg-[color:var(--accent-strong)]"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
