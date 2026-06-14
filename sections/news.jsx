/* global React */
function News() {
  const articles = (window.NEWS_ARTICLES || []).slice(0, 3);
  if (articles.length === 0) return null;

  return (
    <section className="wrap section" id="news">
      <div className="section-head reveal">
        <div>
          <div className="eyebrow mono">PRESS / 04</div>
          <h2 className="section-title">언론에 나온 <em className="accent">리즈워드</em>.</h2>
        </div>
        <p className="section-lead">
          매체에 소개된 리즈워드의 활동을 모았습니다.
        </p>
      </div>

      <div className="news-grid reveal">
        {articles.map((a) => (
          <a
            key={a.id}
            href={a.url}
            target="_blank"
            rel="noopener"
            className="news-card"
            onClick={() => window.gtag && window.gtag("event", "press_article_click", { article_id: a.id })}
          >
            <div className="news-card-top">
              <span className="news-card-source">{a.source}</span>
              <span className="news-card-date">{a.date}</span>
            </div>
            <h3 className="news-card-title">{a.title}</h3>
            {a.excerpt ? <p className="news-card-excerpt">{a.excerpt}</p> : null}
            <span className="news-card-link">기사 읽기 <span className="arrow">↗</span></span>
          </a>
        ))}
      </div>

      <div className="news-more reveal">
        <a href="news.html" className="btn btn-ghost">
          기사 더보기 <span className="arrow">→</span>
        </a>
      </div>
    </section>
  );
}
window.News = News;
