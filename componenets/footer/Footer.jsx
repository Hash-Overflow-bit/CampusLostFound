import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CiMail,
  CiPhone,
  CiLocationOn,
  CiTwitter,
  CiLinkedin,
} from "react-icons/ci";
import { FaGithub } from "react-icons/fa";
import "./Footer.css";
import logoIcon from "../../assets/logo (2).png";
import { saveSubscriber } from "../../services/subscriberService";

const Footer = () => {
  // Scroll to top on navigation
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const currentYear = new Date().getFullYear();
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [subStatus, setSubStatus] = useState("");

  const universities = ["UMT", "NUST", "FAST", "COMSATS", "UET", "PU", "QAU"];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subscriberEmail || !selectedUniversity) {
      setSubStatus("Please enter your email and select a university.");
      return;
    }
    const result = await saveSubscriber(selectedUniversity, subscriberEmail);
    if (result.success) {
      setSubStatus("Subscribed successfully!");
      setSubscriberEmail("");
    } else {
      setSubStatus("Error: " + result.error);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <div
              className="footer-logo"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <img
                src={logoIcon}
                alt="Logo"
                style={{ height: "32px", verticalAlign: "middle" }}
              />
              <h3 className="footer-logo-text">Campus Lost Found</h3>
            </div>
            <p className="footer-description">
              Connecting students with their lost belongings across Pakistan's
              leading universities. Safe, secure, and community-driven lost and
              found platform.
            </p>
            <div className="footer-social">
              <a
                href="https://github.com/DevwithHahsir"
                className="social-link"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href="https://findmyai.org/"
                className="social-link"
                aria-label="Twitter"
              >
                <CiTwitter />
              </a>
              <a
                href="https://www.linkedin.com/in/hashirmehboob/"
                className="social-link"
                aria-label="LinkedIn"
              >
                <CiLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/how-it-works">How It Works</Link>
              </li>
              <li>
                <Link to="/universities">Universities</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li>
                <Link to="/report">Report Lost Item</Link>
              </li>
              <li>
                <Link to="/report">Report Found Item</Link>
              </li>
              <li>
                <Link to="/dashboard">My Dashboard</Link>
              </li>
              <li>
                <Link to="/how-it-works#safety">Safety Guidelines</Link>
              </li>
              <li>
                <Link to="/how-it-works#faq">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li>
                <Link to="/privacy-policy" onClick={handleScrollToTop}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" onClick={handleScrollToTop}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={handleScrollToTop}>
                  Report Issues
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={handleScrollToTop}>
                  Data Protection
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={handleScrollToTop}>
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-heading">Contact Info</h4>
            <div className="footer-contact">
              <div className="contact-item">
                <CiMail className="contact-icon" />
                <span>campuslostfound@gmail.com</span>
              </div>
              <div className="contact-item">
                <CiPhone className="contact-icon" />
                <span>+92 3224121825</span>
              </div>
              <div className="contact-item">
                <CiLocationOn className="contact-icon" />
                <span>Lahore, Pakistan</span>
              </div>
            </div>
            <div className="footer-universities">
              <p className="universities-text">Serving 20+ Universities</p>
              <p className="universities-list">
                NUST • FAST • COMSATS • UET • PU • QAU
              </p>
            </div>
          </div>
        </div>

        {/* Subscriber Input */}
        <div className="footer-section" style={{ marginBottom: "2rem" }}>
          <h4 className="footer-heading">Subscribe for Updates</h4>
          <form
            onSubmit={handleSubscribe}
            className="footer-subscriber-form"
            style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={subscriberEmail}
              onChange={(e) => setSubscriberEmail(e.target.value)}
              required
              style={{
                padding: "0.5rem",
                borderRadius: "6px",
              }}
            />
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              required
              style={{
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select University</option>
              {universities.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                background: "#4382E4",
                color: "#fff",
                border: "none",
                fontWeight: "600",
              }}
            >
              Subscribe
            </button>
          </form>
          {subStatus && (
            <p
              style={{
                marginTop: "0.5rem",
                color: subStatus.includes("success") ? "#59B888" : "#dc2626",
              }}
            >
              {subStatus}
            </p>
          )}
        </div>
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>
                &copy; {currentYear} Campus Lost Found. All rights reserved.
              </p>
            </div>
            <div className="footer-bottom-links">
              <Link to="/privacy-policy" onClick={handleScrollToTop}>
                Privacy
              </Link>

              <Link to="/terms-of-service" onClick={handleScrollToTop}>
                Terms
              </Link>

              <Link to="/contact" onClick={handleScrollToTop}>
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
