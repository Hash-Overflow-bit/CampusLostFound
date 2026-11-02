import React, { useCallback, useEffect, useState } from "react";
import "./herosection.css";
import SEO from "../seo/SEO";
import { useAuth } from "../../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import ReportItemForm from "../reportForm/ReportItemForm";
import { authValidationUtils } from "../../utils/authValidation";
import ItemsList from "../items/ItemsList";
import LogoLoop from "../../animation/LogoLoop";
import PuLogo from "../../assets/Pu.png";
import NustLogo from "../../assets/Nust.png";
import FastLogo from "../../assets/Fast.png";
import UetLogo from "../../assets/UET.png";
import ComsatsLogo from "../../assets/Comsats.png";
import IbaLogo from "../../assets/IBA.png";
import QauLogo from "../../assets/QAU.png";
import GikiLogo from "../../assets/giki.png";
import UmtLogo from "../../assets/UMT.png";

const universityLogos = [PuLogo, NustLogo, FastLogo, UetLogo, ComsatsLogo, IbaLogo, QauLogo, GikiLogo, UmtLogo].map((src, i) => ({
  src,
  alt: `Partner campus ${i + 1}`,
}));

const Herosection = React.memo(() => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { user, isAuthenticated, isEmailVerified } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.location.hash) return;
    const sectionId = window.location.hash.slice(1);
    const timer = window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, []);

  const handleReportItemClick = useCallback(() => {
    if (showReportForm) {
      setShowReportForm(false);
      return;
    }

    const validation = authValidationUtils.validateReportAccess(user, isAuthenticated, isEmailVerified);
    if (isAuthenticated && user && user.uid && isEmailVerified) {
      setShowReportForm(true);
      return;
    }

    if (!validation.canReport) {
      validation.errors.forEach((error) => {
        if (error.action === "redirect_login" && !isAuthenticated) {
          navigate("/login", { state: { message: error.message, from: "report-item", redirectTo: "/" } });
        } else if (error.action === "show_alert") {
          alert(error.message);
        }
      });
      return;
    }

    setShowReportForm(true);
  }, [user, isAuthenticated, isEmailVerified, navigate, showReportForm]);

  const browse = () => document.querySelector(".items-list-container")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <SEO title="Campus Lost Found | Find what matters" description="A student-first lost and found network for university campuses." url="https://campus-lost-found-lac.vercel.app/" />

      <main className="clf-home">
        <section className="clf-hero">
          <div className="clf-doodle clf-doodle-one">↝</div>
          <div className="clf-doodle clf-doodle-two">✦</div>

          <div className="clf-hero-copy">
            <div className="clf-eyebrow"><span>●</span> Built for university communities</div>
            <h1>Lost something?<br /><span>Your campus can help</span><br />bring it back.</h1>
            <p>A friendly lost-and-found network where verified students report, discover and reunite with the things that matter.</p>
            <div className="clf-hero-actions">
              <button className="clf-primary" onClick={handleReportItemClick}>{showReportForm ? "Close report" : "Report lost item"}<span>↗</span></button>
              <button className="clf-secondary" onClick={browse}>I found something <span>→</span></button>
            </div>
            <div className="clf-trust"><div className="clf-faces"><span>H</span><span>A</span><span>M</span></div><strong>Students helping students</strong><small> · private campus network</small></div>
          </div>

          <div className="clf-hero-art" aria-hidden="true">
            <div className="clf-art-card clf-art-lost"><span className="clf-art-label">LOST</span><div className="clf-object">🎧</div><strong>Headphones</strong><small>Library · 2h ago</small></div>
            <div className="clf-art-card clf-art-found"><span className="clf-art-label">FOUND</span><div className="clf-object">🔑</div><strong>Keys</strong><small>Block C · today</small></div>
            <div className="clf-match-pill">✦ possible match <b>86%</b></div>
          </div>
          <div className="clf-clouds"><i></i><i></i><i></i><i></i><i></i></div>
        </section>

        <section className="clf-stats" aria-label="Campus Lost Found highlights">
          <div><b>43+</b><span>campuses</span></div>
          <div><b>18</b><span>items migrated</span></div>
          <div><b>Private</b><span>campus scoped</span></div>
          <div><b>Free</b><span>for students</span></div>
        </section>

        <section className="clf-how clf-anchor-section" id="how-it-works">
          <div className="clf-section-copy">
            <span className="clf-kicker">Simple by design</span>
            <h2>From “oh no” to<br /><em>found it.</em></h2>
            <p>Report in minutes. We keep sensitive details private and surface useful campus matches without exposing personal information.</p>
          </div>
          <div className="clf-steps">
            <article><b>01</b><div>✎</div><h3>Report it</h3><p>Add a photo, public location and just enough detail to make the item recognizable.</p></article>
            <article><b>02</b><div>✦</div><h3>Get matches</h3><p>Campus-scoped matching compares lost and found reports and ranks likely connections.</p></article>
            <article><b>03</b><div>✓</div><h3>Reconnect</h3><p>Verify ownership safely and arrange a return without publishing private contact details.</p></article>
          </div>
        </section>

        <section className="clf-campus-section clf-anchor-section" id="campuses">
          <div className="clf-campus-intro">
            <span className="clf-kicker">One network, many campuses</span>
            <h2>Your campus identity.<br />One shared recovery flow.</h2>
            <p>Campus Lost Found keeps reports scoped to the right university community so students see relevant items instead of a noisy public marketplace.</p>
          </div>
          <div className="clf-campus-orbit" aria-hidden="true">
            <span>LIBRARY</span><span>HOSTEL</span><span>LABS</span><span>CAFETERIA</span><span>SPORTS</span><strong>CLF</strong>
          </div>
        </section>

        <section className="clf-logo-strip" aria-label="Supported university network">
          <div className="clf-logo-heading">
            <span>University network</span>
            <p>Monochrome campus marks keep the focus on the shared student network.</p>
          </div>
          <div className="clf-logo-loop">
            <LogoLoop
              logos={universityLogos}
              speed={56}
              direction="left"
              logoHeight={46}
              gap={54}
              pauseOnHover
              fadeOut
              fadeOutColor="#fffbd7"
              ariaLabel="Pakistani universities"
              className="clf-skeleton-marquee"
            />
          </div>
        </section>

        <section className="clf-about clf-anchor-section" id="about">
          <div className="clf-about-card clf-about-main">
            <span className="clf-kicker">Why we exist</span>
            <h2>Built around the moment every student knows.</h2>
            <p>You leave class, check your pocket, and something important is gone. Campus Lost Found turns that stressful moment into a clear, private recovery flow built specifically for university life.</p>
            <div className="clf-about-tags"><span>Student-first</span><span>Campus-only context</span><span>Privacy by default</span></div>
          </div>
          <div className="clf-about-card clf-about-note">
            <span className="clf-note-icon">↗</span>
            <strong>Not a public classifieds board.</strong>
            <p>Reports are designed around recovery, not exposure. Public location stays general; sensitive details stay protected.</p>
          </div>
        </section>

        <section className="clf-use-cases">
          <div className="clf-use-cases-head">
            <span className="clf-kicker">Made for campus life</span>
            <h2>The things students actually lose.</h2>
          </div>
          <div className="clf-use-grid">
            <article><span>01</span><div>🎧</div><h3>Tech & accessories</h3><p>Headphones, chargers, calculators, USB drives and laptops.</p></article>
            <article><span>02</span><div>🪪</div><h3>Cards & IDs</h3><p>Student cards, access cards and documents that need a careful return.</p></article>
            <article><span>03</span><div>🎒</div><h3>Daily essentials</h3><p>Bags, bottles, keys, notebooks and the small things that derail a whole day.</p></article>
            <article><span>04</span><div>📚</div><h3>Academic items</h3><p>Books, lab gear, project material and class-specific belongings.</p></article>
          </div>
        </section>

        <section className="clf-safety-section" id="safety">
          <div className="clf-safety-visual" aria-hidden="true">
            <div className="clf-shield">✓</div>
            <span className="clf-safety-chip chip-one">campus scoped</span>
            <span className="clf-safety-chip chip-two">private details</span>
            <span className="clf-safety-chip chip-three">verified flow</span>
          </div>
          <div className="clf-safety-copy">
            <span className="clf-kicker">Safety before speed</span>
            <h2>Useful enough to match.<br />Private enough to trust.</h2>
            <p>Exact contact and sensitive item details should not become public just because something was lost. The platform separates public discovery information from private ownership data.</p>
            <div className="clf-safety-points"><span>✓ Campus-scoped discovery</span><span>✓ Private ownership details</span><span>✓ Controlled recovery flow</span></div>
          </div>
        </section>

        <section className="clf-search-zone" id="browse-reports">
          <div><span className="clf-kicker">Happening on campus</span><h2>See what students<br />have reported.</h2></div>
          <label className="clf-search"><span>⌕</span><input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Search items by title" /></label>
        </section>
      </main>

      {showReportForm && <section className="report-form-section"><ReportItemForm onClose={() => setShowReportForm(false)} onSubmit={() => setShowReportForm(false)} /></section>}
      <ItemsList searchQuery={searchValue} />

      <section className="clf-final-cta">
        <span className="clf-kicker">Keep campus moving</span>
        <h2>Found something?<br />Make someone’s day.</h2>
        <p>A two-minute report can save another student hours of searching.</p>
        <button className="clf-primary" onClick={handleReportItemClick}>Report an item <span>↗</span></button>
      </section>
    </>
  );
});

Herosection.displayName = "Herosection";
export default Herosection;
