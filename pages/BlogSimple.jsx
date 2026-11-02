import React from "react";
import SEO from "../componenets/seo/SEO";

const BlogSimple = () => {
  return (
    <>
      <SEO
        title="Blog - CampusLostFound | Student Tips, Safety & University Life"
        description="Read expert articles about campus safety, student tips, lost item prevention, and university life."
        keywords="campus safety blog, student tips, university life"
      />

      <div style={{ padding: "20px", minHeight: "100vh" }}>
        <h1>Campus Life Blog</h1>
        <p>
          Expert tips, safety guides, and insights to help you thrive at
          university
        </p>

        <div style={{ marginTop: "40px" }}>
          <h2>Featured Articles</h2>

          <article
            style={{
              marginBottom: "30px",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <h3>Campus Safety: Essential Tips for University Students</h3>
            <p>
              Stay safe on campus with these practical safety tips designed
              specifically for university students...
            </p>
            <small>Published: January 15, 2024 | Read time: 5 minutes</small>
          </article>

          <article
            style={{
              marginBottom: "30px",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <h3>
              How to Prevent Losing Your Items: A Student's Complete Guide
            </h3>
            <p>
              Learn practical strategies to keep track of your belongings and
              prevent the stress of losing important items...
            </p>
            <small>Published: January 12, 2024 | Read time: 4 minutes</small>
          </article>

          <article
            style={{
              marginBottom: "30px",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <h3>University Life Hacks: Save Time and Money</h3>
            <p>
              Discover insider tips to make your university experience smoother,
              more affordable, and more enjoyable...
            </p>
            <small>Published: January 10, 2024 | Read time: 6 minutes</small>
          </article>
        </div>
      </div>
    </>
  );
};

export default BlogSimple;
