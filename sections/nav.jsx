/* global React */
function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="logo">
          <span className="logo-mark"></span>
          <span>LISWORD</span>
        </a>
        <nav className="nav-links">
          <a href="#programs">교육</a>
          <a href="#youtube">유튜브</a>
          <a href="#portfolio">사례</a>
          <a href="#contact">문의</a>
        </nav>
        <a
          href="#contact"
          className="nav-cta"
          onClick={() => window.gtag && window.gtag("event", "cta_contact_click", { location: "nav" })}
        >교육 문의하기</a>
      </div>
    </header>
  );
}
window.Nav = Nav;
