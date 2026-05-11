/* global React */
function Footer() {
  return (
    <footer className="wrap footer">
      <div className="footer-inner">
        <div className="logo">
          <span className="logo-mark"></span>
          <span>LISZZM · 리즈워드</span>
        </div>
        <div className="footer-meta">
          © {new Date().getFullYear()} LISZZM. ALL RIGHTS RESERVED · LISZZM.CO.KR
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
