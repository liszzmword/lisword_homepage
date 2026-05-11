/* global React */
function About() {
  return (
    <section className="wrap section" id="about">
      <div className="section-head reveal">
        <div>
          <div className="eyebrow mono">ABOUT / 03</div>
          <h2 className="section-title">강의실 너머의 <em className="accent" style={{fontStyle:"italic"}}>실무자</em>.</h2>
        </div>
        <p className="section-lead">
          연구와 현장을 모두 거친 강사가 직접 설계하고 진행합니다.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-portrait reveal">
          <div className="about-portrait-name">이인섭<br/>Lee Inseop</div>
          <div className="about-portrait-label">PORTRAIT · DROP IN</div>
        </div>

        <div className="reveal" style={{ "--reveal-delay": "120ms" }}>
          <h3 className="about-name">이인섭<em>Lee Inseop.</em></h3>
          <p className="about-role">
            성균관대학교 서비스디자인 박사 · 리즈워드 대표<br/>
            AI 관련 논문 · 특허 다수 · 풍부한 실무 경험
          </p>
          <p className="about-bio">
            서비스디자인 박사로서 사용자와 비즈니스 양쪽을 이해하고,
            동시에 AI 연구와 실무 경험을 토대로 교육을 설계합니다.
            논문과 특허로 검증된 방법론을 강의실 안에 그대로 옮깁니다.
          </p>

          <div className="about-stats">
            <div className="about-stat">
              <div className="about-stat-num">10<span style={{fontSize:"0.5em"}}>+</span></div>
              <div className="about-stat-label">기업·학교 교육 진행</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-num">Ph.D</div>
              <div className="about-stat-label">서비스디자인 박사</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-num">N</div>
              <div className="about-stat-label">AI 논문·특허</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
window.About = About;
