import React from "react";
import LazyImage from "../componenets/LazyImage/LazyImage";
import { useParams } from "react-router-dom";
import UniversityDetails from "../data/UniversityDetails";
import SEO from "../componenets/seo/SEO";

const UniversityDetail = () => {
  const { key } = useParams();
  const university = UniversityDetails[key];

  if (!university) {
    return <div>University not found.</div>;
  }

  return (
    <>
      <SEO
        title={`${university.name} | Campus Lost Found`}
        description={university.description}
        keywords={[
          university.name,
          university.shortName,
          university.domain,
          "Pakistani university",
          "Campus Lost Found",
        ]}
      />
      <div className="university-detail-page">
        <h1>{university.name}</h1>
        <LazyImage
          src={university.logo.replace("/src", "..")}
          alt={university.shortName}
          style={{ maxWidth: "200px" }}
        />
        <p>{university.description}</p>
        <p>
          <strong>Location:</strong> {university.location}
        </p>
        <p>
          <strong>Established:</strong> {university.established}
        </p>
        <p>
          <strong>Type:</strong> {university.type}
        </p>
        <p>
          <strong>Website:</strong>{" "}
          <a
            href={university.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {university.website}
          </a>
        </p>
        <h2>Contact</h2>
        <p>
          <strong>Phone:</strong> {university.contact.phone}
        </p>
        <p>
          <strong>Email:</strong> {university.contact.email}
        </p>
        <p>
          <strong>Address:</strong> {university.contact.address}
        </p>
        {/* Add more details as needed */}
      </div>
    </>
  );
};

export default UniversityDetail;
