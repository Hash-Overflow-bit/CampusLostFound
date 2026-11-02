import React from "react";
import {
  CiSearch,
  CiHeart,
  CiLock,
  CiGlobe,
  //  CiUsers,
  CiTrophy,
} from "react-icons/ci";
import SEO from "../componenets/seo/SEO";
import "./About.css";

const About = () => {
  return (
    <>
      <SEO
        title="About CampusLostFound - Helping University Students Find Lost Items"
        description="Learn about our mission to help university students across Pakistan find their lost belongings easily through our digital platform. Safe, secure, and student-focused."
        keywords="about campus lost found, university lost items platform, student help Pakistan, lost belongings recovery"
      />

      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <h1 className="campus-hero-title">About CampusLostFound</h1>
            <p className="hero-subtitle">
              Helping university students find lost items easily
            </p>
            <p className="hero-description description">
              We're on a mission to reunite students with their lost belongings
              across Pakistani universities, making campus life easier and more
              connected.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <h2 className="section-title">Our Mission</h2>
            <div className="mission-content">
              <div className="mission-text">
                <p>
                  Every day, thousands of students across Pakistani universities
                  lose important items - from student ID cards and textbooks to
                  laptops and personal belongings. Traditional notice boards and
                  word-of-mouth methods often fail to reunite students with
                  their lost items.
                </p>
                <p>
                  CampusLostFound bridges this gap by providing a centralized,
                  digital platform where students can quickly report lost items
                  and help others find their belongings. We believe that
                  technology should make student life easier, not more
                  complicated.
                </p>
              </div>
              <div className="mission-icons">
                <div className="mission-icon">
                  <CiHeart className="icon" />
                  <h3>Community Care</h3>
                  <p>
                    Building a supportive student community that looks out for
                    each other
                  </p>
                </div>
                <div className="mission-icon">
                  <CiSearch className="icon" />
                  <h3>Easy Discovery</h3>
                  <p>
                    Making it simple to find and report lost items with smart
                    search features
                  </p>
                </div>
                <div className="mission-icon">
                  <CiLock className="icon" />
                  <h3>Safe & Secure</h3>
                  <p>
                    Protecting student privacy while facilitating safe item
                    recovery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Section */}
        {/* <section className="developer-section">
          <div className="container">
            <h2 className="section-title">Meet the Developer</h2>
            <div
              className="developer-content"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <div className="developer-info">
                <h3>Hashir Mehboob</h3>
                <p>
                  <strong>University:</strong> University of Management and
                  Technology (UMT)
                </p>
                <p>
                  <strong>Degree:</strong> BS Software Engineering (BSSE)
                </p>
                <p>
                  Passionate about building digital solutions for students.
                  Experienced in full-stack web development, React, and
                  Firebase. Dedicated to making campus life easier and more
                  connected for everyone.
                </p>
              </div>
            </div>
          </div>
        </section> */}

        {/* Why This Platform is Needed */}
        <section className="why-needed-section">
          <div className="container">
            <h2 className="section-title">Why CampusLostFound is Needed</h2>
            <div className="problems-solutions">
              <div className="problem-item">
                <h3>📋 Traditional Notice Boards</h3>
                <div className="problem-solution">
                  <div className="problem">
                    <h4>The Problem:</h4>
                    <ul>
                      <li>Limited visibility and reach</li>
                      <li>Papers get removed or damaged</li>
                      <li>No search functionality</li>
                      <li>Time-consuming to check regularly</li>
                    </ul>
                  </div>
                  <div className="solution">
                    <h4>Our Solution:</h4>
                    <ul>
                      <li>Digital accessibility 24/7</li>
                      <li>Permanent online records</li>
                      <li>Smart search and filters</li>
                      <li>Instant notifications</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="problem-item">
                <h3>🎓 University-Specific Challenges</h3>
                <div className="problem-solution">
                  <div className="problem">
                    <h4>The Problem:</h4>
                    <ul>
                      <li>Items lost across different campuses</li>
                      <li>No centralized system</li>
                      <li>Security concerns with personal info</li>
                      <li>Language and communication barriers</li>
                    </ul>
                  </div>
                  <div className="solution">
                    <h4>Our Solution:</h4>
                    <ul>
                      <li>University-specific filtering</li>
                      <li>Centralized digital platform</li>
                      <li>Privacy-protected contact system</li>
                      <li>User-friendly interface in English</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <div className="container">
            <h2 className="section-title">Benefits for Students</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <CiGlobe className="benefit-icon" />
                <h3>University-Wide Reach</h3>
                <p>
                  Connect with students across your entire university campus,
                  not just your immediate circle. Increase the chances of
                  finding your lost items by reaching thousands of fellow
                  students.
                </p>
              </div>

              <div className="benefit-card">
                {/* <CiUsers className="benefit-icon" /> */}
                <h3>Community Building</h3>
                <p>
                  Help fellow students while building a supportive campus
                  community. Every lost item returned strengthens the bonds
                  between students.
                </p>
              </div>

              <div className="benefit-card">
                <CiTrophy className="benefit-icon" />
                <h3>Success Stories</h3>
                <p>
                  Join hundreds of students who have successfully recovered
                  their lost items through our platform. From expensive laptops
                  to sentimental items, we help reunite students with what
                  matters.
                </p>
              </div>

              <div className="benefit-card">
                <CiLock className="benefit-icon" />
                <h3>Privacy Protection</h3>
                <p>
                  Your personal information stays safe. We only share necessary
                  contact details when you choose to connect with someone about
                  an item.
                </p>
              </div>

              <div className="benefit-card">
                <CiSearch className="benefit-icon" />
                <h3>Smart Search</h3>
                <p>
                  Find items quickly with our advanced search and filtering
                  system. Search by category, location, date, and more to locate
                  your belongings faster.
                </p>
              </div>

              <div className="benefit-card">
                <CiHeart className="benefit-icon" />
                <h3>Free to Use</h3>
                <p>
                  Completely free for all university students. No hidden fees,
                  no premium features - just a platform built by students, for
                  students.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="stats-section">
          <div className="container">
            <h2 className="section-title">Making a Difference</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <h3>50+</h3>
                <p>Pakistani Universities</p>
              </div>
              <div className="stat-item">
                <h3>1000+</h3>
                <p>Students Helped</p>
              </div>
              <div className="stat-item">
                <h3>500+</h3>
                <p>Items Recovered</p>
              </div>
              <div className="stat-item">
                <h3>95%</h3>
                <p>User Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="container">
            <h2>Ready to Join Our Community?</h2>
            <p>
              Start helping fellow students and get help when you need it most.
              Sign up today and become part of Pakistan's largest student lost &
              found community.
            </p>
            <div className="cta-buttons">
              <a href="/signup" className="btn btn-primary">
                Join Now
              </a>
              <a href="/report" className="btn btn-secondary">
                Report an Item
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
