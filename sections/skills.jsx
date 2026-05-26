/* global React */
function Skills() {
  const items = [
    { num: "01", title: "AI 리터러시", desc: "비개발자도 AI를 도구로 쓸 수 있게. 개념부터 실습까지.", tag: "FOR EVERYONE" },
    { num: "02", title: "데이터 리터러시", desc: "데이터를 읽고, 묻고, 의사결정에 쓰는 법.", tag: "FOR DECISION MAKERS" },
    { num: "03", title: "RAG 개발", desc: "사내 문서와 LLM을 연결하는 실전 RAG 시스템 구축.", tag: "FOR BUILDERS" },
    { num: "04", title: "바이브 코딩", desc: "AI와 대화하며 제품을 만든다. 비개발자도 가능합니다.", tag: "FOR MAKERS" },
  ];
  return (
    <section className="wrap section" id="skills">
      <div className="section-head reveal">
        <div>
          <div className="eyebrow mono">SKILL TRAINING / 02</div>
          <h2 className="section-title">네 가지 <em className="accent">핵심 트랙</em>.</h2>
        </div>
        <p className="section-lead">
          교육 PDF의 상세 커리큘럼은 문의 시 별도 안내드립니다.
          모든 트랙은 사내 교육 형태로 커스터마이즈 가능합니다.
        </p>
      </div>

      <div className="skills-grid reveal">
        {items.map((s) => (
          <article className="skill" key={s.num}>
            <span className="skill-num">{s.num}</span>
            <h3 className="skill-title">{s.title}</h3>
            <p className="skill-desc">{s.desc}</p>
            <span className="skill-tag">{s.tag}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
window.Skills = Skills;
