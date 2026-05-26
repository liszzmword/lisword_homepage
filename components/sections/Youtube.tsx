const YT_VIDEOS = [
  { videoId: "GxRfz9hdiLA", t: 437, title: "AI 교육, 이렇게 시작하세요" },
  { videoId: "7FLsVEdXeTc", t: 483, title: "실무에 바로 쓰는 AI 활용법" },
  { videoId: "X_tKxvPtuBU", t: 4, title: "리즈워드가 풀어가는 AI 교육" },
];

export function Youtube() {
  return (
    <section id="youtube" className="bg-bg-2 py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1440px] px-[var(--pad-x)]">
        <div className="mx-auto max-w-2xl text-center">
          <div className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
            YOUTUBE / 03
          </div>
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            강의실 밖에서도 <em className="text-accent">이야기</em>.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-fg-2">
            AI 리터러시부터 실전 개발까지, 새로운 영상으로 풀어드립니다. 채널 구독으로 가장 빠르게 받아보세요.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {YT_VIDEOS.map((v) => (
            <a
              key={v.videoId}
              href={`https://www.youtube.com/watch?v=${v.videoId}${v.t ? `&t=${v.t}s` : ""}`}
              target="_blank"
              rel="noopener"
              className="group block"
            >
              <div className="relative aspect-video overflow-hidden bg-bg">
                <img
                  src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
                  alt={v.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center bg-accent text-accent-ink">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h4 className="mt-5 text-lg font-bold tracking-tight">{v.title}</h4>
              <div className="mt-2 font-en text-[11px] uppercase tracking-[0.18em] text-fg-3">
                YOUTUBE.COM/@LISWORD
              </div>
            </a>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border border-line-soft bg-bg p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center bg-accent-ink text-xl font-bold text-accent">
              L
            </div>
            <div>
              <div className="text-lg font-bold">리즈워드</div>
              <div className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
                youtube.com/@lisword
              </div>
            </div>
          </div>
          <a
            href="https://www.youtube.com/@lisword"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-3 bg-accent-ink px-6 py-3 text-sm font-semibold text-accent"
          >
            채널 구독하기 <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
