import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Companies } from "@/components/sections/Companies";
import { PORTFOLIO } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "사례 — 기업·학교 AI 교육",
  description:
    "리즈워드가 진행한 부트캠프·스킬트레이닝 사례. 성균관대학교, 도미노피자, 플랜티넷, TJ미디어 등.",
  alternates: { canonical: "/cases" },
};

export default function CasesPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-[1440px] px-[var(--pad-x)] py-24 md:py-32">
        <nav className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
          <Link href="/" className="hover:text-fg">HOME</Link> / CASES
        </nav>
        <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          진행했던 <em className="text-accent">교육들</em>.
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-relaxed text-fg-2">
          대학과 기업에서 진행한 부트캠프·스킬트레이닝 사례입니다. 각 사례의 현장 사진과 결과물은 문의 시 공유드립니다.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {PORTFOLIO.map((it) => (
            <Link
              key={it.id}
              href={`/cases/${it.id}`}
              className="group border border-line-soft bg-card transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-bg-2">
                <Image
                  src={it.image}
                  alt={`${it.client} · ${it.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 bg-bg/90 px-3 py-1 font-en text-xs uppercase tracking-[0.18em] text-fg-2">
                  {it.num}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-fg-2">{it.client}</span>
                  <span className="font-en uppercase tracking-[0.18em] text-fg-3">{it.date}</span>
                </div>
                <h2 className="mt-3 text-lg font-bold leading-snug tracking-tight">{it.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Companies />
      <Footer />
    </>
  );
}
