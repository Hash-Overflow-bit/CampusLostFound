import React, { useState, useCallback } from "react";
import { CiHeart } from "react-icons/ci";
import "./herosection.css";
import { GoDotFill } from "react-icons/go";
import { IoIosSchool } from "react-icons/io";
import Button from "../button/Button";
import SEO from "../seo/SEO";
import { useAuth } from "../../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import ReportItemForm from "../reportForm/ReportItemForm";
import { authValidationUtils } from "../../utils/authValidation";
import ItemsList from "../items/ItemsList";

import LogoLoop from "../../animation/LogoLoop";

// Import university logos
import PuLogo from "../../assets/Pu.png";
import NustLogo from "../../assets/Nust.png";
import FastLogo from "../../assets/Fast.png";
import UetLogo from "../../assets/UET.png";
import ComsatsLogo from "../../assets/Comsats.png";
import IbaLogo from "../../assets/IBA.png";
import QauLogo from "../../assets/QAU.png";
import GikiLogo from "../../assets/giki.png";
import UmtLogo from "../../assets/UMT.png";
const universityLogos = [
  {
    src: PuLogo,
    alt: "University of the Punjab",
    title: "University of the Punjab",
    href: "https://pu.edu.pk",
  },
  {
    src: NustLogo,
    alt: "NUST",
    title: "National University of Sciences and Technology",
    href: "https://nust.edu.pk",
  },
  {
    src: FastLogo,
    alt: "FAST-NU",
    title: "FAST National University",
    href: "https://nu.edu.pk",
  },
  {
    src: UetLogo,
    alt: "UET",
    title: "University of Engineering and Technology",
    href: "https://uet.edu.pk",
  },
  {
    src: ComsatsLogo,
    alt: "COMSATS",
    title: "COMSATS University Islamabad",
    href: "https://comsats.edu.pk",
  },
  {
    src: IbaLogo,
    alt: "IBA",
    title: "Institute of Business Administration",
    href: "https://iba.edu.pk",
  },
  {
    src: QauLogo,
    alt: "QAU",
    title: "Quaid-i-Azam University",
    href: "https://qau.edu.pk",
  },
  {
    src: GikiLogo,
    alt: "GIKI",
    title: "Ghulam Ishaq Khan Institute of Engineering Sciences and Technology",
    href: "https://giki.edu.pk",
  },
  {
    src: UmtLogo,
    alt: "UMT",
    title: "University of Management & Technology",
    href: "https://umt.edu.pk",
  },
];

const Herosection = React.memo(() => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [searchValue, SetSearchValue] = useState("");
  const { user, isAuthenticated, isEmailVerified } = useAuth();
  const navigate = useNavigate();

  // Memoized handlers to prevent unnecessary re-renders
  const handleReportItemClick = useCallback(() => {
    // If form is already showing, just toggle it off
    if (showReportForm) {
      setShowReportForm(false);
      return;
    }

    // Validate report access
    const validation = authValidationUtils.validateReportAccess(
      user,
      isAuthenticated,
      isEmailVerified
    );

    // If user is authenticated and verified, show form
    if (isAuthenticated && user && user.uid && isEmailVerified) {
      setShowReportForm(true);
      return;
    }

    // If not allowed, handle errors
    if (!validation.canReport) {
      validation.errors.forEach((error) => {
        if (error.action === "redirect_login") {
          // Only navigate to login if user is NOT authenticated
          if (!isAuthenticated) {
            navigate("/login", {
              state: {
                message: error.message,
                from: "report-item",
                redirectTo: "/",
              },
            });
          }
        } else if (error.action === "show_alert") {
          // Show alert for other errors (email verification, university domain)
          alert(error.message);
        }
      });
      return;
    }

    setShowReportForm(true);
  }, [user, isAuthenticated, isEmailVerified, navigate, showReportForm]);

  const handleReportFormSubmit = useCallback(() => {
    setShowReportForm(false);
  }, []);

  const handleReportFormClose = useCallback(() => {
    setShowReportForm(false);
  }, []);

  const handleBrowseFoundItems = useCallback(() => {
    // Scroll to the ItemsList section
    const itemsListElement = document.querySelector(".items-list-container");
    if (itemsListElement) {
      itemsListElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  return (
    <>
      <SEO
        title="Report Lost Items & Find Found Items | Campus Lost Found Pakistan | University Students Help"
        description="Report your lost items or browse found items at Pakistani universities. Our hero platform connects 2,300+ university students across Pakistan to help recover lost belongings like phones, wallets, keys, and academic materials through community support."
        keywords={[
          "report lost items Pakistan",
          "find found items university",
          "lost phone campus Pakistan",
          "lost wallet university students",
          "lost keys Pakistani campus",
          "university lost property report",
          "campus found items browse",
          "Pakistani student community help",
          "lost belongings recovery Pakistan",
          "university lost and found hero",
          "campus safety network Pakistan",
          "student help community Pakistan",
          "lost items reporting system",
          "found property university Pakistan",
          "campus lost belongings service",
        ]}
        keySentences={[
          "Report your lost items instantly with detailed descriptions and photos",
          "Browse found items across Pakistani universities to recover your belongings",
          "Community-driven platform connects students who want to help each other",
          "University email verification ensures secure and authentic user participation",
          "Real-time notifications alert you when matching items are reported",
          "Advanced search filters help locate specific items quickly and efficiently",
          "Mobile-friendly interface enables reporting from anywhere on campus",
          "Photo upload feature improves item identification and recovery success",
          "Location tracking helps pinpoint exact areas where items were lost",
          "Success stories inspire continued community participation and engagement",
          "Free service reduces financial burden of replacing lost items",
          "24/7 availability supports students across all time zones",
          "Privacy protection ensures student information remains secure",
          "Easy reporting process takes less than 2 minutes to complete",
          "Campus network coverage includes 43+ Pakistani universities nationwide",
        ]}
        url="https://campuslostfound.vercel.app/hero"
        image="/src/assets/logo.png"
        type="website"
        siteName="Campus Lost Found Pakistan - Hero Section"
        author="Campus Lost Found Team"
        links={[
          { rel: "canonical", href: "https://campuslostfound.vercel.app/hero" },
        ]}
        customMeta={[
          { name: "page-type", content: "hero-landing" },
          { name: "content-category", content: "student-services" },
          { name: "audience", content: "university-students-pakistan" },
          { name: "service-area", content: "Pakistan-universities" },
          { name: "primary-action", content: "report-lost-items" },
          { name: "secondary-action", content: "browse-found-items" },
        ]}
      />
      <main className="hero-section">
        <div className="hero-content">
          <div
            className="hero-icon"
            aria-label="Heart icon representing community care"
          >
            <CiHeart className="icon" />
          </div>

          <header className=" heading hero-text">
            <h1 className="campus-hero-title">Lost Something?</h1>
            <h2 className="hero-subtitle sub-heading">
              Let's Find it Together
            </h2>
            <p className="hero-description description">
              Join our community of helpful neighbors. Report lost items, share
              found treasures, and help reunite people with their belongings.
            </p>
          </header>

          <section className="search-bar">
            <div className="search-bar-animated-border">
              <input
                type="text"
                placeholder="Search Items by Title"
                value={searchValue}
                onChange={(e) => SetSearchValue(e.target.value)}
              />
            </div>
          </section>

          <section className="herosection-status">
            <div className="status1 status">
              <span className="icon icon1">
                <GoDotFill />
              </span>
              127 items waiting to be found
            </div>
            <div className="status2 status">
              <span className="icon icon2">
                <GoDotFill />
              </span>
              50 happy reunions
            </div>
            <div className="status3 status">
              <span className="icon icon3">
                <IoIosSchool />
              </span>
              2,300+ universities
            </div>
          </section>

          <section className="herosection-btns">
            <div className="btn1">
              <Button
                text={showReportForm ? "Hide Report Form" : "Report Lost Item"}
                className="hero-btn hero-btn-primary"
                onClick={handleReportItemClick}
              />
            </div>
            <div className="btn2">
              <Button
                text="Browse Found Items"
                className="hero-btn hero-btn-secondary"
                onClick={handleBrowseFoundItems}
              />
            </div>
          </section>
        </div>
      </main>

      <div className="logo-loop-container">
        <div
          style={{
            height: "140px",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <LogoLoop
            logos={universityLogos}
            speed={120}
            direction="left"
            logoHeight={48}
            gap={40}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="#ffffff"
            ariaLabel="Pakistani Universities"
          />
        </div>
      </div>

      {/* Show ReportItemForm as a separate section below hero and logo loop */}
      {showReportForm && (
        <section className="report-form-section">
          <ReportItemForm
            onClose={handleReportFormClose}
            onSubmit={handleReportFormSubmit}
          />
        </section>
      )}

      {/* List Items//////item cards */}
      <ItemsList searchQuery={searchValue} />
    </>
  );
});

Herosection.displayName = "Herosection";

export default Herosection;
