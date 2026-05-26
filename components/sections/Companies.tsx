import { COMPANIES } from "@/content/companies";

export function Companies() {
  // duplicate for seamless marquee (3x for safety)
  const loop = [...COMPANIES, ...COMPANIES, ...COMPANIES];
  return (
    <section id="companies" className="py-24 md:py-32">
      <div className="mx-auto mb-12 w-full max-w-[1440px] px-[var(--pad-x)]">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <div className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
              CLIENTS / 06
            </div>
            <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              함께한 <em className="text-accent">기업·기관</em>.
            </h2>
          </div>
          <p className="text-base leading-relaxed text-fg-2">
            서로 다른 산업과 규모의 조직에서, 같은 원칙으로 교육을 설계했습니다.
          </p>
        </div>
      </div>

      <div className="overflow-hidden border-y border-line">
        <div className="flex w-max animate-tick">
          {loop.map((c, i) => (
            <div
              key={`${c.name}-${i}`}
              className="flex min-h-[120px] flex-shrink-0 items-center gap-5 border-r border-line-soft px-14 py-10"
            >
              <img
                src={c.logo}
                alt={c.name}
                loading="lazy"
                className="h-10 w-auto max-w-[140px] flex-shrink-0 object-contain"
              />
              <span className="whitespace-nowrap text-base font-semibold tracking-tight md:text-lg">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
