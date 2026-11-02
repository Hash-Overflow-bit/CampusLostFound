import React, { useState, useEffect, useMemo } from "react";
import { saveSubscriber } from "../services/subscriberService";
/* Newsletter subscriber component (same logic as footer) */
const NewsletterSubscriber = () => {
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
    <form
      onSubmit={handleSubscribe}
      className="newsletter-form"
      style={{
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap",
        marginBottom: "1rem",
      }}
    >
      <input
        type="email"
        placeholder="Enter your university email"
        value={subscriberEmail}
        onChange={(e) => setSubscriberEmail(e.target.value)}
        required
        style={{
          padding: "0.5rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
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
        className="subscribe-btn"
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
      {subStatus && (
        <span
          style={{
            marginLeft: "1rem",
            color: subStatus.includes("success") ? "#59B888" : "#dc2626",
          }}
        >
          {subStatus}
        </span>
      )}
    </form>
  );
};
import {
  CiSearch,
  CiCalendar,
  CiUser,
  CiHeart,
  CiBookmark,
  CiShare2,
  CiClock2,
  CiLock,
} from "react-icons/ci";
import SEO from "../componenets/seo/SEO";
import NustImg from "../assets/Nust.png";
import UmtImg from "../assets/UMT.png";
import LazyImage from "../componenets/LazyImage/LazyImage";
import GikiImg from "../assets/giki.png";
import "./Blog.css";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);

  const categories = [
    { id: "all", name: "All Articles", count: 7 },
    { id: "safety", name: "Campus Safety", count: 3 },
    { id: "tips", name: "Student Tips", count: 1 },
    { id: "university", name: "University Life", count: 1 },
    { id: "prevention", name: "Prevention", count: 2 },
  ];

  const articles = useMemo(
    () => [
      {
        id: 1,
        title: "10 Essential Campus Safety Tips Every Student Should Know",
        excerpt:
          "Discover the most important safety measures to keep yourself and your belongings secure while navigating university life.",
        content: `Campus safety is a top priority for every student. Whether you're a freshman just starting your university journey or a senior finishing up, these essential safety tips will help you stay protected throughout your academic career.

## 1. Always Be Aware of Your Surroundings

The most fundamental safety rule is staying alert. Put away your phone when walking alone, especially at night. Keep your head up and be aware of who's around you. If something feels off, trust your instincts.

## 2. Use Campus Safety Services

Most universities offer safety escorts, emergency phones, and shuttle services. Don't hesitate to use these resources - they're there for your protection and peace of mind.

## 3. Secure Your Belongings

Never leave laptops, phones, or bags unattended in libraries, cafeterias, or common areas. Even a quick bathroom break can result in theft. Always lock your dorm room, even if you're just going next door.

## 4. Share Your Location

Let friends or family know where you're going and when you expect to return, especially for late-night study sessions or social events.

## 5. Emergency Contacts Ready

Program campus security and local emergency numbers into your phone. Many universities have their own emergency apps - download and set them up.

Remember, being safe doesn't mean being paranoid. It's about being prepared and making smart choices that allow you to enjoy your university experience with confidence.`,
        category: "safety",
        author: "Campus Safety Team",
        date: "2024-01-15",
        readTime: 5,
        tags: ["safety", "campus", "security", "students"],
        image: "/api/placeholder/400/200",
      },
      {
        id: 2,
        title: "How to Prevent Losing Your Items: A Student's Complete Guide",
        excerpt:
          "Learn practical strategies to keep track of your belongings and prevent the stress of losing important items on campus.",
        content: `Losing items on campus is frustrating and costly. Here's your complete guide to keeping track of your belongings and developing habits that prevent loss.

## Create a Daily Routine Checklist

Before leaving any location, do a quick mental check: phone, wallet, keys, bag, laptop. Make this automatic by practicing the same sequence every time.

## Use Technology to Your Advantage

- Enable Find My Device on all electronics
- Use Bluetooth trackers on keys and bags
- Take photos of important documents and store them in the cloud
- Use apps to track where you last placed items

## Organize Your Living Space

A cluttered room leads to lost items. Designate specific places for everything:
- Keys go on a hook by the door
- Phone charger has a specific drawer
- Important documents in a file folder
- Bag by your desk or bed

## Label Everything

Put your contact information on laptops, textbooks, water bottles, and other items. If someone finds them, they can return them to you.

## Develop Memory Techniques

- When you put something down, say out loud where you're placing it
- Use visual cues to remember locations
- Take photos of where you parked or stored something important

## The 'Home Base' Strategy

Choose one spot in your dorm or apartment as your 'home base' where you always place important items when you come home. This creates a reliable system.

Prevention is always better than searching. These habits might seem like extra work initially, but they'll save you hours of stress and potentially hundreds of dollars in replacements.`,
        category: "prevention",
        author: "Student Life Editorial",
        date: "2024-01-12",
        readTime: 4,
        tags: ["prevention", "organization", "tips", "habits"],
        image: "/api/placeholder/400/200",
      },
      {
        id: 3,
        title: "Campus Life at NUST Islamabad",
        excerpt:
          "Explore the vibrant student life, societies, and world-class facilities at NUST Islamabad. Discover why NUST is a top choice for engineering and technology in Pakistan.",
        content: `National University of Sciences and Technology (NUST) is renowned for its academic excellence and dynamic campus life. Students enjoy modern labs, active student societies, and a beautiful green campus. Popular societies include NUST Science Society, NUST Debating Society, and NUST Adventure Club. The campus features state-of-the-art sports facilities, libraries, and regular cultural festivals. NUST's strong alumni network and industry partnerships help students launch successful careers.`,
        category: "university",
        author: "NUST Student Affairs",
        date: "2025-09-18",
        readTime: 5,
        tags: ["NUST", "engineering", "student life", "Islamabad"],
        image: NustImg,
        website: "https://nust.edu.pk",
      },
      {
        id: 8,
        title: "Campus Life at LUMS Lahore",
        excerpt:
          "Experience the diverse culture, academic rigor, and social events at LUMS Lahore. Learn about student clubs, sports, and the famous LUMS Olympiad.",
        content: `LUMS (Lahore University of Management Sciences) offers a unique blend of academic excellence and vibrant campus life. Students participate in over 50 clubs and societies, including Dramatics, Music, and Entrepreneurship. The annual LUMS Olympiad is a highlight, attracting students nationwide for competitions and performances. The campus boasts modern hostels, sports complexes, and a lively cafeteria scene. LUMS is known for its inclusive culture and strong support for student initiatives.`,
        category: "university",
        author: "LUMS Campus Team",
        date: "2025-09-18",
        readTime: 5,
        tags: ["LUMS", "Lahore", "student life", "Olympiad"],
        image: UmtImg,
        website: "https://lums.edu.pk",
      },
      {
        id: 9,
        title: "Campus Life at GIKI",
        excerpt:
          "Discover the innovative spirit and close-knit community at GIKI. From robotics competitions to mountain hikes, GIKI offers a unique student experience.",
        content: `Ghulam Ishaq Khan Institute (GIKI) is famous for its engineering programs and scenic campus in Topi, KPK. Students are active in technical societies like IEEE and Robotics Club, and enjoy outdoor activities such as hiking and camping. GIKI's annual All Pakistan Tech Competition draws teams from across the country. The campus culture is friendly and collaborative, with strong traditions and alumni support.`,
        category: "university",
        author: "GIKI Student Life",
        date: "2025-09-18",
        readTime: 4,
        tags: ["GIKI", "engineering", "Topi", "student life"],
        image: GikiImg,
        website: "https://giki.edu.pk",
      },
      {
        id: 4,
        title:
          "The Psychology of Lost Items: Why We Lose Things and How to Stop",
        excerpt:
          "Understanding the mental factors behind lost items can help you develop better habits and reduce future losses.",
        content: `Ever wonder why you keep losing the same types of items? There's actually fascinating psychology behind our tendency to misplace belongings.

## The Mindlessness Factor

Most items are lost when we're operating on "autopilot." Our brains are focused on other tasks, and we put things down without conscious awareness.

**Solution**: Practice mindful placement. When putting something down, take a moment to consciously note where you're placing it.

## Stress and Memory

High stress levels significantly impact our ability to remember where we've placed items. During exam periods or personal stress, lost items spike.

**Solution**: During stressful periods, be extra deliberate about item placement and use written reminders.

## The Familiar Environment Trap

We lose things most often in familiar environments because we feel comfortable and let our guard down.

**Solution**: Treat familiar spaces with the same care as unfamiliar ones. Don't assume "I'll remember" just because you're at home.

## Cognitive Load

When your brain is processing too much information, it starts dropping "less important" details like where you put your keys.

**Solution**: Reduce cognitive load by establishing routines and designated places for important items.

## The Optimism Bias

We think we're less likely to lose things than we actually are, leading to careless behavior.

**Solution**: Accept that everyone loses things and prepare accordingly with trackers, labels, and backup plans.

## Social Factors

Items are lost more frequently in social situations where our attention is divided between belongings and interactions.

**Solution**: Do a belongings check before leaving any social gathering, and designate a friend as your "reminder buddy."

Understanding these psychological factors helps you work with your brain's natural tendencies rather than against them. The goal isn't to change your personality - it's to create systems that account for how your mind actually works.`,
        category: "tips",
        author: "Dr. Sarah Johnson",
        date: "2024-01-08",
        readTime: 7,
        tags: ["psychology", "behavior", "prevention", "science"],
        image: "/api/placeholder/400/200",
      },
      {
        id: 5,
        title:
          "Building Community: How Lost & Found Creates Campus Connections",
        excerpt:
          "Explore how helping each other find lost items strengthens university communities and creates lasting friendships.",
        content: `Lost and found isn't just about items - it's about human connection and building community trust on campus.

## The Helper's High

When you help someone find their lost item, both you and the recipient experience a boost in mood and life satisfaction. This "helper's high" strengthens community bonds.

## Creating Trust Networks

Every positive interaction through lost and found helps build trust within the campus community. Students become more willing to help each other in other areas too.

## Breaking Social Barriers

Lost and found interactions often connect students who might never have met otherwise - different majors, years, social groups. It's a natural icebreaker.

## The Ripple Effect

One good deed often inspires others. Students who have been helped are more likely to help others, creating a positive cycle throughout campus.

## Building Reputation

Being known as someone who helps with lost items builds your reputation as trustworthy and caring, valuable traits for future networking and relationships.

## Cultural Exchange

International students often participate actively in lost and found, creating opportunities for cultural exchange and friendship across different backgrounds.

## Developing Empathy

Regularly considering how others must feel when they lose important items develops emotional intelligence and empathy.

When we frame lost and found as community building rather than just a service, it becomes clear why these platforms are so valuable beyond their practical function. They help create the kind of campus culture where everyone looks out for each other.`,
        category: "university",
        author: "Community Relations",
        date: "2024-01-05",
        readTime: 5,
        tags: ["community", "connections", "campus culture", "social"],
        image: "/api/placeholder/400/200",
      },
      {
        id: 6,
        title: "Digital vs Physical Lost Items: Modern Challenges for Students",
        excerpt:
          "How technology has changed what students lose and new strategies for protecting both digital and physical belongings.",
        content: `Today's students face unique challenges in protecting both traditional physical items and digital assets. Here's how to secure both.

## The New Lost Items Landscape

**Physical Items**: Still losing keys, wallets, and phones, but now these items are more expensive and contain more personal data.

**Digital Items**: Passwords, digital files, cryptocurrency, social media accounts, and online subscriptions.

## Protecting Physical Tech

**Phone Security**: Use strong lock screens, enable find-my-device features, and consider phone insurance for expensive devices.

**Laptop Protection**: Use laptop locks in public spaces, encrypt your hard drive, and backup everything to the cloud.

**Accessories**: Bluetooth headphones, chargers, and adapters are frequently lost. Consider cheaper alternatives for daily carry.

## Digital Asset Protection

**Password Management**: Use a password manager to avoid losing access to accounts. Enable two-factor authentication wherever possible.

**Cloud Backup**: Automatically backup photos, documents, and important files. Local storage alone isn't enough.

**Digital Subscriptions**: Keep track of what you're paying for monthly. Students often lose money on forgotten subscriptions.

## The Hybrid Solution

Many modern solutions protect both physical and digital assets:
- Cloud storage with offline access
- Digital wallets that work without your phone
- Smart tags that bridge physical and digital tracking

## Recovery Strategies

**For Physical Items**: Use tracking devices, label everything, and join campus lost and found communities.

**For Digital Items**: Keep recovery information updated, use security questions you'll remember, and maintain backup access methods.

The key is creating systems that protect both types of assets while not being so complex that you can't maintain them during busy academic periods.`,
        category: "tips",
        author: "Tech Safety Team",
        date: "2024-01-03",
        readTime: 6,
        tags: [
          "technology",
          "digital security",
          "modern problems",
          "protection",
        ],
        image: "/api/placeholder/400/200",
      },
      {
        id: 7,
        title:
          "Campus Emergency Preparedness: What Every Student Needs to Know",
        excerpt:
          "Essential information about emergency procedures, safety resources, and preparedness strategies for university students.",
        content: `Campus emergencies can happen without warning. Being prepared isn't just smart - it could save your life or help you assist others in need.

## Know Your Campus Emergency Systems

**Emergency Alerts**: Sign up for text, email, and app notifications from your university's emergency system.

**Emergency Phones**: Learn locations of emergency call boxes around campus, especially along your regular routes.

**Safe Zones**: Identify designated safe areas in buildings you frequent - these are marked for tornados, lockdowns, and other emergencies.

## Personal Emergency Kit

Keep these items in your dorm and backpack:
- Emergency contact information (written down, not just in your phone)
- Small flashlight and extra batteries
- First aid supplies
- Emergency cash
- Portable phone charger
- Any prescription medications

## Communication Plans

**Family Contact**: Establish a communication plan with family for different types of emergencies.

**Friend Network**: Know how to reach close friends without relying on social media or cell towers.

**Backup Plans**: Have multiple ways to get home or to safety if primary transportation isn't available.

## Specific Emergency Types

**Medical Emergencies**: Know where the campus health center is, how to call for medical help, and basic first aid.

**Severe Weather**: Understand your area's weather risks and know shelter procedures for each building you frequent.

**Security Threats**: Learn lockdown procedures and know multiple exit routes from buildings.

## Mental Health Emergencies

Recognize signs of mental health crises in yourself and others:
- Know campus counseling resources
- Understand when to call emergency services
- Learn how to support friends in crisis

## Stay Informed

- Follow campus safety social media accounts
- Attend safety presentations and drills
- Read emergency information posted in dorms and buildings
- Download your university's emergency app

Being prepared doesn't mean living in fear - it means being ready to handle challenges calmly and effectively. Most students will never face a serious emergency, but those who are prepared can help themselves and others when situations arise.`,
        category: "safety",
        author: "Emergency Management",
        date: "2024-01-01",
        readTime: 8,
        tags: ["emergency", "preparedness", "safety", "campus"],
        image: "/api/placeholder/400/200",
      },
    ],
    []
  );

  useEffect(() => {
    let filtered = articles;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredArticles(filtered);
  }, [selectedCategory, searchTerm, articles]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <SEO
        title="Blog - CampusLostFound | Student Tips, Safety & University Life"
        description="Read expert articles about campus safety, student tips, lost item prevention, and university life. Stay informed with our comprehensive student resource blog."
        keywords="campus safety blog, student tips, university life, lost item prevention, campus security, student resources"
      />

      <div className="blog-container">
        {/* Hero Section */}
        <section className="blog-hero">
          <div className="container">
            <h1 className="campus-hero-title">Campus Life Blog</h1>
            <p className="hero-description description">
              Expert tips, safety guides, and insights to help you thrive at
              university
            </p>

            {/* Search Bar */}
            <div className="search-container">
              <div className="search-wrapper">
                <CiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search articles, tips, and guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="categories-section">
          <div className="container">
            <div className="categories-wrapper">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-btn ${
                    selectedCategory === category.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                  <span className="category-count">({category.count})</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {filteredArticles.length > 0 && (
          <section className="featured-section">
            <div className="container">
              <div className="featured-badge">Featured Article</div>
              <div className="featured-article">
                <div className="featured-content">
                  <div className="featured-meta">
                    <span className="category-tag">
                      {filteredArticles[0].category}
                    </span>
                    <span className="read-time">
                      <CiClock2 /> {filteredArticles[0].readTime} min read
                    </span>
                  </div>
                  <h2 className="featured-title">
                    {filteredArticles[0].title}
                  </h2>
                  <p className="featured-excerpt">
                    {filteredArticles[0].excerpt}
                  </p>
                  <div className="featured-author">
                    <CiUser className="author-icon" />
                    <span>By {filteredArticles[0].author}</span>
                    <CiCalendar className="date-icon" />
                    <span>{formatDate(filteredArticles[0].date)}</span>
                  </div>
                  <a
                    className="read-more-btn"
                    href={filteredArticles[0].website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Official Website
                  </a>
                </div>
                <div className="featured-image">
                  <LazyImage
                    src={filteredArticles[0].image}
                    alt={filteredArticles[0].title}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Articles Grid */}
        <section className="articles-section">
          <div className="container">
            <div className="articles-header">
              <h2>Latest Articles</h2>
              <p>Showing {filteredArticles.length} articles</p>
            </div>

            <div className="articles-grid">
              {filteredArticles.slice(1).map((article) => (
                <article key={article.id} className="article-card">
                  <div className="article-image">
                    <LazyImage src={article.image} alt={article.title} />
                    <div className="article-overlay">
                      <button className="bookmark-btn">
                        <CiBookmark />
                      </button>
                      <button className="share-btn">
                        <CiShare2 />
                      </button>
                      {article.website && (
                        <a
                          className="visit-website-btn"
                          href={article.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="article-content">
                    <div className="article-meta">
                      <span className="category-tag">{article.category}</span>
                      <span className="read-time">
                        <CiClock2 /> {article.readTime} min
                      </span>
                    </div>

                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-excerpt">{article.excerpt}</p>

                    <div className="article-footer">
                      <div className="author-info">
                        <CiUser className="author-icon" />
                        <span>{article.author}</span>
                      </div>
                      <div className="article-date">
                        <CiCalendar />
                        <span>{formatDate(article.date)}</span>
                      </div>
                    </div>

                    <div className="article-tags">
                      {article.tags.map((tag) => (
                        <span key={tag} className="tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="no-results">
                <CiSearch className="no-results-icon" />
                <h3>No articles found</h3>
                <p>
                  Try adjusting your search terms or browse different categories
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="newsletter-section">
          <div className="container">
            <div className="newsletter-content">
              <h2>Stay Updated</h2>
              <p>
                Get the latest campus safety tips and student guides delivered
                to your inbox
              </p>
              <NewsletterSubscriber />
              <p className="newsletter-note">
                <CiLock className="privacy-icon" />
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;
