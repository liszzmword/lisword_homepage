/* global React */
function Programs() {
  return (
    <section className="wrap section" id="programs">
      <div className="section-head reveal">
        <div>
          <div className="eyebrow mono">PROGRAMS / 01</div>
          <h2 className="section-title">두 갈래의 <em className="accent">AI 교육</em>.</h2>
        </div>
        <p className="section-lead">
          조직 단위로 문제를 해결하는 부트캠프와, 실무자가 빠르게 무장하는 스킬트레이닝.
          어떤 상황이든 맞춤 설계로 풀어드립니다.
        </p>
      </div>

      <div className="programs-grid reveal">
        <article className="program">
          <span className="program-num">01 — BOOTCAMP</span>
          <h3 className="program-title">AI <em>부트캠프</em></h3>
          <p className="program-desc">
            기업과 학교를 위한 실전 문제해결 프로그램.
            학교 과정은 창업·문제해결을 동시에 진행합니다.
          </p>
          <div className="program-list">
            <div className="program-list-row"><span>기업 부트캠프</span><span>2 – 12 WEEKS</span></div>
            <div className="program-list-row"><span>학교 부트캠프 (창업 + 문제해결)</span><span>1 SEMESTER</span></div>
            <div className="program-list-row"><span>커스텀 트랙 설계</span><span>ON DEMAND</span></div>
          </div>
          <div className="program-foot">
            <a href="#contact" className="btn btn-accent">상담 신청<span className="arrow">→</span></a>
          </div>
        </article>

        <article className="program">
          <span className="program-num">02 — SKILL TRAINING</span>
          <h3 className="program-title">스킬<em>트레이닝</em></h3>
          <p className="program-desc">
            네 가지 핵심 트랙. 단기 집중형, 실무 적용 즉시 가능.
            기업 사내 교육과 공개 과정 모두 운영합니다.
          </p>
          <div className="program-list">
            <div className="program-list-row"><span>AI 리터러시</span><span>TRACK 01</span></div>
            <div className="program-list-row"><span>데이터 리터러시</span><span>TRACK 02</span></div>
            <div className="program-list-row"><span>RAG 개발</span><span>TRACK 03</span></div>
            <div className="program-list-row"><span>바이브 코딩</span><span>TRACK 04</span></div>
          </div>
          <div className="program-foot">
            <a href="#skills" className="btn btn-ghost">자세히 보기<span className="arrow">→</span></a>
          </div>
        </article>
      </div>
    </section>
  );
}
window.Programs = Programs;
