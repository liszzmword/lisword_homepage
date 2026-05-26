import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "AI 부트캠프 — 기업·학교 맞춤",
  description:
    "기업 AI 부트캠프(2-12주)와 한 학기 대학 AI 부트캠프. 자사 데이터·자사 문제로 진행하는 실전 문제해결 프로그램.",
  alternates: { canonical: "/programs/ai-bootcamp" },
};

const COURSE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "AI 부트캠프",
  description:
    "기업과 학교를 위한 실전 문제해결 AI 교육 프로그램. 자사 데이터·자사 문제로 진행합니다.",
  provider: {
    "@type": "EducationalOrganization",
    name: "리즈워드 LISWORD",
    sameAs: "https://lisword.co.kr",
  },
  hasCourseInstance: [
    {
      "@type": "CourseInstance",
      name: "기업 AI 부트캠프",
      courseMode: "onsite",
      courseWorkload: "P2W/P12W",
    },
    {
      "@type": "CourseInstance",
      name: "학교 AI 부트캠프",
      courseMode: "onsite",
      courseWorkload: "P1Y",
    },
  ],
};

export default function AiBootcampPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(COURSE_JSONLD) }}
      />
      <Nav />
      <main className="mx-auto w-full max-w-[1440px] px-[var(--pad-x)] py-24 md:py-32">
        <nav className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
          <Link href="/" className="hover:text-fg">
            HOME
          </Link>{" "}
          /{" "}
          <Link href="/programs" className="hover:text-fg">
            PROGRAMS
          </Link>{" "}
          / AI BOOTCAMP
        </nav>
        <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          AI <em className="text-accent">부트캠프</em>.
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-relaxed text-fg-2">
          리즈워드의 AI 부트캠프는 임직원과 학생이 <strong>자사 데이터·자사 문제</strong>로
          AI를 도구로 쓰는 능력을 키우는 실전 프로그램입니다. 이론 강의가 아니라 현장 적용 결과물을 만듭니다.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <article className="border border-line-soft bg-card p-10">
            <span className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
              TRACK 01 — CORPORATE
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight">기업 부트캠프</h2>
            <p className="mt-4 text-base leading-relaxed text-fg-2">
              임직원이 자사 업무 데이터와 실제 과제를 가지고 와서 AI로 해결합니다. 교육이 끝나면 결과물이 바로 업무에 적용됩니다.
            </p>
            <ul className="mt-6 space-y-3 border-t border-line-soft pt-6 text-sm">
              <li className="flex justify-between">
                <span>기간</span>
                <span className="font-en text-fg-3">2 – 12 WEEKS</span>
              </li>
              <li className="flex justify-between">
                <span>형태</span>
                <span className="font-en text-fg-3">ONSITE · CUSTOMIZED</span>
              </li>
              <li className="flex justify-between">
                <span>대상</span>
                <span className="font-en text-fg-3">10 – 50 명</span>
              </li>
            </ul>
          </article>

          <article className="border border-line-soft bg-card p-10">
            <span className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
              TRACK 02 — UNIVERSITY
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight">학교 부트캠프</h2>
            <p className="mt-4 text-base leading-relaxed text-fg-2">
              대학에서 한 학기 단위로 진행되는 창업·문제해결 통합 트랙. 학생이 AI로 자기 문제를 정의하고 풉니다. 창업으로 이어진 팀 다수.
            </p>
            <ul className="mt-6 space-y-3 border-t border-line-soft pt-6 text-sm">
              <li className="flex justify-between">
                <span>기간</span>
                <span className="font-en text-fg-3">1 SEMESTER</span>
              </li>
              <li className="flex justify-between">
                <span>형태</span>
                <span className="font-en text-fg-3">CREDIT · ELECTIVE</span>
              </li>
              <li className="flex justify-between">
                <span>주요 진행</span>
                <span className="font-en text-fg-3">SKKU · KNU</span>
              </li>
            </ul>
          </article>
        </div>

        <div className="mt-16 border border-line-soft bg-bg-2 p-10">
          <h3 className="text-lg font-bold tracking-tight">TL;DR</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-fg-2">
            <li>AI 부트캠프는 임직원·학생이 자사 데이터로 실제 문제를 푸는 실전 교육입니다.</li>
            <li>기업 과정은 2-12주, 학교 과정은 1학기 단위로 진행됩니다.</li>
            <li>이론이 아니라 적용 결과물을 만드는 과정 중심 구성입니다.</li>
            <li>성균관대, 강원대, 도미노피자, 플랜티넷 등에서 진행 사례가 있습니다.</li>
            <li>커리큘럼은 자사 데이터·문제 기반으로 맞춤 설계합니다.</li>
          </ul>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-accent-ink px-8 py-5 text-base font-bold text-accent transition-transform hover:-translate-y-0.5"
          >
            상담 신청하기 <span>→</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
