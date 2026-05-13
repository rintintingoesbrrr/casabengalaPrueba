import Gallery from "./Gallery";
import Navbar from "./Navbar";
import { useEffect, useRef, useState } from "react";
import "./EventInfo.css";

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const IconPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconCity = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="9" width="13" height="13"/>
    <path d="M16 9V6a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
    <rect x="16" y="13" width="5" height="9"/>
    <line x1="7" y1="13" x2="7" y2="13.01"/>
    <line x1="11" y1="13" x2="11" y2="13.01"/>
    <line x1="7" y1="17" x2="7" y2="17.01"/>
    <line x1="11" y1="17" x2="11" y2="17.01"/>
  </svg>
);
const IconTicket = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
  </svg>
);

// ─── Data ────────────────────────────────────────────────────────────────────
const INFO_CARDS = [
  { Icon: IconPin,      label: "Sede",    value: "Autódromo Hermanos Rodríguez" },
  { Icon: IconCalendar, label: "Fechas",  value: "13, 14 y 15 de Noviembre 2026" },
  { Icon: IconCity,     label: "Ciudad",  value: "Ciudad de México, CDMX" },
  { Icon: IconTicket,   label: "Boletos", value: "ticketmaster.com.mx" },
];

const STATS = [
  { value: "18+",  label: "Ediciones" },
  { value: "100+", label: "Artistas" },
  { value: "3",    label: "Días" },
  { value: "200K", label: "Asistentes" },
];

const DAYS = [
  {
    id: "viernes",
    label: "Viernes 13",
    headliners: ["GORILLAZ", "LCD SOUNDSYSTEM", "DURAN DURAN"],
    mid: ["FONTAINES D.C.", "THE LIBERTINES", "BLOOD ORANGE", "LIKKE LI"],
    support: [
      "Basic Partner", "Black Honey", "Boyish", "Cardinals",
      "Chinese American Bear", "Groove Armada", "La Lom", "Minus the Bear",
      "Nia Archives", "Noah Guy", "Nova Twins", "PawPaw Rod",
      "Porches", "Ravyn Lenae", "Whatmore",
      "Alvvays", "Dry Cleaning", "Future Islands", "Hot Chip",
      "Japanese Breakfast", "Nation of Language", "Parquet Courts",
      "Phoenix", "Royel Otis", "Shame", "Soccer Mommy",
      "The Drums", "TV Girl", "Wet Leg", "Yeah Yeah Yeahs",
      "Young Fathers", "Yves Tumor",
    ],
  },
  {
    id: "sabado",
    label: "Sábado 14",
    headliners: ["MASSIVE ATTACK", "NINE INCH NAILS", "TURNSTILE"],
    mid: ["RICHARD ASHCROFT", "THE WAR ON DRUGS", "LITTLE SIMZ", "BASTILLE"],
    support: [
      "Ben UFO", "Cavetown", "Corinne Bailey Rae", "Editors",
      "Ezra Collective", "French Police", "Model/Actriz", "Not for Radio",
      "Perfume Genius", "Real Estate", "Toro y Moi", "Trampled by Turtles",
      "Ty Segall", "WhoMadeWho", "Wunderhorse",
      "Amyl and the Sniffers", "Arlo Parks", "Bicep",
      "Black Country, New Road", "Caribou", "Cigarettes After Sex",
      "DIIV", "FKA twigs", "Floating Points", "Idles",
      "Jockstrap", "Khruangbin", "Kneecap", "MJ Lenderman",
      "Overmono", "Polo & Pan", "Sleaford Mods", "Suki Waterhouse",
      "The Blaze", "Viagra Boys",
    ],
  },
  {
    id: "domingo",
    label: "Domingo 15",
    headliners: ["FLORENCE + THE MACHINE", "KINGS OF LEON", "PIXIES"],
    mid: ["CHARLIE PUTH", "DEATH CAB FOR CUTIE", "BLEACHERS", "JENNIE"],
    support: [
      "Cat Power", "Courteeners", "Deadletter", "Ecca Vandal",
      "Jordana", "Leon Thomas", "Máximo Park", "Momma",
      "Nia Archives", "Rudimental", "San Holo", "Sports",
      "The Army, The Navy", "The Beaches", "Tomora",
      "Beabadoobee", "Clairo", "Dayglow", "Empire of the Sun",
      "Girl in Red", "Gracie Abrams", "Haim", "Inhaler",
      "Joji", "Men I Trust", "MGMT", "Peach Pit",
      "Remi Wolf", "Still Woozy", "The Last Dinner Party",
      "The Marías", "Wallows", "Wolf Alice",
    ],
  },
];

// ─── useInView ───────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── InfoCard ────────────────────────────────────────────────────────────────
function InfoCard({ Icon, label, value, delay }: {
  Icon: () => JSX.Element; label: string; value: string; delay: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`info-card ${inView ? "info-card--visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="info-card__icon"><Icon /></span>
      <span className="info-card__label">{label}</span>
      <span className="info-card__value">{value}</span>
    </div>
  );
}

// ─── SectionTitle ────────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`section-title ${inView ? "section-title--visible" : ""}`}>
      <span className="section-title__line" />
      <h2 className="section-title__text">{children}</h2>
      <span className="section-title__line" />
    </div>
  );
}

// ─── EventDescription ────────────────────────────────────────────────────────
function EventDescription() {
  const { ref, inView } = useInView(0.1);
  return (
    <div ref={ref} className={`event-desc ${inView ? "event-desc--visible" : ""}`}>

      {/* Left — main copy */}
      <div className="event-desc__copy">
        <span className="event-desc__eyebrow">Sobre el evento</span>
        <h2 className="event-desc__headline">
          La música que<br />
          <span className="event-desc__headline--accent">define una era</span>
        </h2>
        <p className="event-desc__body">
          Corona Capital es el festival de música independiente y alternativa más
          importante de México. Desde 2010, reúne a los artistas más influyentes
          del mundo en un escenario único dentro del Autódromo Hermanos Rodríguez,
          en el corazón de la Ciudad de México.
        </p>
        <p className="event-desc__body">
          Tres días. Más de cien actos en escena. Una experiencia que va más allá
          de la música — arte, cultura, gastronomía y una comunidad que crece
          edición tras edición.
        </p>
      </div>

      {/* Right — stat grid */}
      <div className="event-desc__stats">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="event-desc__stat"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <span className="event-desc__stat-value">{s.value}</span>
            <span className="event-desc__stat-label">{s.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

// ─── LineupPanel ─────────────────────────────────────────────────────────────
function LineupPanel({ day, visible }: { day: typeof DAYS[0]; visible: boolean }) {
  return (
    <div className={`lineup-panel ${visible ? "lineup-panel--visible" : ""}`}>
      <div className="lineup-headliners">
        {day.headliners.map((a) => (
          <span key={a} className="lineup-headliner">{a}</span>
        ))}
      </div>
      <div className="lineup-mid">
        {day.mid.map((a) => (
          <span key={a} className="lineup-mid-artist">{a}</span>
        ))}
      </div>
      <div className="lineup-support">
        {day.support.map((a) => (
          <span key={a} className="lineup-support-artist">{a}</span>
        ))}
      </div>
    </div>
  );
}

// ─── EventInfo ───────────────────────────────────────────────────────────────
export default function EventInfo() {
  const [activeDay, setActiveDay] = useState(0);
  const { ref: lineupRef, inView: lineupInView } = useInView(0.1);

  return (
    <section className="event-info" id="evento">
      <Navbar />

      {/* Info cards */}
      <div className="event-info__cards">
        {INFO_CARDS.map((card, i) => (
          <InfoCard key={card.label} {...card} delay={i * 100} />
        ))}
      </div>

      {/* Event description */}
      <EventDescription />

      {/* Lineup */}
      <div className="event-info__lineup" ref={lineupRef}>
        <SectionTitle>Lineup 2026</SectionTitle>
        <div className="day-tabs" role="tablist" aria-label="Días del festival">
          {DAYS.map((day, i) => (
            <button
              key={day.id}
              className={`day-tab ${i === activeDay ? "day-tab--active" : ""}`}
              onClick={() => setActiveDay(i)}
              role="tab"
              aria-selected={i === activeDay}
            >
              {day.label}
            </button>
          ))}
        </div>
        <div className={`lineup-panels ${lineupInView ? "lineup-panels--visible" : ""}`}>
          {DAYS.map((day, i) => (
            <LineupPanel key={day.id} day={day} visible={i === activeDay} />
          ))}
        </div>
      </div>

      {/* Gallery */}
      <Gallery />
    </section>
  );
}