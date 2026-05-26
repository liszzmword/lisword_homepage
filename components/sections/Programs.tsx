import Link from "next/link";

export function Programs() {
  return (
    <section id="programs" className="mx-auto w-full max-w-[1440px] px-[var(--pad-x)] py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <div className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
            PROGRAMS / 01
          </div>
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            두 갈래의 <em className="text-accent">AI 교육</em>.
          </h2>
        </div>
        <p className="text-base leading-relaxed text-fg-2">
          조직 단위로 문제를 해결하는 부트캠프와, 실무자가 빠르게 무장하는 스킬트레이닝.
          어떤 상황이든 맞춤 설계로 풀어드립니다.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <article className="flex flex-col gap-6 border border-line-soft bg-card p-10">
          <span className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
            01 — BOOTCAMP
          </span>
          <h3 className="text-3xl font-bold tracking-tight">
            AI <em className="text-accent">부트캠프</em>
          </h3>
          <p className="text-fg-2 leading-relaxed">
            기업과 학교를 위한 실전 문제해결 프로그램. 학교 과정은 창업·문제해결을 동시에 진행합니다.
          </p>
          <div className="space-y-3 border-t border-line-soft pt-6">
            {[
              ["기업 부트캠프", "2 – 12 WEEKS"],
              ["학교 부트캠프 (창업 + 문제해결)", "1 SEMESTER"],
              ["커스텀 트랙 설계", "ON DEMAND"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm">
                <span className="font-medium">{k}</span>
                <span className="font-en text-xs uppercase tracking-widest text-fg-3">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-6">
            <Link
              href="/programs/ai-bootcamp"
              className="inline-flex items-center gap-3 bg-accent-ink px-5 py-3 text-sm font-semibold text-accent"
            >
              자세히 보기 <span>→</span>
            </Link>
          </div>
        </article>

        <article className="flex flex-col gap-6 border border-line-soft bg-card p-10">
          <span className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
            02 — SKILL TRAINING
          </span>
          <h3 className="text-3xl font-bold tracking-tight">
            스킬<em className="text-accent">트레이닝</em>
          </h3>
          <p className="text-fg-2 leading-relaxed">
            네 가지 핵심 트랙. 단기 집중형, 실무 적용 즉시 가능. 기업 사내 교육과 공개 과정 모두 운영합니다.
          </p>
          <div className="space-y-3 border-t border-line-soft pt-6">
            {[
              ["AI 리터러시", "TRACK 01"],
              ["데이터 리터러시", "TRACK 02"],
              ["RAG 개발", "TRACK 03"],
              ["바이브 코딩", "TRACK 04"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm">
                <span className="font-medium">{k}</span>
                <span className="font-en text-xs uppercase tracking-widest text-fg-3">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-6">
            <Link
              href="/programs/skill-training"
              className="inline-flex items-center gap-3 border border-line px-5 py-3 text-sm font-semibold text-fg"
            >
              자세히 보기 <span>→</span>
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
