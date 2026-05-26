import Link from "next/link";

const TICKER = [
  "AI BOOTCAMP",
  "SKILL TRAINING",
  "AI 리터러시",
  "DATA LITERACY",
  "RAG DEVELOPMENT",
  "VIBE CODING",
  "창업 · 문제해결",
  "기업 · 학교",
];

export function Hero() {
  return (
    <section id="top" className="mx-auto w-full max-w-[1440px] px-[var(--pad-x)] pb-16 pt-24 md:pb-24 md:pt-32">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <div className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
            AI EDUCATION · EST. SUNGKYUNKWAN
          </div>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-[clamp(3rem,7vw,7rem)]">
            <span className="block">AI로 푸는</span>
            <span className="block">
              <em className="text-accent">진짜 문제.</em>
            </span>
          </h1>
        </div>
        <div>
          <p className="text-lg leading-relaxed text-fg-2 md:text-xl">
            이론 말고 현장. 부트캠프와 스킬트레이닝으로 기업·학교의 실제 문제를 AI로 해결합니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-accent-ink px-6 py-4 text-sm font-semibold text-accent transition-transform hover:-translate-y-0.5"
            >
              교육 문의하기 <span>→</span>
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center gap-3 border border-line px-6 py-4 text-sm font-semibold text-fg transition-transform hover:-translate-y-0.5"
            >
              프로그램 보기
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16 overflow-hidden border-y border-line-soft">
        <div className="flex w-max gap-12 whitespace-nowrap py-5 animate-tick">
          {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="font-en text-sm uppercase tracking-[0.2em] text-fg-2">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
