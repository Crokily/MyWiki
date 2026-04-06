import Link from "next/link";

export default function NotFound() {
  return (
    <section className="surface rounded-[2rem] p-8">
      <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--muted)]">404</p>
      <h1 className="mt-4 font-serif text-4xl">页面不存在</h1>
      <p className="mt-4 max-w-xl text-[color:var(--muted)]">
        这个 slug 或标签没有对应的静态页面。请回到首页，或者从侧边栏标签继续导航。
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
      >
        返回首页
      </Link>
    </section>
  );
}
