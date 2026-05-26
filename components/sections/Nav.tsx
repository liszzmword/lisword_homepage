import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

const NAV_LINKS = [
  { href: "/programs", label: "교육" },
  { href: "/#youtube", label: "유튜브" },
  { href: "/cases", label: "사례" },
  { href: "/contact", label: "문의" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line-soft bg-bg/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-[var(--pad-x)] py-5">
        <Link href="/" className="flex items-center gap-3 font-bold tracking-tight">
          <LogoMark />
          <span>LISWORD</span>
        </Link>
        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-fg-2 transition-colors hover:text-fg"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="hidden bg-accent-ink px-5 py-3 text-sm font-semibold text-accent md:inline-flex"
        >
          교육 문의하기
        </Link>
      </div>
    </header>
  );
}
