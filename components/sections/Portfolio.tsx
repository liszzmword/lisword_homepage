import Image from "next/image";
import { PORTFOLIO } from "@/content/portfolio";

export function Portfolio() {
  return (
    <section id="portfolio" className="mx-auto w-full max-w-[1440px] px-[var(--pad-x)] py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <div className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
            PORTFOLIO / 04
          </div>
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            진행했던 <em className="text-accent">교육들</em>.
          </h2>
        </div>
        <p className="text-base leading-relaxed text-fg-2">
          대학과 기업에서 진행한 부트캠프 · 스킬트레이닝 사례입니다. 현장 사진과 결과물은 문의 시 공유드립니다.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {PORTFOLIO.map((it) => (
          <article key={it.id} className="border border-line-soft bg-card">
            <div className="relative aspect-[4/3] overflow-hidden bg-bg-2">
              <Image
                src={it.image}
                alt={`${it.client} · ${it.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
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
              <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight">{it.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
