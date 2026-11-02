import React, { useState } from "react";
import {
  CiSearch,
  CiCircleCheck,
  CiMail,
  CiLock,
  CiUser,
  CiCamera,
  CiLocationOn,
  CiPhone,
  CiHeart,
  CiFlag1,
} from "react-icons/ci";
import SEO from "../componenets/seo/SEO";
import "./HowItWorks.css";

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState("report");
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What happens if two people claim the same item?",
      answer:
        "When multiple people claim the same item, the person who reported it as found will receive all claim requests. They can review the details provided by each claimant and choose who to contact. We recommend asking for specific details about the item (like scratches, contents, or when/where it was lost) to verify the real owner.",
    },
    {
      question: "How do I know if someone claiming my item is genuine?",
      answer:
        "Always ask for specific details that only the real owner would know. For example, ask about contents of a bag, specific scratches or marks, or exactly where and when they lost it. Meet in a public place on campus and consider bringing a friend. Trust your instincts - if something feels off, don't proceed.",
    },
    {
      question: "Is my personal information safe on CampusLostFound?",
      answer:
        "Yes, we take privacy seriously. Your email and personal details are never displayed publicly. Only when you choose to contact someone about an item will your contact information be shared directly with that person. We never sell or share your data with third parties.",
    },
    {
      question: "Can I edit or delete my posted item?",
      answer:
        "Yes, you can manage all your posted items from your Dashboard. You can edit details, mark items as found/returned, or delete posts when they're no longer needed. This helps keep the platform updated and relevant.",
    },
    {
      question: "What if I find an item but don't know what it is?",
      answer:
        "Post it anyway! Include a clear photo and describe what you see. The owner will likely recognize their item even if you're not sure what it's called. For example, 'small electronic device with buttons' might be someone's calculator or remote.",
    },
    {
      question: "How long should I wait before removing a lost item post?",
      answer:
        "We recommend keeping lost item posts active for at least 30 days. Many students check the platform periodically, and someone might find your item weeks later. For valuable items like laptops or phones, consider keeping the post longer.",
    },
    {
      question: "What items should NOT be posted on CampusLostFound?",
      answer:
        "Don't post dangerous items, illegal substances, weapons, or anything that could be used to harm others. Also avoid posting items that might contain sensitive personal information unless you can secure that information first.",
    },
    {
      question: "Can I use CampusLostFound if I'm not a student?",
      answer:
        "Currently, our platform is designed specifically for university students with valid .edu.pk email addresses. This helps ensure a safe, trusted community. Faculty and staff should contact their university's official lost and found office.",
    },
    {
      question:
        "What if someone contacts me about an item but doesn't show up?",
      answer:
        "Unfortunately, this can happen. We recommend giving people 24-48 hours to respond or show up, as students have busy schedules. If someone repeatedly doesn't show up, you can choose to contact other claimants or keep the item posted for others to see.",
    },
    {
      question: "How can I increase my chances of getting my lost item back?",
      answer:
        "Include clear photos, detailed descriptions, and the exact location/time you lost it. Check the platform regularly and respond quickly to any contacts. Also, consider posting on your university's social media groups and checking the physical lost & found office.",
    },
  ];

  return (
    <>
      <SEO
        title="How It Works - CampusLostFound | Step-by-Step Guide"
        description="Learn how to report lost items, claim found items, and safely recover your belongings on CampusLostFound. Complete guide with safety tips and FAQs."
        keywords="how to report lost item, claim found items, campus lost and found guide, student safety tips, lost item recovery"
      />

      <div className="how-it-works-container">
        {/* Hero Section */}
        <section className="how-hero">
          <div className="container">
            <h1 className="campus-hero-title">How CampusLostFound Works</h1>
            <p className="hero-description description">
              Simple steps to report, find, and safely recover lost items on
              your campus
            </p>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="tabs-section">
          <div className="container">
            <div className="tab-buttons">
              <button
                className={`tab-btn ${activeTab === "report" ? "active" : ""}`}
                onClick={() => setActiveTab("report")}
              >
                <CiFlag1 className="tab-icon" />
                Report Lost Item
              </button>
              <button
                className={`tab-btn ${activeTab === "found" ? "active" : ""}`}
                onClick={() => setActiveTab("found")}
              >
                <CiSearch className="tab-icon" />
                Report Found Item
              </button>
              <button
                className={`tab-btn ${activeTab === "claim" ? "active" : ""}`}
                onClick={() => setActiveTab("claim")}
              >
                <CiHeart className="tab-icon" />
                Claim Your Item
              </button>
            </div>

            {/* Report Lost Item Tab */}
            {activeTab === "report" && (
              <div className="tab-content">
                <h2>How to Report a Lost Item</h2>
                <div className="steps-grid">
                  <div className="step-card">
                    <div className="step-number">1</div>
                    <CiUser className="step-icon" />
                    <h3>Sign Up / Log In</h3>
                    <p>
                      Create an account with your university email address. This
                      ensures only students from your university can see your
                      post.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">2</div>
                    <CiFlag1 className="step-icon" />
                    <h3>Click "Report Item"</h3>
                    <p>
                      Select "Lost" and fill out the detailed form with
                      information about your missing item.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">3</div>
                    <CiCamera className="step-icon" />
                    <h3>Add Photos & Details</h3>
                    <p>
                      Upload clear photos if you have them. Include detailed
                      description, brand, color, and any unique features.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">4</div>
                    <CiLocationOn className="step-icon" />
                    <h3>Specify Location</h3>
                    <p>
                      Mention exactly where you lost the item - library,
                      cafeteria, specific building, or classroom number.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">5</div>
                    <CiMail className="step-icon" />
                    <h3>Wait for Responses</h3>
                    <p>
                      Check your email and dashboard regularly. Someone who
                      found your item will contact you directly.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">6</div>
                    <CiCircleCheck className="step-icon" />
                    <h3>Verify & Collect</h3>
                    <p>
                      Meet in a safe, public place on campus. Verify the item
                      details and collect your belonging safely.
                    </p>
                  </div>
                </div>

                <div className="tips-section">
                  <h3>💡 Pro Tips for Lost Items</h3>
                  <ul>
                    <li>
                      Report your item as soon as possible - the sooner you
                      post, the better your chances
                    </li>
                    <li>
                      Include serial numbers or unique identifiers if available
                    </li>
                    <li>Check back regularly - new items are posted daily</li>
                    <li>
                      Share your post link with friends who might have seen your
                      item
                    </li>
                    <li>
                      Also check your university's official lost & found office
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Report Found Item Tab */}
            {activeTab === "found" && (
              <div className="tab-content">
                <h2>How to Report a Found Item</h2>
                <div className="steps-grid">
                  <div className="step-card">
                    <div className="step-number">1</div>
                    <CiSearch className="step-icon" />
                    <h3>Found Something?</h3>
                    <p>
                      Pick up the item safely and check if there's any immediate
                      identification like a student ID or name tag.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">2</div>
                    <CiFlag1 className="step-icon" />
                    <h3>Report as "Found"</h3>
                    <p>
                      Log into CampusLostFound and click "Report Item", then
                      select "Found" option.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">3</div>
                    <CiCamera className="step-icon" />
                    <h3>Take Clear Photos</h3>
                    <p>
                      Photograph the item from multiple angles. Avoid showing
                      serial numbers or personal info in photos.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">4</div>
                    <CiLocationOn className="step-icon" />
                    <h3>Describe Location</h3>
                    <p>
                      Mention exactly where you found it - this helps verify
                      legitimate owners.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">5</div>
                    <CiMail className="step-icon" />
                    <h3>Review Claims</h3>
                    <p>
                      Students will contact you claiming the item. Ask for
                      specific details to verify the real owner.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">6</div>
                    <CiHeart className="step-icon" />
                    <h3>Return Safely</h3>
                    <p>
                      Meet in a public campus location. Verify their details
                      match the item and hand it over.
                    </p>
                  </div>
                </div>

                <div className="tips-section">
                  <h3>💡 Pro Tips for Found Items</h3>
                  <ul>
                    <li>
                      Don't include sensitive details in your post - save these
                      for verification
                    </li>
                    <li>
                      Ask claimants specific questions only the real owner would
                      know
                    </li>
                    <li>
                      If multiple people claim the item, choose the one with
                      most accurate details
                    </li>
                    <li>
                      Consider turning valuable items to campus security if
                      unsure
                    </li>
                    <li>
                      Take a photo of yourself returning the item as proof of
                      good deed
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Claim Item Tab */}
            {activeTab === "claim" && (
              <div className="tab-content">
                <h2>How to Claim Your Lost Item</h2>
                <div className="steps-grid">
                  <div className="step-card">
                    <div className="step-number">1</div>
                    <CiSearch className="step-icon" />
                    <h3>Search Regularly</h3>
                    <p>
                      Check the "Found Items" section daily. Use filters for
                      category, location, and date to narrow your search.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">2</div>
                    <CiCircleCheck className="step-icon" />
                    <h3>Identify Your Item</h3>
                    <p>
                      Look carefully at photos and descriptions. If you think
                      it's yours, prepare specific details to prove ownership.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">3</div>
                    <CiPhone className="step-icon" />
                    <h3>Contact the Finder</h3>
                    <p>
                      Click "Contact Details" to reach the person who found your
                      item. Be ready to provide verification details.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">4</div>
                    <CiLock className="step-icon" />
                    <h3>Verify Ownership</h3>
                    <p>
                      Answer their questions about the item honestly. Describe
                      unique features, contents, or circumstances of loss.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">5</div>
                    <CiLocationOn className="step-icon" />
                    <h3>Arrange Safe Meetup</h3>
                    <p>
                      Agree on a public campus location like the library,
                      cafeteria, or main entrance. Bring a friend if possible.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">6</div>
                    <CiHeart className="step-icon" />
                    <h3>Say Thank You!</h3>
                    <p>
                      Express gratitude to the finder. Consider leaving a
                      positive comment or helping them find something in the
                      future.
                    </p>
                  </div>
                </div>

                <div className="tips-section">
                  <h3>💡 Pro Tips for Claiming Items</h3>
                  <ul>
                    <li>
                      Respond quickly - other people might claim the same item
                    </li>
                    <li>
                      Be honest about details - lying won't help you get the
                      wrong item
                    </li>
                    <li>Bring ID to the meetup to verify you're a student</li>
                    <li>
                      If the item isn't yours, let them know so they can help
                      the real owner
                    </li>
                    <li>Update your own "Lost" post to mark it as found</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Safety & Privacy Section */}
        <section className="safety-section">
          <div className="container">
            <h2 className="section-title">Safety & Privacy Policies</h2>
            <div className="safety-grid">
              <div className="safety-card">
                <CiLock className="safety-icon" />
                <h3>Personal Safety</h3>
                <ul>
                  <li>Always meet in public campus areas</li>
                  <li>Bring a friend to item exchanges when possible</li>
                  <li>Meet during daytime or well-lit evening hours</li>
                  <li>
                    Trust your instincts - if something feels wrong, don't
                    proceed
                  </li>
                  <li>Consider involving campus security for valuable items</li>
                </ul>
              </div>

              <div className="safety-card">
                <CiUser className="safety-icon" />
                <h3>Privacy Protection</h3>
                <ul>
                  <li>Your email is never displayed publicly on posts</li>
                  <li>
                    Contact information is only shared when you choose to
                    contact someone
                  </li>
                  <li>You can edit or delete your posts anytime</li>
                  <li>We never sell your data to third parties</li>
                  <li>Photos and descriptions are your choice to share</li>
                </ul>
              </div>

              <div className="safety-card">
                <CiCircleCheck className="safety-icon" />
                <h3>Verification Tips</h3>
                <ul>
                  <li>
                    Ask for specific details only the real owner would know
                  </li>
                  <li>Request proof of purchase for expensive items</li>
                  <li>
                    Check for matching scratches, wear patterns, or unique marks
                  </li>
                  <li>Ask about contents of bags, wallets, or containers</li>
                  <li>Verify the story of when and where the item was lost</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-container">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button
                    className={`faq-question ${
                      activeFaq === index ? "active" : ""
                    }`}
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-toggle">
                      {activeFaq === index ? "−" : "+"}
                    </span>
                  </button>
                  {activeFaq === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="container">
            <h2>Ready to Get Started?</h2>
            <p>
              Join thousands of students who are helping each other find lost
              items every day.
            </p>
            <div className="cta-buttons">
              <a href="/signup" className="btn btn-primary">
                Create Account
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

export default HowItWorks;
