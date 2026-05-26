import Link from "next/link";
import type { SkillTrack } from "@/content/skill-tracks";

export function SkillTrackPage({ track }: { track: SkillTrack }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: track.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${track.title} 교육`,
    description: track.longDesc,
    provider: {
      "@type": "EducationalOrganization",
      name: "리즈워드 LISWORD",
      sameAs: "https://lisword.co.kr",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <main className="mx-auto w-full max-w-[1440px] px-[var(--pad-x)] py-24 md:py-32">
        <nav className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
          <Link href="/" className="hover:text-fg">HOME</Link> /{" "}
          <Link href="/programs" className="hover:text-fg">PROGRAMS</Link> /{" "}
          <Link href="/programs/skill-training" className="hover:text-fg">SKILL TRAINING</Link> /{" "}
          {track.audience}
        </nav>
        <div className="mt-8 font-en text-xs uppercase tracking-[0.18em] text-fg-3">
          TRACK {track.num} · {track.audience}
        </div>
        <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          <em className="text-accent">{track.title}</em>
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-relaxed text-fg-2">{track.longDesc}</p>

        <div className="mt-16 grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <article className="border border-line-soft bg-card p-10">
            <h2 className="text-2xl font-bold tracking-tight">다루는 내용</h2>
            <ul className="mt-6 list-disc space-y-3 pl-5 text-base leading-relaxed text-fg-2">
              {track.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </article>
          <aside className="border border-line-soft bg-bg-2 p-10">
            <h3 className="text-lg font-bold tracking-tight">TL;DR</h3>
            <p className="mt-4 text-sm leading-relaxed text-fg-2">{track.shortDesc}</p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-3 bg-accent-ink px-5 py-3 text-sm font-semibold text-accent"
            >
              상담 신청 <span>→</span>
            </Link>
          </aside>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">자주 묻는 질문</h2>
          <dl className="mt-8 space-y-6">
            {track.faqs.map((f) => (
              <div key={f.q} className="border-t border-line-soft pt-6">
                <dt className="text-lg font-bold">Q. {f.q}</dt>
                <dd className="mt-3 text-base leading-relaxed text-fg-2">A. {f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </main>
    </>
  );
}
