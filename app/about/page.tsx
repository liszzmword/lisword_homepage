import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "이인섭 대표 — 성균관대 서비스디자인 박사",
  description:
    "리즈워드 LISWORD 대표 이인섭. 성균관대학교 서비스디자인 박사. AI 논문·특허 다수. 연구와 현장을 잇는 AI 교육 강사.",
  alternates: { canonical: "/about" },
};

const PERSON_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "이인섭",
  alternateName: "Lee Inseop",
  jobTitle: "AI 교육 강사 · 서비스디자인 박사",
  worksFor: { "@type": "EducationalOrganization", name: "리즈워드 LISWORD", url: "https://lisword.co.kr" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "성균관대학교" },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSONLD) }}
      />
      <Nav />
      <main className="mx-auto w-full max-w-[1440px] px-[var(--pad-x)] py-24 md:py-32">
        <nav className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
          <Link href="/" className="hover:text-fg">HOME</Link> / ABOUT
        </nav>
        <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          강의실 너머의 <em className="italic text-accent">실무자</em>.
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-relaxed text-fg-2">
          연구와 현장을 모두 거친 강사가 직접 설계하고 진행합니다.
        </p>

        <div className="mt-16 grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <div className="relative aspect-[3/4] bg-bg-2 p-10">
            <div className="font-bold leading-tight">
              이인섭
              <br />
              Lee Inseop
            </div>
            <div className="absolute bottom-5 right-5 font-en text-xs uppercase tracking-[0.18em] text-fg-3">
              PORTRAIT
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              이인섭 <em className="text-accent">Lee Inseop.</em>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-fg-2">
              성균관대학교 서비스디자인 박사 · 리즈워드 대표
              <br />
              AI 관련 논문 · 특허 다수 · 풍부한 실무 경험
            </p>
            <p className="mt-6 text-base leading-relaxed text-fg-2">
              서비스디자인 박사로서 사용자와 비즈니스 양쪽을 이해하고, 동시에 AI 연구와 실무 경험을 토대로 교육을 설계합니다.
              논문과 특허로 검증된 방법론을 강의실 안에 그대로 옮깁니다.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-px bg-line-soft">
              <div className="bg-bg p-6">
                <div className="font-en text-3xl font-bold tracking-tight md:text-4xl">
                  10<span className="text-base">+</span>
                </div>
                <div className="mt-2 text-xs text-fg-3">기업·학교 교육 진행</div>
              </div>
              <div className="bg-bg p-6">
                <div className="font-en text-3xl font-bold tracking-tight md:text-4xl">Ph.D</div>
                <div className="mt-2 text-xs text-fg-3">서비스디자인 박사</div>
              </div>
              <div className="bg-bg p-6">
                <div className="font-en text-3xl font-bold tracking-tight md:text-4xl">N</div>
                <div className="mt-2 text-xs text-fg-3">AI 논문·특허</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
