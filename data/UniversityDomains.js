// Lightweight domain validation - only domains for fast initial load
export const validDomains = new Set([
  "umt.edu.pk",
  "lums.edu.pk",
  "ntu.edu.pk",
  "comsats.edu.pk",
  "fuuast.edu.pk",
  "numl.edu.pk",
  "nca.edu.pk",
  "bahria.edu.pk",
  "au.edu.pk",
  "vu.edu.pk",
  "kiu.edu.pk",
  "nust.edu.pk",
  "student.uet.edu.pk",
  "pu.edu.pk",
  "ue.edu.pk",
  "uvas.edu.pk",
  "iub.edu.pk",
  "uos.edu.pk",
  "student.uol.edu.pk",
  "szabist.edu.pk",
  "suit.edu.pk",
  "aku.edu",
  "giki.edu.pk",
  "nu.edu.pk",
  "uok.edu.pk",
  "qau.edu.pk",
  "uop.edu.pk",
  "usindh.edu.pk",
  "uob.edu.pk",
  "gcu.edu.pk",
  "uettaxila.edu.pk",
  "aiou.edu.pk",
  "iiui.edu.pk",
  "pieas.edu.pk",
  "iba.edu.pk",
  "fccollege.edu.pk",
  "bnu.edu.pk",
  "habib.edu.pk",
  "iqra.edu.pk",
  "jinnah.edu.pk",
  "zu.edu.pk",
  "hamdard.edu.pk",
  "preston.edu.pk",
]);

// Fast domain validation using Set for O(1) lookup
export const isValidDomain = (domain) => {
  return validDomains.has(domain?.toLowerCase());
};

// Basic university list for dropdown (minimal data)
export const basicUniversities = [
  {
    id: 1,
    name: "University of Management & Technology (UMT)",
    domain: "umt.edu.pk",
  },
  {
    id: 2,
    name: "Lahore University of Management Sciences (LUMS)",
    domain: "lums.edu.pk",
  },
  { id: 3, name: "National Textile University (NTU)", domain: "ntu.edu.pk" },
  {
    id: 4,
    name: "COMSATS Institute of Information Technology",
    domain: "comsats.edu.pk",
  },
  {
    id: 5,
    name: "Federal Urdu University of Arts, Sciences & Technology",
    domain: "fuuast.edu.pk",
  },
  {
    id: 6,
    name: "National University of Modern Languages (NUML)",
    domain: "numl.edu.pk",
  },
  { id: 7, name: "National College of Arts (NCA)", domain: "nca.edu.pk" },
  { id: 8, name: "Bahria University", domain: "bahria.edu.pk" },
  { id: 9, name: "Air University", domain: "au.edu.pk" },
  { id: 10, name: "Virtual University of Pakistan", domain: "vu.edu.pk" },
  {
    id: 11,
    name: "Karakoram International University (KIU)",
    domain: "kiu.edu.pk",
  },
  {
    id: 12,
    name: "National University of Science & Technology (NUST)",
    domain: "nust.edu.pk",
  },
  {
    id: 13,
    name: "University of Engineering and Technology (UET), Lahore",
    domain: "student.uet.edu.pk",
  },
  { id: 14, name: "University of Punjab", domain: "pu.edu.pk" },
  { id: 15, name: "University of Education", domain: "ue.edu.pk" },
  {
    id: 16,
    name: "University of Veterinary & Animal Sciences (UVAS)",
    domain: "uvas.edu.pk",
  },
  { id: 17, name: "Islamia University, Bahawalpur", domain: "iub.edu.pk" },
  { id: 18, name: "University of Sargodha", domain: "uos.edu.pk" },
  { id: 19, name: "University of Lahore", domain: "student.uol.edu.pk" },
  { id: 20, name: "SZABIST", domain: "szabist.edu.pk" },
  {
    id: 21,
    name: "Sarhad University of Science & Information Technology",
    domain: "suit.edu.pk",
  },
  { id: 22, name: "Agha Khan University", domain: "aku.edu" },
  {
    id: 23,
    name: "Ghulam Ishaq Khan Institute of Engineering Sciences and Technology (GIKI)",
    domain: "giki.edu.pk",
  },
  {
    id: 24,
    name: "National University of Computer and Emerging Sciences (FAST)",
    domain: "nu.edu.pk",
  },
  { id: 25, name: "University of Karachi", domain: "uok.edu.pk" },
  { id: 26, name: "Quaid-i-Azam University", domain: "qau.edu.pk" },
  { id: 27, name: "University of Peshawar", domain: "uop.edu.pk" },
  { id: 28, name: "University of Sindh", domain: "usindh.edu.pk" },
  { id: 29, name: "University of Balochistan", domain: "uob.edu.pk" },
  {
    id: 30,
    name: "Government College University (GCU), Lahore",
    domain: "gcu.edu.pk",
  },
  {
    id: 31,
    name: "University of Engineering and Technology (UET), Taxila",
    domain: "uettaxila.edu.pk",
  },
  { id: 32, name: "Allama Iqbal Open University", domain: "aiou.edu.pk" },
  { id: 33, name: "International Islamic University", domain: "iiui.edu.pk" },
  {
    id: 34,
    name: "Pakistan Institute of Engineering and Applied Sciences (PIEAS)",
    domain: "pieas.edu.pk",
  },
  {
    id: 35,
    name: "Institute of Business Administration (IBA), Karachi",
    domain: "iba.edu.pk",
  },
  {
    id: 36,
    name: "Forman Christian College University",
    domain: "fccollege.edu.pk",
  },
  { id: 37, name: "Beaconhouse National University", domain: "bnu.edu.pk" },
  { id: 38, name: "Habib University", domain: "habib.edu.pk" },
  { id: 39, name: "Iqra University", domain: "iqra.edu.pk" },
  { id: 40, name: "Mohammad Ali Jinnah University", domain: "jinnah.edu.pk" },
  { id: 41, name: "Ziauddin University", domain: "zu.edu.pk" },
  { id: 42, name: "Hamdard University", domain: "hamdard.edu.pk" },
  { id: 43, name: "Preston University", domain: "preston.edu.pk" },
];

// Lazy loader for full university data with campuses
let fullUniversityData = null;

export const loadFullUniversityData = async () => {
  if (fullUniversityData) {
    return fullUniversityData; // Return cached data
  }

  try {
    // Dynamically import the full Universities.js file only when needed
    const { default: UniversityData } = await import("./Universities.js");

    // Convert to array format with all campus data
    fullUniversityData = Object.entries(UniversityData.universities).map(
      ([key, university]) => ({
        id: university.id,
        name: university.name,
        domain: university.domain,
        campuses: university.campuses, // Keep all campus data
        docId: key,
      })
    );

    return fullUniversityData;
  } catch (error) {
    console.error("Failed to load full university data:", error);
    // Fallback to basic universities without campuses
    return basicUniversities.map((uni) => ({ ...uni, campuses: {} }));
  }
};

// Get campuses for a specific university (lazy loaded)
export const getCampusesForUniversity = async (universityId) => {
  const fullData = await loadFullUniversityData();
  const university = fullData.find((uni) => uni.id == universityId);

  if (!university || !university.campuses) {
    return [];
  }

  // Convert campuses object to array
  return Object.entries(university.campuses).map(([key, campus]) => ({
    id: key,
    campusId: campus.campusId,
    name: campus.name,
    ...campus,
  }));
};
