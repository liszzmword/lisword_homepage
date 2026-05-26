/* global React */
function Footer() {
  return (
    <footer className="wrap footer">
      <div className="footer-inner">
        <div className="logo">
          <span className="logo-mark"></span>
          <span>LISWORD · 리즈워드</span>
        </div>
        <div className="footer-meta">
          © {new Date().getFullYear()} LISWORD. ALL RIGHTS RESERVED · LISWORD.CO.KR
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
