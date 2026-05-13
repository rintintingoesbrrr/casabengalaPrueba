import { useEffect, useState, useCallback } from "react";
import Navbar from "./Navbar";
import "./Registration.css";

// ─── Timer config ─────────────────────────────────────────────────────────────
const TIMER_SECONDS = 1 * 60;

// ─── Validation ──────────────────────────────────────────────────────────────
function validate(fields: { nombre: string; correo: string; mensaje: string }) {
  const errors: Record<string, string> = {};
  if (!fields.nombre.trim())
    errors.nombre = "El nombre es obligatorio";
  else if (fields.nombre.trim().length < 2)
    errors.nombre = "Mínimo 2 caracteres";
  if (!fields.correo.trim())
    errors.correo = "El correo es obligatorio";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.correo))
    errors.correo = "Correo inválido";
  if (!fields.mensaje.trim())
    errors.mensaje = "El mensaje es obligatorio";
  else if (fields.mensaje.trim().length < 10)
    errors.mensaje = "Mínimo 10 caracteres";
  return errors;
}

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);
  const [expired, setExpired]     = useState(false);
  const [tick, setTick]           = useState(false); // flips every second

  useEffect(() => {
    if (remaining <= 0) { setExpired(true); return; }
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { clearInterval(id); setExpired(true); return 0; }
        return r - 1;
      });
      setTick((t) => !t); // alternate every second to re-trigger animation
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const fraction = remaining / seconds;
  return { mm, ss, expired, fraction, tick };
}

// ─── Background lines ─────────────────────────────────────────────────────────
function BackgroundLines() {
  return (
    <div className="reg-bg" aria-hidden="true">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="reg-bg__line" style={{ "--i": i } as React.CSSProperties} />
      ))}
    </div>
  );
}

// ─── Noise overlay ────────────────────────────────────────────────────────────
function NoiseOverlay() {
  return <div className="reg-noise" aria-hidden="true" />;
}

// ─── Timer widget — fixed top-right ──────────────────────────────────────────
function TimerWidget({ fraction, mm, ss, expired, tick }: {
  fraction: number; mm: string; ss: string; expired: boolean; tick: boolean;
}) {
  const R    = 22;
  const C    = 2 * Math.PI * R;
  const dash = C * fraction;

  const urgency = fraction <= 0.2; // last 20% — more aggressive shake

  const color = fraction > 0.5
    ? "var(--cc-teal)"
    : fraction > 0.2
    ? "var(--cc-yellow)"
    : "var(--cc-pink)";

  return (
    <div
      className={`timer-widget${expired ? " timer-widget--expired" : ""}${urgency ? " timer-widget--urgent" : ""}`}
      aria-live="polite"
    >
      <svg viewBox="0 0 52 52" width="52" height="52" className="timer-widget__ring">
        <circle cx="26" cy="26" r={R} className="timer-widget__track" />
        <circle
          cx="26" cy="26" r={R}
          className="timer-widget__arc"
          style={{
            strokeDasharray: `${dash} ${C}`,
            stroke: color,
            transition: "stroke-dasharray 1s linear, stroke 1s ease",
          }}
        />
      </svg>

      <div className="timer-widget__text">
        {/* key alternates every tick — forces React to remount the span,
            which restarts the CSS animation from scratch each second    */}
        <span
          key={`mm-${tick}`}
          className={`timer-widget__digits timer-widget__digits--mm${urgency ? " timer-widget__digits--urgent" : ""}`}
        >
          {expired ? "00" : mm}
        </span>

        <span className="timer-widget__colon">:</span>

        <span
          key={`ss-${tick}`}
          className={`timer-widget__digits timer-widget__digits--ss${urgency ? " timer-widget__digits--urgent" : ""}`}
        >
          {expired ? "00" : ss}
        </span>

        <span className="timer-widget__label">
          {expired ? "EXPIRADO" : "RESTANTE"}
        </span>
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({
  id, label, type = "text", value, error, disabled, onChange, onBlur, children,
}: {
  id: string; label: string; type?: string; value: string;
  error?: string; disabled?: boolean;
  onChange: (v: string) => void; onBlur?: () => void;
  children?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className={`reg-field${error ? " reg-field--error" : ""}${focused ? " reg-field--focused" : ""}${disabled ? " reg-field--disabled" : ""}`}>
      <label className={`reg-field__label${hasValue || focused ? " reg-field__label--up" : ""}`} htmlFor={id}>
        {label}
      </label>
      {children ? (
        <textarea
          id={id} className="reg-field__input reg-field__textarea"
          value={value} disabled={disabled} rows={4}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.(); }}
        />
      ) : (
        <input
          id={id} type={type} className="reg-field__input"
          value={value} disabled={disabled} autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.(); }}
        />
      )}
      <div className="reg-field__bar"><div className="reg-field__bar-fill" /></div>
      {error && <span className="reg-field__error">{error}</span>}
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ nombre }: { nombre: string }) {
  return (
    <div className="reg-success">
      <div className="reg-success__icon">
        <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
          <circle cx="32" cy="32" r="30" stroke="var(--cc-teal)" strokeWidth="1.5" />
          <polyline points="18,33 27,42 46,22" stroke="var(--cc-teal)" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" className="reg-success__check" />
        </svg>
      </div>
      <h2 className="reg-success__title">¡Listo, {nombre.split(" ")[0]}!</h2>
      <p className="reg-success__body">
        Tu registro fue recibido. Te enviaremos la confirmación a tu correo.
      </p>
      {[
        { label: "EVENTO", value: "Corona Capital 2026" },
        { label: "FECHA",  value: "13 · 14 · 15 de Noviembre" },
        { label: "SEDE",   value: "Autódromo Hermanos Rodríguez · CDMX" },
      ].map(({ label, value }) => (
        <div key={label} className="reg-success__detail">
          <span className="reg-success__detail-label">{label}</span>
          <span className="reg-success__detail-value">{value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Expired screen ───────────────────────────────────────────────────────────
function ExpiredScreen() {
  return (
    <div className="reg-expired">
      <div className="reg-expired__icon" aria-hidden="true">✦</div>
      <h2 className="reg-expired__title">Tiempo agotado</h2>
      <p className="reg-expired__body">
        La ventana de registro ha expirado.<br />
        Regresa pronto para la próxima apertura.
      </p>
      <button className="reg-expired__cta" onClick={() => window.location.reload()}>
        Intentar de nuevo
      </button>
    </div>
  );
}

// ─── Registration ─────────────────────────────────────────────────────────────
export default function Registration() {
  const [fields, setFields]           = useState({ nombre: "", correo: "", mensaje: "" });
  const [errors, setErrors]           = useState<Record<string, string>>({});
  const [touched, setTouched]         = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [serverError, setServerError] = useState("");
  const [revealed, setRevealed]       = useState(false);

  const { mm, ss, expired, fraction, tick } = useCountdown(TIMER_SECONDS);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(t);
  }, []);

  const set = (key: string) => (v: string) => {
    setFields((f) => ({ ...f, [key]: v }));
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const touch = (key: string) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    const e = validate({ ...fields });
    if (e[key]) setErrors((prev) => ({ ...prev, [key]: e[key] }));
  };

  const handleSubmit = useCallback(async () => {
    setTouched({ nombre: true, correo: true, mensaje: true });
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setServerError("");
    try {
    const res = await fetch(
    import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/api/register`
      : "/api/register",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Error del servidor");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Error inesperado. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }, [fields]);

  return (
    <div className="reg-page" id="registro">
      <BackgroundLines />
      <NoiseOverlay />

      <TimerWidget fraction={fraction} mm={mm} ss={ss} expired={expired} tick={tick} />

      <Navbar />

      <main className={`reg-main ${revealed ? "reg-main--revealed" : ""}`}>

        <div className="reg-aside">
          <span className="reg-aside__eyebrow">Registro oficial</span>
          <h1 className="reg-aside__title">
            <span className="reg-aside__title-line">Corona</span>
            <span className="reg-aside__title-line reg-aside__title-line--accent">Capital</span>
            <span className="reg-aside__title-line">2026</span>
          </h1>
          <p className="reg-aside__date">13 · 14 · 15 de Noviembre</p>
          <div className="reg-aside__divider" />
          <div className="reg-aside__meta">
            {[
              { label: "Sede",    value: "Autódromo Hermanos Rodríguez" },
              { label: "Ciudad",  value: "Ciudad de México, CDMX" },
              { label: "Boletos", value: "ticketmaster.com.mx" },
            ].map(({ label, value }) => (
              <div key={label} className="reg-aside__meta-item">
                <span className="reg-aside__meta-label">{label}</span>
                <span className="reg-aside__meta-value">{value}</span>
              </div>
            ))}
          </div>
          <ul className="reg-aside__artists" aria-hidden="true">
            {["GORILLAZ", "MASSIVE ATTACK", "FLORENCE", "PIXIES", "NIN"].map((a) => (
              <li key={a} className="reg-aside__artist">{a}</li>
            ))}
          </ul>
        </div>

        <div className="reg-form-wrap">
          <div className="reg-mobile-header">
            <span className="reg-aside__eyebrow">Registro oficial</span>
            <p className="reg-mobile-header__title">Corona <span>Capital</span> 2026</p>
            <p className="reg-aside__date">13 · 14 · 15 de Noviembre</p>
          </div>

          {submitted ? (
            <SuccessScreen nombre={fields.nombre} />
          ) : expired ? (
            <ExpiredScreen />
          ) : (
            <div className="reg-form">
              <div className="reg-form__header">
                <span className="reg-form__step">01 / 01</span>
                <h2 className="reg-form__title">Tus datos</h2>
                <p className="reg-form__subtitle">
                  Completa el formulario antes de que el tiempo expire.
                </p>
              </div>
              <div className="reg-form__fields">
                <Field id="nombre" label="Nombre completo"
                  value={fields.nombre} error={touched.nombre ? errors.nombre : undefined}
                  onChange={set("nombre")} onBlur={touch("nombre")} />
                <Field id="correo" label="Correo electrónico" type="email"
                  value={fields.correo} error={touched.correo ? errors.correo : undefined}
                  onChange={set("correo")} onBlur={touch("correo")} />
                <Field id="mensaje" label="¿Por qué quieres ir?"
                  value={fields.mensaje} error={touched.mensaje ? errors.mensaje : undefined}
                  onChange={set("mensaje")} onBlur={touch("mensaje")}>
                  textarea
                </Field>
              </div>
              {serverError && <p className="reg-form__server-error">{serverError}</p>}
              <button
                className={`reg-form__submit ${submitting ? "reg-form__submit--loading" : ""}`}
                onClick={handleSubmit} disabled={submitting} aria-busy={submitting}
              >
                {submitting ? (
                  <span className="reg-form__spinner" />
                ) : (
                  <>Registrarme ahora <span className="reg-form__arrow">→</span></>
                )}
              </button>
              <p className="reg-form__legal">
                Al registrarte aceptas recibir comunicaciones de Corona Capital 2026.
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}