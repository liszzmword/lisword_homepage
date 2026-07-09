/* global React */
function AX() {
  const services = [
    { num: "01", title: "AX 진단 · 로드맵", desc: "부서별 업무를 분석해 AI가 이길 수 있는 지점을 찾고, 도입 우선순위와 실행 계획을 설계합니다.", tag: "CONSULTING" },
    { num: "02", title: "RAG 챗봇 · 사내 지식봇", desc: "사내 문서·규정·매뉴얼을 연결한 RAG 시스템 구축. 조직의 지식이 검색되고, 답하게 만듭니다.", tag: "BUILD" },
    { num: "03", title: "AI 업무 자동화", desc: "반복되는 보고·정리·응대 업무를 AI 워크플로우로 전환해 팀의 시간을 되돌려드립니다.", tag: "AUTOMATION" },
    { num: "04", title: "교육 결합 내재화", desc: "구축과 동시에 운영할 사람을 키웁니다. 납품하고 떠나는 외주와 갈라지는 지점입니다.", tag: "ENABLEMENT" },
  ];
  const steps = [
    { num: "01", label: "진단", desc: "업무 · 데이터 현황 분석" },
    { num: "02", label: "PoC", desc: "작게 만들어 빠르게 검증" },
    { num: "03", label: "구축", desc: "실무 시스템으로 확장" },
    { num: "04", label: "교육 · 내재화", desc: "팀이 직접 운영" },
  ];
  return (
    <section className="wrap section" id="ax">
      <div className="section-head reveal">
        <div>
          <div className="eyebrow mono">AX PARTNERSHIP / 03</div>
          <h2 className="section-title">교육에서 <em className="accent">구축</em>까지.</h2>
        </div>
        <p className="section-lead">
          AX(AI Transformation) — 조직의 일하는 방식을 AI로 전환하는 일.
          AI 교육을 해온 팀이 직접 진단하고, 만들고, 운영할 사람까지 남깁니다.
        </p>
      </div>

      <div className="skills-grid reveal">
        {services.map((s) => (
          <article className="skill" key={s.num}>
            <span className="skill-num">{s.num}</span>
            <h3 className="skill-title">{s.title}</h3>
            <p className="skill-desc">{s.desc}</p>
            <span className="skill-tag">{s.tag}</span>
          </article>
        ))}
      </div>

      <div className="ax-steps reveal">
        {steps.map((st) => (
          <div className="ax-step" key={st.num}>
            <span className="ax-step-num mono">{st.num}</span>
            <span className="ax-step-label">{st.label}</span>
            <span className="ax-step-desc">{st.desc}</span>
          </div>
        ))}
      </div>

      <div className="ax-foot reveal">
        <p className="ax-quote">
          만들어주고 떠나는 외주가 아니라,<br/>
          팀이 <em>직접 굴릴 수 있을 때까지</em>.
        </p>
        <a
          href="#contact"
          className="btn btn-accent"
          onClick={() => {
            window.dispatchEvent(new CustomEvent("contact-type", { detail: "ax" }));
            if (window.gtag) window.gtag("event", "cta_contact_click", { location: "ax" });
          }}
        >
          AX 상담 신청<span className="arrow">→</span>
        </a>
      </div>
    </section>
  );
}
window.AX = AX;
