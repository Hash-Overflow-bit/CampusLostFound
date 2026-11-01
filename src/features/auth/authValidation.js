import { isValidDomain } from "../../data/UniversityDomains";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value = "") {
  return value.trim().toLowerCase();
}

export function validateUniversityEmail(value) {
  const email = normalizeEmail(value);
  if (!email) return "University email is required.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
  const domain = email.split("@")[1];
  if (!domain || !isValidDomain(domain)) return "Use an approved university email address.";
  return true;
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
