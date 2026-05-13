import { useEffect, useRef, useState } from "react";
import "./Gallery.css";

// ─── Data ────────────────────────────────────────────────────────────────────
const IMAGES = [
  { id: 1,  src: "/media/coronawebp4.webp", alt: "Corona Capital 2026 – Artistas",        span: "wide"   },
  { id: 2,  src: "/media/coronawebp3.webp", alt: "Corona Capital 2026 – Escena principal", span: "tall"   },
  { id: 3,  src: "/media/coronawebp2.webp", alt: "Corona Capital 2026 – Multitud",         span: "normal" },
  { id: 4,  src: "/media/coronawebp1.webp", alt: "Corona Capital 2026 – Artistas",         span: "normal" },
  { id: 6,  src: "/media/coronawebp5.webp", alt: "Corona Capital 2026 – Escena principal", span: "tall"   },
  { id: 5,  src: "/media/coronawebp6.webp", alt: "Corona Capital 2026 – Multitud",         span: "normal" },
  { id: 7,  src: "/media/coronawebp7.webp", alt: "Corona Capital 2026 – Artistas",         span: "normal" },
  { id: 8,  src: "/media/corona5.jpg",      alt: "Corona Capital 2026 – Artistas",         span: "normal" },
  { id: 9,  src: "/media/corona6.jpg",      alt: "Corona Capital 2026 – Artistas",         span: "normal" },
  { id: 10, src: "/media/corona7.jpg",      alt: "Corona Capital 2026 – Artistas",         span: "normal" },
  { id: 11, src: "/media/corona8.jpg",      alt: "Corona Capital 2026 – Artistas",         span: "normal" },
  { id: 12, src: "/media/corona9.jpg",      alt: "Corona Capital 2026 – Artistas",         span: "normal" },
];

// ─── getContainer ────────────────────────────────────────────────────────────
// Your app scrolls inside .app-scroll-container, not window.
// All position math must be relative to that element's bounding rect.
function getContainer(): HTMLElement | null {
  return document.querySelector(".app-scroll-container");
}

// ─── useScrollProgress ───────────────────────────────────────────────────────
// Tracks 0→1 progress as the element enters the scroll container viewport:
//
//   progress = 0  →  element bottom is at the container bottom edge (just peeking in)
//   progress = 1  →  element top has reached 30% down from container top
//                    meaning the element is ~70% visible
//
// Updates on every scroll event so the transform tracks scroll position live.
function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const compute = () => {
      const container    = getContainer();
      const cRect        = container?.getBoundingClientRect();
      const cTop         = cRect?.top  ?? 0;
      const cHeight      = container?.clientHeight ?? window.innerHeight;

      const eRect        = el.getBoundingClientRect();
      // Element's top relative to the container's top edge
      const elTopRel     = eRect.top - cTop;

      // enterLine: where progress becomes > 0 (element bottom enters container bottom)
      // fullLine:  where progress = 1      (element top at 30% from container top)
      const enterLine    = cHeight;
      const fullLine     = cHeight * 0.30;

      const raw = (enterLine - elTopRel) / (enterLine - fullLine);
      setProgress(Math.min(Math.max(raw, 0), 1));
    };

    const target = getContainer() ?? window;
    target.addEventListener("scroll", compute, { passive: true });
    compute(); // compute on mount for items already in view

    return () => target.removeEventListener("scroll", compute);
  }, []);

  return { ref, progress };
}

// ─── GalleryItem ─────────────────────────────────────────────────────────────
function GalleryItem({ image, index }: { image: typeof IMAGES[0]; index: number }) {
  const { ref, progress } = useScrollProgress();
  const [hovered, setHovered] = useState(false);

  // Values at progress=0 (offscreen) → progress=1 (fully revealed)
  const opacity    = progress;                          // 0 → 1
  const scale      = 0.75 + progress * 0.25;           // 0.75 → 1.0
  const translateY = (1 - progress) * 48;              // 48px → 0px

  return (
    <div
      ref={ref}
      className={`gallery-item gallery-item--${image.span}`}
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        // NO css transition — we want it to follow the scroll position directly
        transition: "none",
        willChange: "opacity, transform",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="gallery-item__img-wrapper">
        <img
          src={image.src}
          alt={image.alt}
          className="gallery-item__img"
          loading="lazy"
        />
        <div className={`gallery-item__overlay ${hovered ? "gallery-item__overlay--visible" : ""}`}>
          <span className="gallery-item__label">{image.alt}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
export default function Gallery() {
  const { ref: titleRef, progress: titleProgress } = useScrollProgress();

  return (
    <section className="gallery" id="galeria">

      <div
        ref={titleRef}
        className="gallery__header"
        style={{
          opacity:   0.15 + titleProgress * 0.85,
          transform: `translateY(${(1 - titleProgress) * 24}px)`,
          transition: "none",
        }}
      >
        <span className="section-title__line" />
        <h2 className="section-title__text">Galería</h2>
        <span className="section-title__line" />
      </div>

      <div className="gallery__grid">
        {IMAGES.map((image, i) => (
          <GalleryItem key={image.id} image={image} index={i} />
        ))}
      </div>

    </section>
  );
}