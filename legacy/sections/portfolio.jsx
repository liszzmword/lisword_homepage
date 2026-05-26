/* global React */
function Portfolio() {
  const items = [
    {
      id: "skku",
      num: "01",
      title: "AI 부트캠프 — 창업·문제해결 트랙",
      client: "성균관대학교",
      date: "2025",
      image: "성균관대학교%20AI부트캠프.jpeg",
    },
    {
      id: "domino",
      num: "02",
      title: "임직원 AI 리터러시 · RAG 워크숍",
      client: "도미노피자",
      date: "2025",
      image: "도미노RAG.jpg",
    },
    {
      id: "plentyn",
      num: "03",
      title: "데이터 리터러시 사내 교육",
      client: "플렌티넷",
      date: "2024",
      image: "플랜티넷_데이터리터러시%20사내%20교육.jpg",
    },
    {
      id: "tjmedia",
      num: "04",
      title: "서비스디자인 부트캠프",
      client: "TJ미디어",
      date: "2025",
      image: "서비스디자인해커톤.jpg",
    },
  ];
  return (
    <section className="wrap section" id="portfolio">
      <div className="section-head reveal">
        <div>
          <div className="eyebrow mono">PORTFOLIO / 04</div>
          <h2 className="section-title">진행했던 <em className="accent">교육들</em>.</h2>
        </div>
        <p className="section-lead">
          대학과 기업에서 진행한 부트캠프 · 스킬트레이닝 사례입니다.
          현장 사진과 결과물은 문의 시 공유드립니다.
        </p>
      </div>

      <div className="port-grid reveal">
        {items.map((it) => (
          <article className="port-card" key={it.id}>
            <div className="port-image">
              <img src={it.image} alt={`${it.client} ${it.title}`} loading="lazy" />
              <div className="port-image-num">{it.num}</div>
            </div>
            <div className="port-meta">
              <div className="port-meta-top">
                <span className="port-client">{it.client}</span>
                <span className="port-date">{it.date}</span>
              </div>
              <h3 className="port-card-title">{it.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
window.Portfolio = Portfolio;
