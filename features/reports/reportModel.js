import UniversityData from "../../data/Universities";

export const EMPTY_REPORT = Object.freeze({
  role: "",
  title: "",
  description: "",
  category: "",
  location: "",
  date: "",
  email: "",
  phone: "",
  contactPreference: "email",
  image: null,
});

export const createReportDraft = (initialData = {}, email = "") => ({
  ...EMPTY_REPORT,
  ...initialData,
  email: initialData.email || email || "",
});

export const getUniversityFromEmail = (email) => {
  const domain = email?.split("@")[1]?.toLowerCase();
  if (!domain) return null;
  const university = UniversityData.getUniversitiesArray().find(
    (candidate) => candidate.domain?.toLowerCase() === domain
  );
  return university
    ? { id: university.id, name: university.name, domain: university.domain, docId: university.docId }
    : { id: null, name: "Unknown University", domain, docId: null };
};
