import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

// ─── Data ────────────────────────────────────────────────────────────────────
const SLIDES = [
  { id: 1, src: "/media/coronawebp4.webp", alt: "Corona Capital 2026 – Artistas"        },
  { id: 4, src: "/media/coronawebp3.webp", alt: "Corona Capital 2026 – Escena principal" },
  { id: 2, src: "/media/coronawebp2.webp", alt: "Corona Capital 2026 – Multitud"         },
  { id: 3, src: "/media/coronawebp1.webp", alt: "Corona Capital 2026 – Artistas"         },
];

const ARTISTS = [
  "GORILLAZ", "LCD SOUNDSYSTEM", "DURAN DURAN", "FONTAINES D.C.", "THE LIBERTINES",
  "BLOOD ORANGE", "MASSIVE ATTACK", "NINE INCH NAILS", "TURNSTILE", "RICHARD ASHCROFT",
  "THE WAR ON DRUGS", "FLORENCE + THE MACHINE", "KINGS OF LEON", "PIXIES",
  "CHARLIE PUTH", "DEATH CAB FOR CUTIE", "BLEACHERS", "JENNIE",
];

const AUTOPLAY_MS = 5000;

// ─── Types ───────────────────────────────────────────────────────────────────
interface Slide {
  id: number;
  src: string;
  alt: string;
}

// ─── HeroLoader ──────────────────────────────────────────────────────────────
function HeroLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"idle" | "open">("idle");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("open"), 1600);
    const t2 = setTimeout(() => onComplete(), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div className={`hero-loader ${phase === "open" ? "hero-loader--open" : ""}`}>
      <div className="hero-loader__curtain hero-loader__curtain--left" />
      <div className="hero-loader__curtain hero-loader__curtain--right" />
      <div className={`hero-loader__brand ${phase === "open" ? "hero-loader__brand--out" : ""}`}>
        <span className="hero-loader__cc">CC</span>
        <span className="hero-loader__year">2 &nbsp; 0 &nbsp; 2 &nbsp; 6</span>
      </div>
    </div>
  );
}

// ─── TickerBand ──────────────────────────────────────────────────────────────
function TickerBand({ visible }: { visible: boolean }) {
  const doubled = [...ARTISTS, ...ARTISTS];
  return (
    <div className={`ticker-band ${visible ? "ticker-band--visible" : ""}`}>
      <div className="ticker-track">
        {doubled.map((artist, i) => (
          <span key={i} className="ticker-item">
            {artist} <span className="ticker-sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── CarouselSlide ───────────────────────────────────────────────────────────
function CarouselSlide({
  slide,
  isActive,
  scrollProgress,
}: {
  slide: Slide;
  isActive: boolean;
  scrollProgress: number;
}) {
  const scale = 1 + scrollProgress * 0.18;
  return (
    <div
      className={`carousel-slide ${isActive ? "carousel-slide--active" : ""}`}
      aria-hidden={!isActive}
    >
      <div
        className="carousel-slide__img-wrapper"
        style={{ transform: `scale(${scale})` }}
      >
        <img src={slide.src} alt={slide.alt} className="carousel-slide__img" />
      </div>
    </div>
  );
}

// ─── CarouselDots ────────────────────────────────────────────────────────────
function CarouselDots({
  total,
  active,
  visible,
  onSelect,
}: {
  total: number;
  active: number;
  visible: boolean;
  onSelect: (i: number) => void;
}) {
  return (
    <nav
      className={`carousel-dots ${visible ? "carousel-dots--visible" : ""}`}
      aria-label="Navegación de slides"
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className={`carousel-dot ${i === active ? "carousel-dot--active" : ""}`}
          onClick={() => onSelect(i)}
          aria-label={`Ir al slide ${i + 1}`}
          aria-current={i === active ? "true" : undefined}
        />
      ))}
    </nav>
  );
}

// ─── HeroContent ─────────────────────────────────────────────────────────────
// useNavigate lives here — inside a component, not at module level
function HeroContent({ visible }: { visible: boolean }) {
  const navigate = useNavigate();

  return (
    <div className={`hero__content ${visible ? "hero__content--revealed" : ""}`}>
      <span className="hero__eyebrow">Autódromo Hermanos Rodríguez · CDMX</span>
      <h1 className="hero__title">
        <span className="hero__title-line">Corona</span>
        <span className="hero__title-line hero__title-line--accent">Capital</span>
        <span className="hero__title-line">2026</span>
      </h1>
      <p className="hero__date">13 · 14 · 15 de Noviembre</p>
      <button
        className="hero__cta"
        onClick={() => navigate("/registro")}
      >
        Regístrate ahora
      </button>
    </div>
  );
}

// ─── ScrollHint ──────────────────────────────────────────────────────────────
function ScrollHint({ visible }: { visible: boolean }) {
  return (
    <div
      className={`scroll-hint ${visible ? "scroll-hint--visible" : ""}`}
      aria-hidden="true"
    >
      <span className="scroll-hint__label">Scroll</span>
      <div className="scroll-hint__line" />
    </div>
  );
}

// ─── Hero (main) ─────────────────────────────────────────────────────────────
export default function Hero() {
  const heroRef     = useRef<HTMLElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [loaded,        setLoaded]        = useState(false);
  const [activeSlide,   setActiveSlide]   = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    startAutoplay();
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [loaded, startAutoplay]);

  const goToSlide = useCallback(
    (i: number) => { setActiveSlide(i); startAutoplay(); },
    [startAutoplay]
  );

  // Scroll progress for parallax — reads from .app-scroll-container if present
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const container = document.querySelector(".app-scroll-container");
      const scrollY   = container ? container.scrollTop : window.scrollY;
      const heroHeight = heroRef.current.offsetHeight;
      const progress  = Math.min(Math.max(scrollY / heroHeight, 0), 1);
      setScrollProgress(progress);
    };

    const target = document.querySelector(".app-scroll-container") ?? window;
    target.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => target.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={heroRef} className="hero" id="inicio">
      {!loaded && <HeroLoader onComplete={() => setLoaded(true)} />}

      <TickerBand visible={loaded} />

      <div className="carousel" aria-live="polite">
        {SLIDES.map((slide, i) => (
          <CarouselSlide
            key={slide.id}
            slide={slide}
            isActive={i === activeSlide}
            scrollProgress={scrollProgress}
          />
        ))}
        <div className="carousel__overlay" />
        <CarouselDots
          total={SLIDES.length}
          active={activeSlide}
          visible={loaded}
          onSelect={goToSlide}
        />
      </div>

      <HeroContent visible={loaded} />
      <ScrollHint visible={loaded} />
    </section>
  );
}