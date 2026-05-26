import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { SKILL_TRACKS } from "@/content/skill-tracks";

export const metadata: Metadata = {
  title: "스킬트레이닝 — 네 가지 트랙",
  description:
    "AI 리터러시, 데이터 리터러시, RAG 개발, 바이브 코딩 — 단기 집중형, 실무 적용 즉시 가능. 사내 교육·공개 과정 모두 운영합니다.",
  alternates: { canonical: "/programs/skill-training" },
};

export default function SkillTrainingPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-[1440px] px-[var(--pad-x)] py-24 md:py-32">
        <nav className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
          <Link href="/" className="hover:text-fg">HOME</Link> /{" "}
          <Link href="/programs" className="hover:text-fg">PROGRAMS</Link> / SKILL TRAINING
        </nav>
        <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          스킬<em className="text-accent">트레이닝</em>.
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-relaxed text-fg-2">
          네 가지 핵심 트랙으로 임직원이 AI를 실무에 바로 쓸 수 있도록 만듭니다.
          단기 집중형, 사내 교육과 공개 과정 모두 운영.
        </p>

        <div className="mt-16 grid gap-px bg-line-soft md:grid-cols-2">
          {SKILL_TRACKS.map((t) => (
            <Link
              key={t.slug}
              href={`/programs/skill-training/${t.slug}`}
              className="group flex flex-col gap-5 bg-bg p-10 transition-colors hover:bg-bg-2"
            >
              <span className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
                TRACK {t.num} · {t.audience}
              </span>
              <h2 className="text-3xl font-bold tracking-tight">{t.title}</h2>
              <p className="text-base leading-relaxed text-fg-2">{t.shortDesc}</p>
              <span className="mt-auto font-en text-xs uppercase tracking-[0.18em] text-accent">
                자세히 보기 →
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
