/* global React */
// 홈 화면 "블로그" 칸 — 최신 글을 최대 3개 보여 줍니다.
// 목록은 blog/latest.js(window.BLOG_LATEST)에서 읽습니다. 그 파일은 tools/build_blog.py가 만듭니다.
// 공개된 글이 없으면 이 칸은 화면에 나오지 않습니다.
// 문구를 바꾸면 tools/build_blog.py의 HOME_BLOCK(검색용 요약 블록)도 같이 바꿔 주세요.
function BlogLatest() {
  const posts = (window.BLOG_LATEST || []).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="wrap section" id="blog">
      <div className="section-head reveal">
        <div>
          <div className="eyebrow mono">BLOG · 블로그</div>
          <h2 className="section-title">리즈워드 <em className="accent">블로그</em>.</h2>
        </div>
        <p className="section-lead">교육 현장 이야기와 AI 소식을 블로그에 정리합니다.</p>
      </div>

      <div className="blog-latest-grid reveal">
        {posts.map((p) => (
          <a
            key={p.slug}
            href={p.url}
            className="blog-latest-card"
            onClick={() => window.gtag && window.gtag("event", "blog_latest_click", { slug: p.slug, category: p.category })}
          >
            <div className="blog-latest-cover">
              <img src={p.cover} alt="" width={p.coverWidth} height={p.coverHeight} loading="lazy" decoding="async" />
            </div>
            <div className="blog-latest-body">
              <div className="news-card-top">
                <span className="news-card-source">
                  {p.categoryLabel}
                  {p.draft ? <span className="blog-latest-draft">초안</span> : null}
                </span>
                <span className="news-card-date">{p.date}</span>
              </div>
              <h3 className="news-card-title">{p.title}</h3>
            </div>
          </a>
        ))}
      </div>

      <div className="news-more reveal">
        <a href="/blog/" className="btn btn-ghost">
          블로그 더보기 <span className="arrow">→</span>
        </a>
      </div>
    </section>
  );
}
window.BlogLatest = BlogLatest;
