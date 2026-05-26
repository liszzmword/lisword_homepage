const REVIEWS = [
  {
    body:
      "이론 위주 강의를 예상했는데, 첫 시간부터 우리 회사의 실제 문제를 들고 와 풀게 했습니다. 교육이 끝난 다음 주부터 결과물이 업무에 적용됐어요.",
    name: "기업 인사·교육 담당자",
    role: "도미노피자 · AI 리터러시 과정",
  },
  {
    body:
      "학생들이 단순히 AI를 배우는 게 아니라, AI로 자기 문제를 정의하고 푸는 경험을 하게 됐습니다. 창업까지 이어진 팀도 있었어요.",
    name: "대학 산학협력 담당 교수",
    role: "성균관대학교 · 부트캠프",
  },
  {
    body:
      "비개발자였는데, 마지막 날엔 제가 직접 RAG 데모를 돌리고 있었어요. 어렵지 않게, 그러나 얕지 않게 가르치는 방식이 인상적이었습니다.",
    name: "마케팅팀 매니저",
    role: "플렌티넷 · 스킬트레이닝",
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="mx-auto w-full max-w-[1440px] px-[var(--pad-x)] py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <div className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
            REVIEWS / 05
          </div>
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            수강생들의 <em className="text-accent">이야기</em>.
          </h2>
        </div>
        <p className="text-base leading-relaxed text-fg-2">
          교육을 받은 분들이 직접 들려주는 이야기입니다.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <article key={i} className="flex flex-col gap-5 border border-line-soft bg-card p-8">
            <div className="font-en text-5xl leading-none text-accent">&ldquo;</div>
            <p className="text-base leading-relaxed text-fg">{r.body}</p>
            <div className="mt-auto border-t border-line-soft pt-5">
              <div className="font-semibold">{r.name}</div>
              <div className="mt-1 text-sm text-fg-3">{r.role}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
