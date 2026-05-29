/* global React */

// ─── 영상 교체 위치 ────────────────────────────────────────────────────────
// 유튜브 영상 URL의 마지막 부분(예: youtu.be/XXXXXXXXXXX, watch?v=XXXXXXXXXXX)을
// videoId 에 넣어주세요. title 도 자유롭게 바꿔도 됩니다.
const YT_VIDEOS = [
  { videoId: "GxRfz9hdiLA", t: 437, title: "AI 교육, 이렇게 시작하세요" },
  { videoId: "7FLsVEdXeTc", t: 483, title: "실무에 바로 쓰는 AI 활용법" },
  { videoId: "X_tKxvPtuBU", t: 4,   title: "리즈워드가 풀어가는 AI 교육" },
];
// ───────────────────────────────────────────────────────────────────────────

function YouTube() {
  return (
    <section className="section yt" id="youtube">
      <div className="wrap">
        <div className="section-head reveal section-head--center">
          <div>
            <div className="eyebrow mono">YOUTUBE / 03</div>
            <h2 className="section-title">강의실 밖에서도 <em className="accent">이야기</em>.</h2>
          </div>
          <p className="section-lead">
            AI 리터러시부터 실전 개발까지, 새로운 영상으로 풀어드립니다.
            채널 구독으로 가장 빠르게 받아보세요.
          </p>
        </div>

        <div className="yt-cards reveal">
          {YT_VIDEOS.map((v, i) => (
            <a
              className="yt-card"
              key={i}
              href={`https://www.youtube.com/watch?v=${v.videoId}${v.t ? `&t=${v.t}s` : ""}`}
              target="_blank"
              rel="noopener"
            >
              <div className="yt-thumb">
                <img
                  src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
                  alt={v.title}
                  className="yt-thumb-img"
                  loading="lazy"
                />
                <div className="yt-play">
                  <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
              <h4 className="yt-card-title">{v.title}</h4>
              <div className="yt-card-meta">YOUTUBE.COM/@LISWORD</div>
            </a>
          ))}
        </div>

        <div className="yt-channel reveal">
          <div className="yt-channel-info">
            <div className="yt-channel-avatar">L</div>
            <div>
              <div className="yt-channel-name">리즈워드</div>
              <div className="yt-channel-handle">youtube.com/@lisword</div>
            </div>
          </div>
          <a
            href="https://www.youtube.com/@lisword"
            target="_blank"
            rel="noopener"
            className="btn btn-accent"
            onClick={() => window.gtag && window.gtag("event", "youtube_subscribe_click")}
          >
            채널 구독하기<span className="arrow">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
window.YouTube = YouTube;
