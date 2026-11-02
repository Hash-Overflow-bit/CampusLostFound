import React, { useState } from "react";
import {
  CiFileOn,
  CiUser,
  CiLock,
  CiClock2,
  CiBadgeDollar,
  // CiInfo
} from "react-icons/ci";
import SEO from "../componenets/seo/SEO";
import "./TermsOfService.css";

const TermsOfService = () => {
  const [lastUpdated] = useState("January 15, 2024");

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: <CiFileOn />,
      content: {
        intro:
          "By accessing and using CampusLostFound, you accept and agree to be bound by the terms and provision of this agreement.",
        details: [
          "These terms apply to all users of the service, including students, faculty, and staff",
          "If you do not agree to these terms, you must not use our service",
          "Your continued use of the service constitutes acceptance of any modified terms",
          "We reserve the right to modify these terms at any time with notice",
          "Some services may have additional terms that also apply",
        ],
      },
    },
    {
      id: "eligibility",
      title: "2. User Eligibility and Account Requirements",
      icon: <CiUser />,
      content: {
        intro:
          "CampusLostFound is intended for university students, faculty, and staff with valid institutional email addresses.",
        details: [
          "Users must be at least 18 years old or have parental consent",
          "Must have a valid university email address ending in .edu.pk or approved domains",
          "Account information must be accurate and kept up to date",
          "Users are responsible for maintaining account security and confidentiality",
          "One account per person; multiple accounts may be suspended",
          "Accounts may be suspended for violation of these terms",
        ],
      },
    },
    {
      id: "service-description",
      title: "3. Service Description and Availability",
      // icon: <CiInfo />,
      content: {
        intro:
          "CampusLostFound provides a platform for university communities to report and recover lost items.",
        details: [
          "Service allows posting of lost and found item reports",
          "Facilitates communication between users for item recovery",
          "Provides search and filtering capabilities for items",
          "Offers safety guidelines and best practices",
          "Service availability may vary and is not guaranteed 24/7",
          "We reserve the right to modify or discontinue features with notice",
        ],
      },
    },
    {
      id: "user-conduct",
      title: "4. User Conduct and Prohibited Activities",
      icon: <CiLock />,
      content: {
        intro:
          "Users must conduct themselves appropriately and refrain from prohibited activities.",
        details: [
          "Provide accurate information in all posts and communications",
          "Respect the privacy and safety of other users",
          "Use the service only for legitimate lost and found purposes",
          "Prohibited: False claims, harassment, spam, or fraudulent activity",
          "Prohibited: Posting inappropriate, offensive, or illegal content",
          "Prohibited: Attempting to hack, disrupt, or misuse the service",
          "Users must report suspicious or inappropriate behavior",
        ],
      },
    },
    {
      id: "content-responsibility",
      title: "5. User Content and Responsibility",
      icon: <CiFileOn />,
      content: {
        intro:
          "Users are responsible for all content they post, including item descriptions, photos, and communications.",
        details: [
          "Users retain ownership of their original content",
          "Grant us license to use content for service operation",
          "Content must be accurate, lawful, and not infringe on others' rights",
          "Users are liable for any damages resulting from false or misleading content",
          "We may remove content that violates these terms",
          "Backup important content as we don't guarantee permanent storage",
        ],
      },
    },
    {
      id: "safety-guidelines",
      title: "6. Safety Guidelines and Disclaimers",
      icon: <CiLock />,
      content: {
        intro:
          "User safety is paramount. Users must follow safety guidelines when meeting to exchange items.",
        details: [
          "Always meet in public, well-lit areas on campus",
          "Bring a friend when possible for item exchanges",
          "Verify item ownership before returning valuable items",
          "Trust your instincts and report suspicious behavior",
          "We are not responsible for user interactions or meetings",
          "Users participate in item exchanges at their own risk",
          "Contact campus security for high-value items or safety concerns",
        ],
      },
    },
    {
      id: "intellectual-property",
      title: "7. Intellectual Property Rights",
      icon: <CiFileOn />,
      content: {
        intro:
          "We respect intellectual property rights and expect users to do the same.",
        details: [
          "CampusLostFound name, logo, and design are our trademarks",
          "Users may not copy, modify, or distribute our proprietary content",
          "Users must have rights to any content they post",
          "Respect copyrights and trademarks in posted content",
          "We will respond to valid DMCA takedown notices",
          "Repeat copyright infringers may have accounts terminated",
        ],
      },
    },
    {
      id: "privacy-data",
      title: "8. Privacy and Data Protection",
      icon: <CiLock />,
      content: {
        intro:
          "Your privacy is important to us. Please review our Privacy Policy for detailed information.",
        details: [
          "We collect and use data as described in our Privacy Policy",
          "Personal information is never sold to third parties",
          "Communication data may be shared when users contact each other",
          "Users can control privacy settings and data sharing preferences",
          "We implement security measures to protect user data",
          "Users have rights to access, modify, and delete their data",
        ],
      },
    },
    {
      id: "disclaimers",
      title: "9. Disclaimers and Limitation of Liability",
      // icon: <CiInfo />,
      content: {
        intro:
          "CampusLostFound is provided 'as is' without warranties of any kind.",
        details: [
          "We do not guarantee the accuracy of user-posted content",
          "Service availability and functionality are not guaranteed",
          "We are not responsible for user interactions or transactions",
          "Users assume all risks associated with using the service",
          "Our liability is limited to the maximum extent permitted by law",
          "We are not liable for indirect, consequential, or punitive damages",
          "Total liability shall not exceed the amount paid for service use",
        ],
      },
    },
    {
      id: "termination",
      title: "10. Account Termination and Suspension",
      icon: <CiClock2 />,
      content: {
        intro:
          "We reserve the right to suspend or terminate accounts for violations of these terms.",
        details: [
          "Users may terminate their accounts at any time",
          "We may suspend accounts for violations with or without notice",
          "Serious violations may result in permanent account termination",
          "Upon termination, user access to the service will be discontinued",
          "Some provisions of these terms survive account termination",
          "Data retention and deletion follow our Privacy Policy",
        ],
      },
    },
    {
      id: "indemnification",
      title: "11. Indemnification",
      // icon: <CiBadgeDollar />,
      content: {
        intro:
          "Users agree to indemnify and hold us harmless from certain claims and damages.",
        details: [
          "Users indemnify us against claims arising from their use of the service",
          "Protection from claims related to user content or conduct",
          "Coverage for legal fees and damages from user violations",
          "Users must cooperate in defense of covered claims",
          "Indemnification survives account termination",
          "We reserve the right to assume defense of any matter",
        ],
      },
    },
    {
      id: "governing-law",
      title: "12. Governing Law and Dispute Resolution",
      icon: <CiFileOn />,
      content: {
        intro:
          "These terms are governed by the laws of Pakistan and disputes will be resolved through specified procedures.",
        details: [
          "Terms governed by laws of Pakistan without conflict provisions",
          "Courts of Lahore, Pakistan have exclusive jurisdiction",
          "Users agree to attempt mediation before formal legal action",
          "Arbitration may be required for certain types of disputes",
          "Class action lawsuits are waived to the extent permitted",
          "Invalid provisions do not affect the validity of remaining terms",
        ],
      },
    },
  ];

  return (
    <>
      <SEO
        title="Terms of Service - CampusLostFound | User Agreement & Legal Terms"
        description="Review the terms of service for CampusLostFound including user rights, responsibilities, privacy guidelines, and legal agreements for students."
        keywords="terms of service, user agreement, legal terms, campus lost found terms, student agreement, service conditions"
      />

      <div className="terms-container">
        {/* Hero Section */}
        <section className="terms-hero">
          <div className="container">
            <h1 className="campus-hero-title">Terms of Service</h1>
            <p className="hero-description decsription">
              Please read these terms carefully. They govern your use of
              CampusLostFound and outline both your rights and responsibilities
              as a user.
            </p>
            <div className="last-updated">
              <CiClock2 className="update-icon" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </section>

        {/* Key Points Summary */}
        <section className="terms-summary">
          <div className="container">
            <h2>Key Points Summary</h2>
            <div className="summary-grid">
              <div className="summary-card">
                <CiUser className="summary-icon" />
                <h3>Who Can Use</h3>
                <p>
                  University students, faculty, and staff with valid .edu.pk
                  email addresses. Must be 18+ or have parental consent.
                </p>
              </div>

              <div className="summary-card">
                <CiLock className="summary-icon" />
                <h3>Your Responsibilities</h3>
                <p>
                  Provide accurate information, respect others, follow safety
                  guidelines, and use the service only for legitimate purposes.
                </p>
              </div>

              <div className="summary-card">
                {/* <CiInfo className="summary-icon" /> */}
                <h3>Our Service</h3>
                <p>
                  We provide a platform for lost and found items but don't
                  guarantee outcomes. Users assume responsibility for their
                  interactions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="terms-content">
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
              <div className="terms-text">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="terms-section"
                  >
                    <div className="section-header">
                      {section.icon}
                      <h2>{section.title}</h2>
                    </div>

                    <p className="section-intro">{section.content.intro}</p>

                    <ul className="terms-list">
                      {section.content.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </section>
                ))}

                {/* Contact Information */}
                <section className="contact-section">
                  <h2>Questions About These Terms?</h2>
                  <p>
                    If you have questions about these Terms of Service or need
                    clarification on any provisions, please contact us:
                  </p>
                  <div className="contact-info">
                    <div className="contact-item">
                      <strong>Email:</strong>
                      <span>campuslostfound@gmail.com</span>
                    </div>
                    <div className="contact-item">
                      <strong>General Support:</strong>
                      <span>campuslostfound@gmail.com</span>
                    </div>
                    <div className="contact-item">
                      <strong>Mailing Address:</strong>
                      <span>Lahore, Pakistan</span>
                    </div>
                  </div>
                </section>

                {/* Acknowledgment */}
                <section className="acknowledgment-section">
                  <div className="acknowledgment-box">
                    <h3>Acknowledgment</h3>
                    <p>
                      By using CampusLostFound, you acknowledge that you have
                      read, understood, and agree to be bound by these Terms of
                      Service. If you do not agree to these terms, please do not
                      use our service.
                    </p>
                    <p>
                      These terms are effective as of the last updated date
                      above and will remain in effect except with respect to any
                      changes in their provisions in the future, which will be
                      in effect immediately after being posted on this page.
                    </p>
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

export default TermsOfService;
