import React, { useState } from "react";
import { CiLock, CiUser, CiMail, CiInfo, CiClock2 } from "react-icons/ci";
import SEO from "../componenets/seo/SEO";
import "./PrivacyPolicy.css";

const PrivacyPolicySimple = () => {
  const [lastUpdated] = useState("January 15, 2024");

  return (
    <>
      <SEO
        title="Privacy Policy - CampusLostFound | Data Protection & User Privacy"
        description="Learn how CampusLostFound protects your personal information, handles data security, and respects your privacy rights."
        keywords="privacy policy, data protection, user privacy, personal information"
      />

      <div className="privacy-container">
        {/* Hero Section */}
        <section className="privacy-hero">
          <div className="container">
            <h1 className="campus-hero-title">Privacy Policy</h1>
            <p className="hero-description decsription">
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your personal information when you use
              CampusLostFound.
            </p>
            <div className="last-updated">
              <CiClock2 className="update-icon" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="privacy-content">
          <div className="container">
            <div className="privacy-sections">
              <section className="privacy-section">
                <div className="section-header">
                  <CiUser />
                  <h2>1. Information We Collect</h2>
                </div>
                <p className="section-intro">
                  We collect information you provide directly to us and
                  information we collect automatically when you use our
                  services.
                </p>

                <div className="subsection">
                  <h3>Information You Provide</h3>
                  <ul className="policy-list">
                    <li>
                      Account registration information (name, university email,
                      campus)
                    </li>
                    <li>Profile information and preferences</li>
                    <li>
                      Lost and found item reports (descriptions, photos,
                      location data)
                    </li>
                    <li>Communications with us (support messages, feedback)</li>
                  </ul>
                </div>
              </section>

              <section className="privacy-section">
                <div className="section-header">
                  <CiInfo />
                  <h2>2. How We Use Your Information</h2>
                </div>
                <p className="section-intro">
                  We use the information we collect to provide, maintain, and
                  improve our services.
                </p>

                <div className="subsection">
                  <h3>Primary Uses</h3>
                  <ul className="policy-list">
                    <li>
                      Facilitate lost and found item matching and recovery
                    </li>
                    <li>
                      Verify university affiliation and maintain community trust
                    </li>
                    <li>Send notifications about potential item matches</li>
                    <li>Provide customer support and respond to inquiries</li>
                  </ul>
                </div>
              </section>

              <section className="privacy-section">
                <div className="section-header">
                  <CiLock />
                  <h2>3. Data Security</h2>
                </div>
                <p className="section-intro">
                  We implement appropriate technical and organizational measures
                  to protect your personal information.
                </p>

                <div className="subsection">
                  <h3>Security Measures</h3>
                  <ul className="policy-list">
                    <li>Encryption of data in transit and at rest</li>
                    <li>
                      Regular security audits and vulnerability assessments
                    </li>
                    <li>Access controls and authentication systems</li>
                    <li>Secure data storage with reputable cloud providers</li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Contact Information */}
            <section className="privacy-contact">
              <div className="contact-card">
                <h3>Questions About This Policy?</h3>
                <p>
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact us at
                  privacy@campuslostfound.com
                </p>
              </div>
            </section>
          </div>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicySimple;
