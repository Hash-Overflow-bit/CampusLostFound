import { Link } from "react-router-dom";
import "./AuthShell.css";

export default function AuthShell({
  eyebrow = "Campus Lost Found",
  title,
  subtitle,
  children,
  sideTitle = "Find what matters.\nKeep it inside campus.",
  sideCopy = "A private lost-and-found network built around verified university communities.",
  note = "Campus-scoped · privacy-first · student-friendly",
}) {
  return (
    <main className="auth-shell">
      <section className="auth-shell__story" aria-label="Campus Lost Found introduction">
        <Link className="auth-shell__brand" to="/" aria-label="Campus Lost Found home">
          <span className="auth-shell__brand-mark">C</span>
          <span>Campus<span>LostFound</span></span>
        </Link>

        <div className="auth-shell__story-copy">
          <span className="auth-shell__story-kicker">Verified campus network</span>
          <h2>{sideTitle.split("\n").map((line, index) => <span key={line}>{line}{index === 0 && <br />}</span>)}</h2>
          <p>{sideCopy}</p>

          <div className="auth-shell__mini-cards" aria-hidden="true">
            <article className="auth-shell__mini-card auth-shell__mini-card--lost">
              <span>LOST</span><strong>🎧 Headphones</strong><small>Library · today</small>
            </article>
            <article className="auth-shell__mini-card auth-shell__mini-card--found">
              <span>FOUND</span><strong>🔑 Keys</strong><small>Block C · 1h ago</small>
            </article>
            <div className="auth-shell__match-pill">✦ possible match <b>86%</b></div>
          </div>
        </div>

        <p className="auth-shell__note">{note}</p>
      </section>

      <section className="auth-shell__panel">
        <div className="auth-shell__panel-inner">
          <Link className="auth-shell__back" to="/">← Back to home</Link>
          <div className="auth-shell__heading">
            <span className="auth-shell__eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
