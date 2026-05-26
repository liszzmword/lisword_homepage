/* global React */
function Companies() {
  const list = [
    { name: "성균관대학교",       logo: "logos/skku.svg" },
    { name: "도미노피자",         logo: "logos/dominos.svg" },
    { name: "플렌티넷",           logo: "logos/plantynet.png" },
    { name: "플렌티엠",           logo: "logos/plantym.png" },
    { name: "강원대학교",         logo: "logos/kangwon.svg" },
    { name: "한국국토정보공사",   logo: "logos/lx.svg" },
    { name: "춘천시청",           logo: "logos/chuncheon.svg" },
    { name: "삼성전자",           logo: "logos/samsung.svg" },
    { name: "LG이노텍",           logo: "logos/lginnotek.svg" },
    { name: "문화체육관광부",     logo: "logos/mcst.svg" },
    { name: "틱톡",               logo: "logos/tiktok.svg" },
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
              <img
                className="company-logo"
                src={c.logo}
                alt={c.name}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <span className="company-name">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Companies = Companies;
