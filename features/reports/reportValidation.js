const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^(\+92|0)?[0-9]{10}$/;

export const REPORT_CATEGORIES = Object.freeze([
  "ID Card", "Wallet", "Notebook", "Electronics", "Keys",
  "Bag/Backpack", "Clothing", "Books", "Jewelry", "Other",
]);

export const sanitizeReportText = (value, maxLength = 1000) => {
  if (typeof value !== "string") return value;
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>?/gm, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .slice(0, maxLength);
};

export const normalizeReportForSubmission = (data) => ({
  ...data,
  title: sanitizeReportText(data.title ?? "", 100).trim(),
  description: sanitizeReportText(data.description ?? "", 1000).trim(),
  location: sanitizeReportText(data.location ?? "", 200).trim(),
  phone: sanitizeReportText(data.phone ?? "", 20).trim(),
});

export const validateReport = (data) => {
  const required = ["role", "title", "description", "category", "date"];
  for (const field of required) {
    if (typeof data[field] !== "string" || !data[field].trim()) {
      throw new Error(`${field} is required.`);
    }
  }

  if (!REPORT_CATEGORIES.includes(data.category)) throw new Error("Invalid category.");
  if (!["lost", "found"].includes(data.role)) throw new Error("Invalid report type.");
  if (data.email && !EMAIL_REGEX.test(data.email)) throw new Error("Invalid email address.");
  if (data.phone && !PHONE_REGEX.test(data.phone.replace(/\s+/g, ""))) throw new Error("Invalid phone number.");

  const itemDate = new Date(data.date);
  if (Number.isNaN(itemDate.getTime())) throw new Error("Invalid date.");
  const now = new Date();
  const oldest = new Date(now);
  oldest.setFullYear(now.getFullYear() - 1);
  if (itemDate > now) throw new Error("Date cannot be in the future.");
  if (itemDate < oldest) throw new Error("Date cannot be more than one year ago.");

  return true;
};

export const validateReportImage = (file) => {
  if (!file) return true;
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!allowed.has(file.type)) throw new Error("Only JPEG, PNG, and WebP images are allowed.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Image must be 10MB or smaller.");
  return true;
};
