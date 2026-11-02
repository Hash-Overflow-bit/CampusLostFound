import React, { useState } from "react";
import { CiLock, CiUser, CiMail, CiClock2 } from "react-icons/ci";
import SEO from "../componenets/seo/SEO";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  const [lastUpdated] = useState("January 15, 2024");

  const sections = [
    {
      id: "information-collection",
      title: "1. Information We Collect",
      icon: <CiUser />,
      content: {
        intro:
          "We collect information you provide directly to us and information we collect automatically when you use our services.",
        subsections: [
          {
            title: "Information You Provide",
            items: [
              "Account registration information (name, university email, campus)",
              "Profile information and preferences",
              "Lost and found item reports (descriptions, photos, location data)",
              "Communications with us (support messages, feedback)",
              "User-generated content (comments, reviews, testimonials)",
            ],
          },
          {
            title: "Automatically Collected Information",
            items: [
              "Device information (browser type, operating system, IP address)",
              "Usage data (pages viewed, time spent, features used)",
              "Location data (when you enable location services)",
              "Cookies and similar tracking technologies",
              "Log files and error reports",
            ],
          },
        ],
      },
    },
    {
      id: "information-use",
      title: "2. How We Use Your Information",
      icon: <CiMail />,
      content: {
        intro:
          "We use the information we collect to provide, maintain, and improve our services.",
        subsections: [
          {
            title: "Primary Uses",
            items: [
              "Facilitate lost and found item matching and recovery",
              "Enable communication between users for item recovery",
              "Verify university affiliations and maintain community trust",
              "Provide customer support and respond to inquiries",
              "Send important service announcements and updates",
            ],
          },
          {
            title: "Secondary Uses",
            items: [
              "Analyze usage patterns to improve user experience",
              "Prevent fraud, abuse, and security incidents",
              "Comply with legal obligations and enforce our terms",
              "Conduct research and analytics for service improvement",
              "Send marketing communications (with your consent)",
            ],
          },
        ],
      },
    },
    {
      id: "information-sharing",
      title: "3. Information Sharing and Disclosure",
      icon: <CiLock />,
      content: {
        intro:
          "We do not sell, trade, or rent your personal information to third parties. We only share information in the following circumstances:",
        subsections: [
          {
            title: "With Your Consent",
            items: [
              "When you choose to contact another user about an item",
              "When you opt-in to receive information from partner universities",
              "When you participate in surveys or promotional activities",
            ],
          },
          {
            title: "Service Operations",
            items: [
              "With trusted service providers who assist in our operations",
              "With university partners for official lost and found services",
              "For payment processing and fraud prevention",
              "With analytics providers to understand usage patterns",
            ],
          },
          {
            title: "Legal Requirements",
            items: [
              "To comply with applicable laws and regulations",
              "To respond to legal process or government requests",
              "To protect the rights, property, or safety of users",
              "To investigate potential violations of our terms",
            ],
          },
        ],
      },
    },
    {
      id: "data-security",
      title: "4. Data Security and Protection",
      icon: <CiLock />,
      content: {
        intro:
          "We implement appropriate technical and organizational measures to protect your personal information.",
        subsections: [
          {
            title: "Security Measures",
            items: [
              "Encryption of data in transit and at rest",
              "Regular security audits and vulnerability assessments",
              "Access controls and authentication requirements",
              "Secure cloud infrastructure with leading providers",
              "Regular backup and disaster recovery procedures",
            ],
          },
          {
            title: "Data Retention",
            items: [
              "Account information retained while your account is active",
              "Item reports retained for 2 years or until resolved",
              "Communication logs retained for 1 year for support purposes",
              "Analytics data aggregated and anonymized after 6 months",
              "Right to request deletion of your personal data",
            ],
          },
        ],
      },
    },
    {
      id: "user-rights",
      title: "5. Your Rights and Choices",
      icon: <CiUser />,
      content: {
        intro:
          "You have certain rights regarding your personal information and how we use it.",
        subsections: [
          {
            title: "Access and Control",
            items: [
              "Access and review your personal information",
              "Update or correct inaccurate information",
              "Delete your account and associated data",
              "Download a copy of your personal data",
              "Opt-out of marketing communications",
            ],
          },
          {
            title: "Privacy Controls",
            items: [
              "Control who can see your contact information",
              "Manage your communication preferences",
              "Choose whether to share usage analytics",
              "Control location sharing and tracking",
              "Manage cookie and tracking preferences",
            ],
          },
        ],
      },
    },
    {
      id: "cookies-tracking",
      title: "6. Cookies and Tracking Technologies",
      icon: <CiLock />,
      content: {
        intro:
          "We use cookies and similar technologies to enhance your experience and understand how our service is used.",
        subsections: [
          {
            title: "Types of Cookies",
            items: [
              "Essential cookies for basic website functionality",
              "Analytics cookies to understand usage patterns",
              "Preference cookies to remember your settings",
              "Security cookies to protect against fraud",
              "Third-party cookies from integrated services",
            ],
          },
          {
            title: "Managing Cookies",
            items: [
              "Browser settings to control cookie acceptance",
              "Opt-out mechanisms for analytics tracking",
              "Third-party opt-out tools and privacy browsers",
              "Regular cookie preference reviews",
              "Clear explanations of cookie purposes",
            ],
          },
        ],
      },
    },
    {
      id: "third-party-services",
      title: "7. Third-Party Services and Links",
      icon: <CiMail />,
      content: {
        intro:
          "Our service may contain links to or integrate with third-party services that have their own privacy policies.",
        subsections: [
          {
            title: "Integrated Services",
            items: [
              "Google Analytics for usage analytics",
              "Firebase for authentication and database services",
              "Email service providers for communications",
              "Payment processors for premium features",
              "Social media platforms for sharing features",
            ],
          },
          {
            title: "External Links",
            items: [
              "University websites and official resources",
              "Partner organization websites",
              "Educational and safety resources",
              "Social media and blog links",
              "Third-party app download links",
            ],
          },
        ],
      },
    },
    {
      id: "international-transfers",
      title: "8. International Data Transfers",
      icon: <CiLock />,
      content: {
        intro:
          "As we serve universities across Pakistan and may use international service providers, your information may be transferred and stored outside Pakistan.",
        subsections: [
          {
            title: "Transfer Safeguards",
            items: [
              "Adequate protection standards for international transfers",
              "Contractual protections with international service providers",
              "Compliance with applicable data protection laws",
              "Regular review of transfer arrangements",
              "User notification of significant changes to data handling",
            ],
          },
        ],
      },
    },
    {
      id: "childrens-privacy",
      title: "9. Children's Privacy",
      icon: <CiUser />,
      content: {
        intro:
          "Our service is designed for university students who are typically 18 years or older.",
        subsections: [
          {
            title: "Age Requirements",
            items: [
              "Service intended for users 18 years and older",
              "University email verification helps ensure age compliance",
              "No intentional collection of information from children under 13",
              "Prompt deletion if we discover information from underage users",
              "Parental notification procedures for underage account removal",
            ],
          },
        ],
      },
    },
    {
      id: "policy-changes",
      title: "10. Changes to This Privacy Policy",
      icon: <CiClock2 />,
      content: {
        intro:
          "We may update this privacy policy from time to time to reflect changes in our practices or applicable law.",
        subsections: [
          {
            title: "Update Process",
            items: [
              "Prominent notice of material changes on our website",
              "Email notification to registered users for significant changes",
              "Reasonable advance notice before changes take effect",
              "Opportunity to review changes before they become effective",
              "Right to discontinue service if you disagree with changes",
            ],
          },
        ],
      },
    },
  ];

  return (
    <>
      <SEO
        title="Privacy Policy - CampusLostFound | Data Protection & User Privacy"
        description="Learn how CampusLostFound protects your personal information, handles data security, and respects your privacy rights. Complete privacy policy for users."
        keywords="privacy policy, data protection, user privacy, personal information, data security, campus lost found"
      />

      <div className="privacy-container">
        {/* Hero Section */}
        <section className="privacy-hero">
          <div className="container">
            <h1 className="campus-hero-title">Privacy Policy</h1>
            <p className="hero-subtitle">
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

        {/* Quick Summary */}
        <section className="privacy-summary">
          <div className="container">
            <h2>Privacy Policy Summary</h2>
            <div className="summary-grid">
              <div className="summary-card">
                <CiUser className="summary-icon" />
                <h3>What We Collect</h3>
                <p>
                  We collect information you provide (account details, item
                  reports) and automatic data (usage analytics, device info) to
                  provide our service.
                </p>
              </div>

              <div className="summary-card">
                <CiLock className="summary-icon" />
                <h3>How We Protect</h3>
                <p>
                  We use encryption, secure servers, and strict access controls
                  to protect your data. We never sell your personal information
                  to third parties.
                </p>
              </div>

              <div className="summary-card">
                <CiMail className="summary-icon" />
                <h3>Your Rights</h3>
                <p>
                  You can access, update, or delete your information anytime.
                  You control your privacy settings and communication
                  preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="privacy-content">
          <div className="container">
            <div className="content-layout">
              {/* Table of Contents */}
              <div className="toc-sidebar">
                <h3>Table of Contents</h3>
                <nav className="toc-nav">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="toc-link"
                    >
                      {section.icon}
                      <span>{section.title}</span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Main Content */}
              <div className="policy-content">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="policy-section"
                  >
                    <div className="section-header">
                      {section.icon}
                      <h2>{section.title}</h2>
                    </div>

                    <p className="section-intro">{section.content.intro}</p>

                    {section.content.subsections &&
                      section.content.subsections.map((subsection, index) => (
                        <div key={index} className="subsection">
                          <h3>{subsection.title}</h3>
                          <ul className="policy-list">
                            {subsection.items &&
                              subsection.items.map((item, itemIndex) => (
                                <li key={itemIndex}>{item}</li>
                              ))}
                          </ul>
                        </div>
                      ))}
                  </section>
                ))}

                {/* Contact Information */}
                <section className="contact-section">
                  <h2>Contact Us About Privacy</h2>
                  <p>
                    If you have questions about this Privacy Policy or our data
                    practices, please contact us:
                  </p>
                  <div className="contact-info">
                    <div className="contact-item">
                      <CiMail className="contact-icon" />
                      <div>
                        <strong>Email:</strong>
                        <span>privacy@campuslostfound.pk</span>
                      </div>
                    </div>
                    <div className="contact-item">
                      <CiUser className="contact-icon" />
                      <div>
                        <strong>Data Protection Officer:</strong>
                        <span>dpo@campuslostfound.pk</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicy;
