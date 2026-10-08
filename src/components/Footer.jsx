export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-mark">
          <svg width="30" height="36" viewBox="0 0 32 38" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path d="M2 3 L10 3 L16 0 L22 3 L30 3 L30 20 Q30 33 16 38 Q2 33 2 20 Z" fill="#6b52a0"/>
            <text x="16" y="17" textAnchor="middle" dominantBaseline="central" fontFamily="Georgia,serif" fontSize="9" fill="#ffffff">CO</text>
            <line x1="8" y1="23" x2="24" y2="23" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6"/>
            <text x="16" y="28" textAnchor="middle" dominantBaseline="central" fontFamily="Helvetica,Arial,sans-serif" fontSize="3.8" fill="#ffffff">ADVISORY</text>
          </svg>
        </div>
        <div className="foot-name">Comply<b>On</b> LLC</div>
        <div className="foot-tag">Independent compliance &amp; risk advisory · <span className="nowrap">Atlanta, Georgia</span></div>
        <nav aria-label="Footer">
          <ul className="foot-links">
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#clients">Who we serve</a></li>
            <li><a href="#experience">Track record</a></li>
            <li><a href="#faq">Questions</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="https://www.linkedin.com/in/reema-keen-57a8b77/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </nav>
        <div className="foot-rule"></div>
        <div className="foot-bottom">
          <div>© 2026 ComplyOn LLC. All rights reserved.</div>
          <div className="foot-disclaimer">ComplyOn LLC provides compliance consulting and does not provide legal, tax, or investment advice.</div>
        </div>
      </div>
    </footer>
  );
}
