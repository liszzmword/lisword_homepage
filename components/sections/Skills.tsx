const ITEMS = [
  { num: "01", title: "AI 리터러시", desc: "비개발자도 AI를 도구로 쓸 수 있게. 개념부터 실습까지.", tag: "FOR EVERYONE", href: "/programs/skill-training/ai-literacy" },
  { num: "02", title: "데이터 리터러시", desc: "데이터를 읽고, 묻고, 의사결정에 쓰는 법.", tag: "FOR DECISION MAKERS", href: "/programs/skill-training/data-literacy" },
  { num: "03", title: "RAG 개발", desc: "사내 문서와 LLM을 연결하는 실전 RAG 시스템 구축.", tag: "FOR BUILDERS", href: "/programs/skill-training/rag-development" },
  { num: "04", title: "바이브 코딩", desc: "AI와 대화하며 제품을 만든다. 비개발자도 가능합니다.", tag: "FOR MAKERS", href: "/programs/skill-training/vibe-coding" },
];

import Link from "next/link";

export function Skills() {
  return (
    <section id="skills" className="mx-auto w-full max-w-[1440px] px-[var(--pad-x)] py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <div className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
            SKILL TRAINING / 02
          </div>
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            네 가지 <em className="text-accent">핵심 트랙</em>.
          </h2>
        </div>
        <p className="text-base leading-relaxed text-fg-2">
          교육 PDF의 상세 커리큘럼은 문의 시 별도 안내드립니다. 모든 트랙은 사내 교육 형태로 커스터마이즈 가능합니다.
        </p>
      </div>

      <div className="mt-14 grid gap-px bg-line-soft md:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((s) => (
          <Link
            key={s.num}
            href={s.href}
            className="group flex flex-col gap-6 bg-bg p-9 transition-colors hover:bg-bg-2"
          >
            <span className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">{s.num}</span>
            <h3 className="text-2xl font-bold tracking-tight">{s.title}</h3>
            <p className="text-sm leading-relaxed text-fg-2">{s.desc}</p>
            <span className="mt-auto font-en text-[11px] uppercase tracking-[0.18em] text-accent">
              {s.tag} →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
