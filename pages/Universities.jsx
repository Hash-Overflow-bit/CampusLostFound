import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUniversity,
  FaExternalLinkAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaSearch,
  FaShieldAlt,
  FaMedkit,
  FaBus,
  FaGraduationCap,
  FaBook,
  FaUsers,
} from "react-icons/fa";
import UniversityDetails from "../data/UniversityDetails";
// Import all PNG logos from src/assets
import UMTLogo from "../assets/UMT.png";
import UETLogo from "../assets/UET.png";
import QAULogo from "../assets/QAU.png";
import PuLogo from "../assets/Pu.png";
import NustLogo from "../assets/Nust.png";
import IBALogo from "../assets/IBA.png";
import GikiLogo from "../assets/giki.png";
import FastLogo from "../assets/Fast.png";
import ComsatsLogo from "../assets/Comsats.png";
import AKULogo from "../assets/AKU.png";
import AULogo from "../assets/AIR.png";
import BULogo from "../assets/BU.png";
import ISTLogo from "../assets/IST.png";
import LumsLogo from "../assets/LUMS.png";
import AllamLogo from "../assets/Allama.png";
import gcuLogo from "../assets/gcu.png";
import szabistLogo from "../assets/szabist.png";
import uafLogo from "../assets/uaf.png";
// Add more as needed

const logoImports = {
  "UMT.png": UMTLogo,
  "UET.png": UETLogo,
  "QAU.png": QAULogo,
  "Pu.png": PuLogo,
  "Nust.png": NustLogo,
  "IBA.png": IBALogo,
  "giki.png": GikiLogo,
  "Fast.png": FastLogo,
  "Comsats.png": ComsatsLogo,
  "AKU.png": AKULogo,
  "AIR.png": AULogo,
  "BU.png": BULogo,
  "IST.png": ISTLogo,
  "LUMS.png": LumsLogo,
  "Allama.png": AllamLogo,
  "gcu.png": gcuLogo,
  "szabist.png": szabistLogo,
  "uaf.png": uafLogo,

  // Add more as needed
};
import SEO from "../componenets/seo/SEO";
import LazyImage from "../componenets/LazyImage/LazyImage";
import "./Universities.css";

const Universities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [filteredUniversities, setFilteredUniversities] = useState([]);

  // Convert university details to array
  const universitiesArray = Object.values(UniversityDetails);

  useEffect(() => {
    // Filter universities based on search term, type, and location
    let filtered = universitiesArray;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (uni) =>
          uni.name.toLowerCase().includes(term) ||
          (uni.location && uni.location.toLowerCase().includes(term))
      );
    }
    if (selectedType !== "all") {
      filtered = filtered.filter((uni) =>
        uni.type ? uni.type.toLowerCase() === selectedType : false
      );
    }
    if (selectedLocation !== "all") {
      filtered = filtered.filter((uni) =>
        uni.location
          ? uni.location.toLowerCase().includes(selectedLocation)
          : false
      );
    }
    setFilteredUniversities(filtered);
  }, [universitiesArray, searchTerm, selectedType, selectedLocation]);

  const getSocialIcon = (platform) => {
    switch (platform) {
      case "facebook":
        return <FaFacebook />;
      case "twitter":
        return <FaTwitter />;
      case "linkedin":
        return <FaLinkedin />;
      case "youtube":
        return <FaYoutube />;
      default:
        return <FaGlobe />;
    }
  };

  const openUniversityDetails = (university) => {
    setSelectedUniversity(university);
  };

  const closeUniversityDetails = () => {
    setSelectedUniversity(null);
  };

  return (
    <>
      <SEO
        title="Pakistani Universities Directory | Campus Lost Found"
        description="Comprehensive directory of Pakistani universities with contact information, support services, and official links. Find university details, websites, help desk contacts, and emergency services."
        keywords={[
          "Pakistani universities directory",
          "university contact information Pakistan",
          "university help desk Pakistan",
          "Pakistani university websites",
          "university support services Pakistan",
          "HEC universities Pakistan",
          "university emergency contacts",
          "Pakistani university details",
          "university student services Pakistan",
          "university admissions Pakistan",
        ]}
      />

      <div className="universities-page">
        {/* Updated hero section without background colors */}
        <div className="universities-hero">
          <div className="container">
            <h1 className="campus-hero-title">
              Pakistani Universities Directory
            </h1>
            <p className="hero-description description">
              Comprehensive information about universities across Pakistan with
              official links, contact details, support services, and emergency
              contacts for all major educational institutions
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{universitiesArray.length}+</span>
                <span className="stat-label">Universities</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support Access</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Verified Info</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          {/* Search and Filter Section */}
          <div className="universities-filters">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search universities by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-controls">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Locations</option>
                <option value="lahore">Lahore</option>
                <option value="islamabad">Islamabad</option>
                <option value="karachi">Karachi</option>
                <option value="multiple">Multiple Campuses</option>
              </select>
            </div>
          </div>

          {/* Universities Grid */}
          <div className="universities-grid">
            {filteredUniversities.map((university) => {
              // Extract filename from logo path
              let logoSrc = university.logo;
              if (logoSrc && logoSrc.startsWith("/src/assets/")) {
                const fileName = logoSrc.split("/").pop();
                if (logoImports[fileName]) {
                  logoSrc = logoImports[fileName];
                }
              }
              return (
                <div key={university.id} className="university-card">
                  <div className="university-header">
                    <div className="university-logo">
                      <LazyImage
                        src={logoSrc}
                        alt={university.shortName}
                        style={{ maxWidth: "80px" }}
                      />
                      <div
                        className="logo-fallback"
                        style={{ display: "none" }}
                      >
                        <FaUniversity />
                      </div>
                    </div>
                    <div className="university-info">
                      <h3 className="university-name">
                        {university.shortName}
                      </h3>
                      <p className="university-full-name">{university.name}</p>
                      <div className="university-meta">
                        <span
                          className={`type-badge ${university.type.toLowerCase()}`}
                        >
                          {university.type}
                        </span>
                        <span className="location">
                          <FaMapMarkerAlt /> {university.location}
                        </span>
                        <span className="established">
                          <FaCalendarAlt /> Est. {university.established}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="university-description">
                    {university.description}
                  </p>

                  <div className="university-actions">
                    <div className="quick-links">
                      <a
                        href={university.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaGlobe /> Visit Website
                      </a>
                      <a href={`tel:${university.contact.phone}`}>
                        <FaPhone /> Call
                      </a>
                      <a href={`mailto:${university.contact.email}`}>
                        <FaEnvelope /> Email
                      </a>
                    </div>

                    <button
                      onClick={() => openUniversityDetails(university)}
                      className="university-detail-btn"
                    >
                      View Details <FaExternalLinkAlt />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredUniversities.length === 0 && (
            <div className="no-results">
              <FaUniversity className="no-results-icon" />
              <h3>No universities found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>

        {/* University Details Modal */}
        {selectedUniversity && (
          <div
            className="university-modal-overlay"
            onClick={closeUniversityDetails}
          >
            <div
              className="university-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-university-info">
                  <LazyImage
                    src={selectedUniversity.logo}
                    alt={selectedUniversity.shortName}
                    className="modal-logo"
                    style={{ maxWidth: "120px" }}
                  />
                  <div
                    className="modal-logo-fallback"
                    style={{ display: "none" }}
                  >
                    <FaUniversity />
                  </div>
                  <div>
                    <h2>{selectedUniversity.name}</h2>
                    <p>
                      {selectedUniversity.location} • Est.{" "}
                      {selectedUniversity.established}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeUniversityDetails}
                  className="close-button"
                >
                  ×
                </button>
              </div>

              {/* <div className="modal-content"> */}
              <div className="modal-section">
                <h3 className="section-title">
                  <FaPhone /> Contact Information
                </h3>
                <div className="contact-grid">
                  <div className="contact-item">
                    <strong>Phone:</strong>
                    <a href={`tel:${selectedUniversity.contact.phone}`}>
                      {selectedUniversity.contact.phone}
                    </a>
                  </div>
                  <div className="contact-item">
                    <strong>Email:</strong>
                    <a href={`mailto:${selectedUniversity.contact.email}`}>
                      {selectedUniversity.contact.email}
                    </a>
                  </div>
                  <div className="contact-item">
                    <strong>Website:</strong>
                    <a
                      href={selectedUniversity.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedUniversity.website} <FaExternalLinkAlt />
                    </a>
                  </div>
                  <div className="contact-item address">
                    <strong>Address:</strong>
                    <span>{selectedUniversity.contact.address}</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-title">
                  <FaUsers /> Support Services
                </h3>
                <div className="support-grid">
                  <div className="support-item">
                    <h4 className="sub-heading">
                      <FaGraduationCap /> Admissions
                    </h4>
                    <p>
                      Phone:{" "}
                      <a
                        href={`tel:${selectedUniversity.support.admissions.phone}`}
                      >
                        {selectedUniversity.support.admissions.phone}
                      </a>
                    </p>
                    <p>
                      Email:{" "}
                      <a
                        href={`mailto:${selectedUniversity.support.admissions.email}`}
                      >
                        {selectedUniversity.support.admissions.email}
                      </a>
                    </p>
                    <a
                      href={selectedUniversity.support.admissions.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Admissions Portal <FaExternalLinkAlt />
                    </a>
                  </div>

                  <div className="support-item">
                    <h4 className="sub-heading">
                      <FaBook /> Student Services
                    </h4>
                    <p>
                      Phone:{" "}
                      <a
                        href={`tel:${selectedUniversity.support.studentServices.phone}`}
                      >
                        {selectedUniversity.support.studentServices.phone}
                      </a>
                    </p>
                    <p>
                      Email:{" "}
                      <a
                        href={`mailto:${selectedUniversity.support.studentServices.email}`}
                      >
                        {selectedUniversity.support.studentServices.email}
                      </a>
                    </p>
                    <a
                      href={selectedUniversity.support.studentServices.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Student Services <FaExternalLinkAlt />
                    </a>
                  </div>

                  <div className="support-item">
                    <h4 className="sub-heading">
                      <FaPhone /> Help Desk
                    </h4>
                    <p>
                      Phone:{" "}
                      <a
                        href={`tel:${selectedUniversity.support.helpDesk.phone}`}
                      >
                        {selectedUniversity.support.helpDesk.phone}
                      </a>
                    </p>
                    <p>
                      Email:{" "}
                      <a
                        href={`mailto:${selectedUniversity.support.helpDesk.email}`}
                      >
                        {selectedUniversity.support.helpDesk.email}
                      </a>
                    </p>
                    <a
                      href={selectedUniversity.support.helpDesk.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Help Center <FaExternalLinkAlt />
                    </a>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-title">
                  <FaShieldAlt /> Emergency Contacts
                </h3>
                <div className="emergency-grid">
                  <div className="emergency-item">
                    <FaShieldAlt className="emergency-icon" />
                    <div>
                      <strong>Security</strong>
                      <a
                        href={`tel:${selectedUniversity.emergencyContact.security}`}
                      >
                        {selectedUniversity.emergencyContact.security}
                      </a>
                    </div>
                  </div>
                  <div className="emergency-item">
                    <FaMedkit className="emergency-icon" />
                    <div>
                      <strong>Medical</strong>
                      <a
                        href={`tel:${selectedUniversity.emergencyContact.medical}`}
                      >
                        {selectedUniversity.emergencyContact.medical}
                      </a>
                    </div>
                  </div>
                  <div className="emergency-item">
                    <FaBus className="emergency-icon" />
                    <div>
                      <strong>Transport</strong>
                      <a
                        href={`tel:${selectedUniversity.emergencyContact.transport}`}
                      >
                        {selectedUniversity.emergencyContact.transport}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-title">
                  <FaExternalLinkAlt /> Quick Links
                </h3>
                <div className="quick-links-grid">
                  {selectedUniversity.quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="quick-link-item"
                    >
                      {link.name} <FaExternalLinkAlt />
                    </a>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-title">Social Media</h3>
                <div className="social-links">
                  {Object.entries(selectedUniversity.socialMedia).map(
                    ([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        title={
                          platform.charAt(0).toUpperCase() + platform.slice(1)
                        }
                      >
                        {getSocialIcon(platform)}
                      </a>
                    )
                  )}
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Universities;
