/* global React */
function Footer() {
  return (
    <footer className="wrap footer">
      <div className="footer-inner">
        <div className="logo">
          <span className="logo-mark"></span>
          <span>LISWORD · 리즈워드</span>
        </div>
        <nav className="footer-links" aria-label="바로가기">
          <a href="/university/">대학·사업단 프로그램</a>
          <a href="/blog/">블로그</a>
          <a href="/news.html">언론 보도</a>
        </nav>
        <div className="footer-meta">
          © {new Date().getFullYear()} LISWORD. ALL RIGHTS RESERVED · LISWORD.CO.KR
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
