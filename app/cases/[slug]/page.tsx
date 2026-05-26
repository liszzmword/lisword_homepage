import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { PORTFOLIO } from "@/content/portfolio";

export function generateStaticParams() {
  return PORTFOLIO.map((p) => ({ slug: p.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = PORTFOLIO.find((p) => p.id === params.slug);
  if (!c) return {};
  return {
    title: `${c.client} · ${c.title}`,
    description: `${c.client}에서 진행한 ${c.title} (${c.date}) 사례. 리즈워드 LISWORD가 설계·진행한 AI 교육 프로그램.`,
    alternates: { canonical: `/cases/${c.id}` },
    openGraph: { images: [c.image] },
  };
}

export default function CaseDetailPage({ params }: { params: { slug: string } }) {
  const c = PORTFOLIO.find((p) => p.id === params.slug);
  if (!c) notFound();

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-[1100px] px-[var(--pad-x)] py-24 md:py-32">
        <nav className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
          <Link href="/" className="hover:text-fg">HOME</Link> /{" "}
          <Link href="/cases" className="hover:text-fg">CASES</Link> / {c.num}
        </nav>
        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4">
          <span className="font-en text-sm uppercase tracking-[0.18em] text-fg-2">
            {c.client}
          </span>
          <span className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">{c.date}</span>
        </div>
        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          {c.title}
        </h1>

        <div className="relative mt-12 aspect-[4/3] overflow-hidden bg-bg-2 md:aspect-[16/9]">
          <Image src={c.image} alt={`${c.client} · ${c.title}`} fill priority className="object-cover" />
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">개요</h2>
            <p className="mt-5 text-lg leading-relaxed text-fg-2">
              {c.client}에서 진행한 <strong>{c.title}</strong> 사례입니다.
              리즈워드 LISWORD가 커리큘럼을 설계하고 직접 진행했으며, 자사 데이터·자사 문제를 중심에 두고 운영했습니다.
            </p>
            <p className="mt-5 text-base leading-relaxed text-fg-2">
              상세한 진행 내용·결과물·수강생 후기는 비공개 정책상 문의 시 별도로 공유드립니다.
              유사한 형태의 교육을 검토 중이라면 아래 상담 신청을 이용해주세요.
            </p>
          </div>
          <aside className="border border-line-soft bg-bg-2 p-8">
            <h3 className="text-lg font-bold tracking-tight">유사한 교육이 필요하신가요?</h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-2">
              조직 상황에 맞춰 맞춤 설계해드립니다.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-3 bg-accent-ink px-5 py-3 text-sm font-semibold text-accent"
            >
              상담 신청 <span>→</span>
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
