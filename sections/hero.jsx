/* global React */
function Hero({ tagline }) {
  return (
    <section className="wrap hero" id="top">
      <div className="hero-grid">
        <div className="reveal">
          <div className="eyebrow mono">AI EDUCATION · EST. SUNGKYUNKWAN</div>
          <h1>
            <span className="line">{tagline.main[0]}</span>
            <span className="line"><em className="ink-accent">{tagline.main[1]}</em></span>
          </h1>
        </div>

        <div className="hero-meta reveal" style={{ "--reveal-delay": "180ms" }}>
          <p className="hero-desc">{tagline.desc}</p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-accent">
              교육 문의하기
              <span className="arrow">→</span>
            </a>
            <a href="#programs" className="btn btn-ghost">
              프로그램 보기
            </a>
          </div>
        </div>
      </div>

      <div className="ticker reveal" style={{ "--reveal-delay": "320ms" }}>
        <div className="ticker-track">
          {[...Array(2)].map((_, i) => (
            <div className="ticker-item" key={i}>
              <span>AI BOOTCAMP</span>
              <span>SKILL TRAINING</span>
              <span>AI 리터러시</span>
              <span>DATA LITERACY</span>
              <span>RAG DEVELOPMENT</span>
              <span>VIBE CODING</span>
              <span>창업 · 문제해결</span>
              <span>기업 · 학교</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Hero = Hero;
