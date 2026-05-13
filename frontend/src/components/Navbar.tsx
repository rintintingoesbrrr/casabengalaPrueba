import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const IconClose = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="6"  x2="6"  y2="18"/>
    <line x1="6"  y1="6"  x2="18" y2="18"/>
  </svg>
);

const IconCrownCap = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <polygon points="4,24 10,10 16,18 22,10 28,24" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
    <line x1="4" y1="27" x2="28" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ─── Nav links ────────────────────────────────────────────────────────────────
// route: used to detect active state via useLocation
// href:  the hash section on the home page (null for /registro)
const NAV_LINKS = [
  { label: "Inicio",   route: "/",          href: "#inicio"  },
  { label: "Evento",   route: "/",          href: "#evento"  },
  { label: "Galería",  route: "/",          href: "#galeria" },
  { label: "Registro", route: "/registro",  href: null       },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const navigate            = useNavigate();
  const { pathname }        = useLocation();
  const onRegistro          = pathname === "/registro";

  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeHash, setActiveHash] = useState("#inicio");

  // Active dot logic:
  // • On /registro   → highlight the "Registro" link
  // • On /           → highlight whichever hash section is in view
  const getActive = (link: typeof NAV_LINKS[0]) => {
    if (onRegistro) return link.route === "/registro";
    return link.href === activeHash;
  };

  // Scroll detection — only meaningful on the home page
  useEffect(() => {
    if (onRegistro) return;
    const container = document.querySelector(".app-scroll-container") ?? window;

    const handleScroll = () => {
      const scrollY = container instanceof Window
        ? window.scrollY
        : (container as Element).scrollTop;

      setScrolled(scrollY > 60);

      const homeLinks = NAV_LINKS.filter((l) => l.href);
      let current = homeLinks[0].href!;
      homeLinks.forEach((link) => {
        const el = document.querySelector(link.href!) as HTMLElement | null;
        if (!el) return;
        if (scrollY >= el.offsetTop - 120) current = link.href!;
      });
      setActiveHash(current);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [onRegistro]);

  // On /registro the navbar should always appear solid
  useEffect(() => {
    if (onRegistro) setScrolled(true);
  }, [onRegistro]);

  // Close drawer on resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // getBoundingClientRect relative to container = correct absolute scroll target
  // regardless of how deeply nested the section element is.
  const scrollToEl = (el: HTMLElement) => {
    const container = document.querySelector(".app-scroll-container") as HTMLElement | null;
    if (container) {
      const target = container.scrollTop
        + el.getBoundingClientRect().top
        - container.getBoundingClientRect().top;
      container.scrollTo({ top: target, behavior: "smooth" });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Navigate to a section — works from any route
  const goToSection = (link: typeof NAV_LINKS[0]) => {
    setMenuOpen(false);
    if (link.route === "/registro") {
      navigate("/registro");
      return;
    }
    if (onRegistro) {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(link.href!) as HTMLElement | null;
        if (el) scrollToEl(el);
      }, 120);
    } else {
      const el = document.querySelector(link.href!) as HTMLElement | null;
      if (!el) return;
      scrollToEl(el);
      setActiveHash(link.href!);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${menuOpen ? "navbar--open" : ""}`}>

      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <button
        className="navbar__logo"
        onClick={() => goToSection(NAV_LINKS[0])}
        aria-label="Ir al inicio"
      >
        <span className="navbar__logo-icon"><IconCrownCap /></span>
        <span className="navbar__logo-wordmark">
          <span className="navbar__logo-cc">Corona</span>
          <span className="navbar__logo-capital">Capital</span>
        </span>
      </button>

      {/* ── Desktop links ─────────────────────────────────────────────── */}
      <ul className="navbar__links" role="list">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <button
              className={`navbar__link ${getActive(link) ? "navbar__link--active" : ""}`}
              onClick={() => goToSection(link)}
            >
              {link.label}
              <span className="navbar__link-dot" />
            </button>
          </li>
        ))}
      </ul>

      {/* ── Mobile hamburger ──────────────────────────────────────────── */}
      <button
        className="navbar__hamburger"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <IconClose /> : <IconMenu />}
      </button>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      <div className={`navbar__drawer ${menuOpen ? "navbar__drawer--open" : ""}`} aria-hidden={!menuOpen}>
        <ul className="navbar__drawer-links" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <button
                className={`navbar__drawer-link ${getActive(link) ? "navbar__drawer-link--active" : ""}`}
                onClick={() => goToSection(link)}
                tabIndex={menuOpen ? 0 : -1}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </nav>
  );
}