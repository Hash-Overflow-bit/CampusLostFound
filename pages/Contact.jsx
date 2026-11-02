import React, { useState, useEffect } from "react";
import { useForm, ValidationError } from "@formspree/react";
import {
  CiMail,
  CiPhone,
  CiLocationOn,
  CiClock2,
  CiUser,
  CiChat2,
  CiBadgeDollar,
  CiGlobe,
  CiCircleCheck,
  CiCircleAlert,
} from "react-icons/ci";
import SEO from "../componenets/seo/SEO";
import "./Contact.css";
import logoIcon from "../assets/logo (2).png";

const Contact = () => {
  // Formspree hooks for contact form and partnership form
  const [contactState, handleContactSubmit] = useForm("xzzalyde");
  const [partnershipState, handlePartnershipSubmit] = useForm("xzzalyde");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    subject: "",
    category: "",
    message: "",
    priority: "normal",
  });

  const [showPartnershipModal, setShowPartnershipModal] = useState(false);

  // Debug: Log modal state changes
  useEffect(() => {
    console.log("Partnership modal state changed:", showPartnershipModal);
  }, [showPartnershipModal]);
  const [partnershipFormData, setPartnershipFormData] = useState({
    universityName: "",
    contactPerson: "",
    position: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePartnershipInputChange = (e) => {
    const { name, value } = e.target;
    setPartnershipFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle partnership form success
  const handlePartnershipSuccess = () => {
    // Reset form on success
    setPartnershipFormData({
      universityName: "",
      contactPerson: "",
      position: "",
      email: "",
      phone: "",
      message: "",
    });

    // Close modal after showing success
    setTimeout(() => {
      setShowPartnershipModal(false);
    }, 3000);
  };

  // Handle contact form success
  const handleContactSuccess = () => {
    // Reset form on success
    setFormData({
      name: "",
      email: "",
      university: "",
      subject: "",
      category: "",
      message: "",
      priority: "normal",
    });
  };

  // Handle form success states
  useEffect(() => {
    if (contactState.succeeded) {
      handleContactSuccess();
    }
  }, [contactState.succeeded]);

  useEffect(() => {
    if (partnershipState.succeeded) {
      handlePartnershipSuccess();
    }
  }, [partnershipState.succeeded]);

  const supportCategories = [
    {
      id: "technical",
      name: "Technical Support",
      icon: <CiGlobe />,
      description: "Issues with website functionality, login problems, or bugs",
    },
    {
      id: "account",
      name: "Account Help",
      icon: <CiUser />,
      description: "Account creation, verification, or profile management",
    },
    {
      id: "safety",
      name: "Safety Concerns",
      icon: <CiCircleAlert />,
      description: "Report suspicious activity or safety-related issues",
    },
    {
      id: "partnership",
      name: "University Partnership",
      icon: <CiBadgeDollar />,
      description:
        "Official partnership requests from university administration",
    },
    {
      id: "feedback",
      name: "Feedback & Suggestions",
      icon: <CiChat2 />,
      description: "Ideas for improvement or general feedback",
    },
    {
      id: "other",
      name: "Other Inquiries",
      icon: <CiMail />,
      description: "General questions or concerns not covered above",
    },
  ];

  const universities = [
    "COMSATS University Islamabad",
    "FAST National University",
    "GIKI - Ghulam Ishaq Khan Institute",
    "IBA Karachi",
    "NUST - National University of Sciences and Technology",
    "Punjab University",
    "Quaid-i-Azam University",
    "UET - University of Engineering and Technology",
    "UMT - University of Management and Technology",
    "Other",
  ];

  return (
    <>
      <SEO
        title="Contact Us - CampusLostFound | Support & Partnership"
        description="Get in touch with CampusLostFound for technical support, university partnerships, or general inquiries. We're here to help students across Pakistan."
        keywords="contact campus lost found, technical support, university partnership, student help, customer service"
      />

      <div className="contact-container">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="container">
            <h1 className="campus-hero-title">Get in Touch</h1>
            <p className="hero-description description">
              We're here to help you make the most of CampusLostFound. Reach out
              for support, partnerships, or just to say hello!
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              <img
                src={logoIcon}
                alt="Campus Lost Found Logo"
                style={{
                  height: "25vw",
                  marginBottom: "1rem",
                  padding: "1rem",
                  borderRadius: "20px",
                }}
              />
              <div
                style={{
                  maxWidth: "600px",
                  textAlign: "center",
                  fontSize: "1.2rem",
                  color: "#4382E4",
                }}
              >
              
              </div>
            </div>
          </div>
        </section>

        {/* Quick Contact Info */}
        <section className="quick-contact">
          <div className="container">
            <div className="contact-cards">
              <div className="contact-card">
                <CiMail className="contact-icon" />
                <h3>Email Support</h3>
                <p>support@campuslostfound.pk</p>
                <span className="response-time">Response within 24 hours</span>
              </div>

              <div className="contact-card">
                <CiPhone className="contact-icon" />
                <h3>Emergency Contact</h3>
                <p>+92 3224121825</p>
                <span className="response-time">
                  For urgent safety concerns
                </span>
              </div>

              <div className="contact-card">
                <CiClock2 className="contact-icon" />
                <h3>Support Hours</h3>
                <p>Monday - Friday: 9 AM - 6 PM</p>
                <span className="response-time">Pakistan Standard Time</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Contact Form */}
        <section className="contact-form-section">
          <div className="container">
            <div className="form-layout">
              {/* Support Categories */}
              <div className="support-categories">
                <h2>How Can We Help?</h2>
                <p>Choose the category that best describes your inquiry:</p>

                <div className="categories-grid">
                  {supportCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`category-card ${
                        formData.category === category.id ? "selected" : ""
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          category: category.id,
                        }))
                      }
                    >
                      <div className="category-icon">{category.icon}</div>
                      <h4>{category.name}</h4>
                      <p>{category.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="form-container">
                <h2>Send Us a Message</h2>

                {contactState.succeeded && (
                  <div className="form-alert success">
                    <CiCircleCheck />
                    <span>
                      Thank you for your message! We'll get back to you within
                      24 hours.
                    </span>
                  </div>
                )}

                {contactState.errors && contactState.errors.length > 0 && (
                  <div className="form-alert error">
                    <CiCircleAlert />
                    <span>
                      There was an error sending your message. Please try again.
                    </span>
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                      />
                      <ValidationError
                        prefix="Name"
                        field="name"
                        errors={contactState.errors}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">University Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@university.edu.pk"
                      />
                      <ValidationError
                        prefix="Email"
                        field="email"
                        errors={contactState.errors}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="university">University *</label>
                      <select
                        id="university"
                        name="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select your university</option>
                        {universities.map((uni) => (
                          <option key={uni} value={uni}>
                            {uni}
                          </option>
                        ))}
                      </select>
                      <ValidationError
                        prefix="University"
                        field="university"
                        errors={contactState.errors}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="priority">Priority</label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                      >
                        <option value="low">Low - General inquiry</option>
                        <option value="normal">
                          Normal - Standard support
                        </option>
                        <option value="high">High - Urgent issue</option>
                        <option value="critical">
                          Critical - Safety concern
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Brief description of your inquiry"
                    />
                    <ValidationError
                      prefix="Subject"
                      field="subject"
                      errors={contactState.errors}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="6"
                      placeholder="Please provide as much detail as possible to help us assist you better..."
                    />
                    <ValidationError
                      prefix="Message"
                      field="message"
                      errors={contactState.errors}
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={contactState.submitting}
                  >
                    {contactState.submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* University Partnerships */}
        <section className="partnerships-section">
          <div className="container">
            <h2 className="section-title">University Partnerships</h2>
            <div className="partnership-content">
              <div className="partnership-info">
                <h3>Official University Integration</h3>
                <p>
                  We partner with universities across Pakistan to provide
                  official lost and found services integrated with campus
                  security and administration systems.
                </p>

                <div className="partnership-benefits">
                  <div className="benefit">
                    <CiCircleCheck className="benefit-icon" />
                    <span>Custom branding for your university</span>
                  </div>
                  <div className="benefit">
                    <CiCircleCheck className="benefit-icon" />
                    <span>Integration with campus security systems</span>
                  </div>
                  <div className="benefit">
                    <CiCircleCheck className="benefit-icon" />
                    <span>Analytics and reporting dashboards</span>
                  </div>
                  <div className="benefit">
                    <CiCircleCheck className="benefit-icon" />
                    <span>Priority support for your students</span>
                  </div>
                </div>
              </div>

              <div className="partnership-stats">
                <div className="stat">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Partner Universities</div>
                </div>
                <div className="stat">
                  <div className="stat-number">50,000+</div>
                  <div className="stat-label">Active Students</div>
                </div>
                <div className="stat">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Recovery Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="contact-faq">
          <div className="container">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-card">
                <h4>How quickly do you respond to support requests?</h4>
                <p>
                  We aim to respond to all inquiries within 24 hours during
                  business days. Critical safety issues are prioritized and
                  addressed immediately.
                </p>
              </div>

              <div className="faq-card">
                <h4>Can I report technical bugs through this form?</h4>
                <p>
                  Yes! Please select "Technical Support" and provide detailed
                  information about the bug, including what you were doing when
                  it occurred.
                </p>
              </div>

              <div className="faq-card">
                <h4>How do I request a new university to be added?</h4>
                <p>
                  Contact us through the "University Partnership" category, or
                  have an official representative from your university reach out
                  to our partnerships team.
                </p>
              </div>

              <div className="faq-card">
                <h4>Is there a phone number for immediate assistance?</h4>
                <p>
                  Our emergency contact number is for urgent safety concerns
                  only. For general support, email is the fastest way to get
                  comprehensive help.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="locations-section">
          <div className="container">
            <h2 className="section-title">Our Locations</h2>
            <div className="locations-grid">
              <div className="location-card">
                <CiLocationOn className="location-icon" />
                <h3>Karachi Office</h3>
                <p>
                  Plot 123, Clifton Block 2<br />
                  Karachi, Sindh 75600
                </p>
                <span className="office-type">Main Development Center</span>
              </div>

              <div className="location-card">
                <CiLocationOn className="location-icon" />
                <h3>Lahore Office</h3>
                <p>
                  45-A, Gulberg III
                  <br />
                  Lahore, Punjab 54660
                </p>
                <span className="office-type">Regional Support Hub</span>
              </div>

              <div className="location-card">
                <CiLocationOn className="location-icon" />
                <h3>Islamabad Office</h3>
                <p>
                  Sector F-8/3, Blue Area
                  <br />
                  Islamabad 44000
                </p>
                <span className="office-type">Government Relations</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Partnership Request Modal */}
      {showPartnershipModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowPartnershipModal(false)}
          style={{ zIndex: 9999, backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>University Partnership Request</h3>
              <button
                className="modal-close"
                onClick={() => setShowPartnershipModal(false)}
              >
                <CiX />
              </button>
            </div>

            <form
              onSubmit={handlePartnershipSubmit}
              className="partnership-form"
            >
              <div className="form-group">
                <label htmlFor="universityName">University Name *</label>
                <input
                  type="text"
                  id="universityName"
                  name="universityName"
                  value={partnershipFormData.universityName}
                  onChange={handlePartnershipInputChange}
                  required
                  placeholder="e.g., National University of Sciences and Technology"
                />
                <ValidationError
                  prefix="University Name"
                  field="universityName"
                  errors={partnershipState.errors}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contactPerson">Contact Person *</label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={partnershipFormData.contactPerson}
                    onChange={handlePartnershipInputChange}
                    required
                    placeholder="Full Name"
                  />
                  <ValidationError
                    prefix="Contact Person"
                    field="contactPerson"
                    errors={partnershipState.errors}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="position">Position *</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={partnershipFormData.position}
                    onChange={handlePartnershipInputChange}
                    required
                    placeholder="e.g., Student Affairs Director"
                  />
                  <ValidationError
                    prefix="Position"
                    field="position"
                    errors={partnershipState.errors}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={partnershipFormData.email}
                    onChange={handlePartnershipInputChange}
                    required
                    placeholder="official@university.edu.pk"
                  />
                  <ValidationError
                    prefix="Email"
                    field="email"
                    errors={partnershipState.errors}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={partnershipFormData.phone}
                    onChange={handlePartnershipInputChange}
                    placeholder="+92 XXX XXXXXXX"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Partnership Details *</label>
                <textarea
                  id="message"
                  name="message"
                  value={partnershipFormData.message}
                  onChange={handlePartnershipInputChange}
                  required
                  rows="4"
                  placeholder="Tell us about your university's interest in partnering with Campus Lost Found. Include student population, current lost & found processes, and expected benefits."
                />
                <ValidationError
                  prefix="Message"
                  field="message"
                  errors={partnershipState.errors}
                />
              </div>

              {/* Success/Error Messages */}
              {partnershipState.succeeded && (
                <div className="status-message success">
                  <CiCircleCheck />
                  <span>
                    Partnership request sent successfully! We'll get back to you
                    within 24 hours.
                  </span>
                </div>
              )}

              {partnershipState.errors &&
                partnershipState.errors.length > 0 && (
                  <div className="status-message error">
                    <CiCircleAlert />
                    <span>
                      There was an error sending your partnership request.
                      Please try again.
                    </span>
                  </div>
                )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowPartnershipModal(false)}
                  disabled={partnershipState.submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={partnershipState.submitting}
                >
                  {partnershipState.submitting
                    ? "Sending..."
                    : "Send Partnership Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
