import { useEffect, useRef, useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    }
    function onResize() {
      if (window.innerWidth > 900) setMenuOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);
  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#top" className="brand">
          <svg width="34" height="40" viewBox="0 0 32 38" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path d="M2 3 L10 3 L16 0 L22 3 L30 3 L30 20 Q30 33 16 38 Q2 33 2 20 Z" fill="#4A3570"/>
            <path d="M5 6 L11 6 L16 3.5 L21 6 L27 6 L27 20 Q27 30 16 34 Q5 30 5 20 Z" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6"/>
            <text x="16" y="18" textAnchor="middle" dominantBaseline="central" fontFamily="Georgia,serif" fontSize="9" fontWeight="400" fill="#ffffff">CO</text>
            <line x1="8" y1="24" x2="24" y2="24" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6"/>
            <text x="16" y="29" textAnchor="middle" dominantBaseline="central" fontFamily="Helvetica,Arial,sans-serif" fontSize="3.8" fill="#ffffff">ADVISORY</text>
          </svg>
          <span>
            <span className="brand-name">Comply<b>On</b></span>
            <span className="brand-sub">Compliance &amp; risk advisory</span>
          </span>
        </a>
        <button ref={toggleRef} className="nav-toggle" id="navToggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="navLinks" onClick={() => setMenuOpen(!menuOpen)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" focusable="false"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
        </button>
        <nav aria-label="Primary">
          <ul className={`nav-links${menuOpen ? ' open' : ''}`} id="navLinks" onClick={(event) => { if (event.target.tagName === 'A') setMenuOpen(false); }}>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#clients">Who we serve</a></li>
            <li><a href="#experience">Track record</a></li>
            <li><a href="#faq">Questions</a></li>
            <li><a href="#contact" className="cta">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
