/* global React */
function Companies() {
  const list = [
    "성균관대학교", "도미노피자", "플렌티넷", "플렌티엠", "강원대학교",
    "한국국토정보공사", "춘천시청", "삼성전자", "LG이노텍", "문화체육관광부", "틱톡"
  ];
  // duplicate for seamless marquee
  const loop = [...list, ...list, ...list];
  return (
    <section className="section" id="companies" style={{paddingLeft:0, paddingRight:0}}>
      <div className="wrap" style={{marginBottom: "clamp(40px, 5vw, 64px)"}}>
        <div className="section-head reveal">
          <div>
            <div className="eyebrow mono">CLIENTS / 06</div>
            <h2 className="section-title">함께한 <em className="accent">기업·기관</em>.</h2>
          </div>
          <p className="section-lead">
            서로 다른 산업과 규모의 조직에서, 같은 원칙으로 교육을 설계했습니다.
          </p>
        </div>
      </div>

      <div className="marquee reveal">
        <div className="marquee-track">
          {loop.map((c, i) => (
            <div className="company" key={i}>
              <span className="company-dot"></span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Companies = Companies;
