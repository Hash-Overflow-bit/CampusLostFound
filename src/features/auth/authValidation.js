import { basicUniversities, isValidDomain } from "../../data/UniversityDomains";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value = "") {
  return value.trim().toLowerCase();
}

export function getEmailDomain(value = "") {
  const email = normalizeEmail(value);
  return email.includes("@") ? email.split("@").pop() : "";
}

export function validateUniversityEmail(value) {
  const email = normalizeEmail(value);
  if (!email) return "University email is required.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
  const domain = getEmailDomain(email);
  if (!domain || !isValidDomain(domain)) return "Use an approved university email address.";
  return true;
}

export function validateUniversityEmailForSelection(value, universityId) {
  const baseValidation = validateUniversityEmail(value);
  if (baseValidation !== true) return baseValidation;
  if (!universityId) return "Select your university first.";

  const selectedUniversity = basicUniversities.find((item) => String(item.id) === String(universityId));
  if (!selectedUniversity) return "Select a valid university.";

  return getEmailDomain(value) === selectedUniversity.domain.toLowerCase()
    ? true
    : `Use your ${selectedUniversity.name} email address.`;
}

export function validatePassword(value = "") {
  if (value.length < 10) return "Use at least 10 characters.";
  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value)) {
    return "Include uppercase, lowercase, and a number.";
  }
  return true;
}

export function validateFullName(value = "") {
  const name = value.trim();
  if (name.length < 2 || name.length > 80) return "Enter your full name (2–80 characters).";
  return true;
}
