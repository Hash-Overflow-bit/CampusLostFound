import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { saveSubscriber } from "../../services/subscriberService";

const universities = ["UMT", "NUST", "FAST", "COMSATS", "UET", "PU", "QAU"];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [subStatus, setSubStatus] = useState("");

  const handleSubscribe = async (event) => {
    event.preventDefault();
    if (!subscriberEmail || !selectedUniversity) {
      setSubStatus("Add your email and campus first.");
      return;
    }

    const result = await saveSubscriber(selectedUniversity, subscriberEmail);
    if (result.success) {
      setSubStatus("You’re on the list.");
      setSubscriberEmail("");
      setSelectedUniversity("");
    } else {
      setSubStatus("We couldn’t save that right now.");
    }
  };

  const scrollToSection = (sectionId) => {
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <footer className="clf-footer">
      <div className="clf-footer-inner">
        <div className="clf-footer-masthead" aria-label="Campus Lost Found">
          <span>Campus</span><strong>LostFound</strong>
          <i className="clf-footer-scribble" aria-hidden="true">↝</i>
          <i className="clf-footer-dot footer-dot-one" aria-hidden="true"></i>
          <i className="clf-footer-dot footer-dot-two" aria-hidden="true"></i>
        </div>

        <div className="clf-footer-grid">
          <section className="clf-footer-contact">
            <span className="clf-footer-label">Get in touch</span>
            <p>Built for students across Pakistani university campuses.</p>
            <a href="mailto:campuslostfound@gmail.com">campuslostfound@gmail.com</a>
            <small>Lahore, Pakistan</small>
          </section>

          <section>
            <span className="clf-footer-label">Explore</span>
            <Link to="/">Home</Link>
            <Link to="/#how-it-works" onClick={() => scrollToSection("how-it-works")}>How it works</Link>
            <Link to="/#campuses" onClick={() => scrollToSection("campuses")}>Campuses</Link>
            <Link to="/#about" onClick={() => scrollToSection("about")}>About</Link>
          </section>

          <section>
            <span className="clf-footer-label">Student tools</span>
            <Link to="/report">Report an item</Link>
            <Link to="/dashboard">My dashboard</Link>
            <Link to="/#browse-reports" onClick={() => scrollToSection("browse-reports")}>Browse reports</Link>
            <Link to="/#safety" onClick={() => scrollToSection("safety")}>Safety & privacy</Link>
          </section>

          <section>
            <span className="clf-footer-label">Helpful</span>
            <Link to="/privacy-policy">Privacy policy</Link>
            <Link to="/terms-of-service">Terms of service</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/blog">Updates</Link>
          </section>
        </div>

        <div className="clf-footer-subscribe">
          <div>
            <span className="clf-footer-label">Campus updates</span>
            <h3>Useful updates, not inbox noise.</h3>
          </div>
          <form onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="student@university.edu"
              value={subscriberEmail}
              onChange={(event) => setSubscriberEmail(event.target.value)}
              aria-label="Email address"
              required
            />
            <select
              value={selectedUniversity}
              onChange={(event) => setSelectedUniversity(event.target.value)}
              aria-label="University"
              required
            >
              <option value="">Campus</option>
              {universities.map((university) => <option key={university} value={university}>{university}</option>)}
            </select>
            <button type="submit">Join <span>↗</span></button>
          </form>
          {subStatus && <p className="clf-footer-status" role="status">{subStatus}</p>}
        </div>

        <div className="clf-footer-bottom">
          <p>© {currentYear} Campus Lost Found. All rights reserved.</p>
          <div>
            <Link to="/terms-of-service">User agreement</Link>
            <Link to="/privacy-policy">Data privacy</Link>
            <Link to="/contact">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
