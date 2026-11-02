import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "Campus Lost Found",
  description = "Find and report lost items across Pakistani universities and campuses",
  keywords = "lost items, found items, campus, university, Pakistan, students",
  keySentences = [],
  image = "/src/assets/logo.png",
  url = window.location.href,
  type = "website",
  siteName = "Campus Lost Found",
  author = "Campus Lost Found Team",
  links = [],
  customMeta = [],
}) => {
  // Limit keywords to maximum 15
  const processKeywords = (keywords) => {
    if (typeof keywords === "string") {
      return keywords;
    }
    if (Array.isArray(keywords)) {
      const limitedKeywords = keywords.slice(0, 15);
      return limitedKeywords.join(", ");
    }
    return "lost items, found items, campus, university, Pakistan, students";
  };

  // Limit key sentences to maximum 15
  const processKeySentences = (sentences) => {
    if (!Array.isArray(sentences)) return "";
    const limitedSentences = sentences.slice(0, 15);
    return limitedSentences.join(". ");
  };

  // Default keywords if not provided (limited to 15)
  const defaultKeywords = [
    "lost and found",
    "campus lost items",
    "university lost property",
    "student services",
    "Pakistan universities",
    "lost belongings",
    "found items",
    "campus community",
    "university students",
    "lost property recovery",
    "campus safety",
    "student help",
    "Pakistani campuses",
    "lost items platform",
    "university network",
  ];

  // Process final keywords
  const finalKeywords =
    keywords && (typeof keywords === "string" || Array.isArray(keywords))
      ? processKeywords(keywords)
      : processKeywords(defaultKeywords);

  // Process key sentences
  const finalKeySentences = processKeySentences(keySentences);

  // Default structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    description: description,
    url: url,
    author: {
      "@type": "Organization",
      name: author,
    },
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={author} />

      {/* Key Sentences for SEO */}
      {finalKeySentences && (
        <meta name="key-sentences" content={finalKeySentences} />
      )}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Favicon */}
      <link rel="icon" type="image/png" href="/src/assets/logo.png" />
      <link rel="apple-touch-icon" href="/src/assets/logo.png" />

      {/* Custom Links */}
      {links && links.map((link, index) => <link key={index} {...link} />)}

      {/* Custom Meta Tags */}
      {customMeta &&
        customMeta.map((meta, index) => <meta key={index} {...meta} />)}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
