/* global React */
function Portfolio() {
  const items = [
    { id: "skku",    num: "01", title: "AI 부트캠프 — 창업·문제해결 트랙", client: "성균관대학교", date: "2025" },
    { id: "domino",  num: "02", title: "임직원 AI 리터러시 · RAG 워크숍", client: "도미노피자", date: "2025" },
    { id: "plentyn", num: "03", title: "데이터 리터러시 사내 교육", client: "플렌티넷", date: "2024" },
    { id: "plentym", num: "04", title: "바이브 코딩 실무자 과정", client: "플렌티엠", date: "2024" },
    { id: "kangwon", num: "05", title: "AI 문제해결 부트캠프", client: "강원대학교", date: "2024" },
    { id: "more",    num: "06", title: "그 외 다수 기업·기관 교육", client: "ON GOING", date: "2024–2025" },
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
              <image-slot
                id={`port-${it.id}`}
                shape="rect"
                placeholder={`${it.client} 현장 사진`}
              ></image-slot>
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
