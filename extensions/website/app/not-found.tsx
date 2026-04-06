import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-6xl font-semibold text-[color:var(--muted)]">404</p>
      <h1 className="mt-4 text-xl font-medium">Page not found</h1>
      <p className="mt-2 text-sm text-[color:var(--muted)]">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-md bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-hover)]"
      >
        Back to home
      </Link>
    </div>
  );
}
