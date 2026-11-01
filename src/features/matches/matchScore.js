const WEIGHTS = Object.freeze({
  category: 25,
  location: 20,
  time: 20,
  title: 15,
  color: 8,
  brand: 7,
  description: 5,
});

const normalize = (value) =>
  typeof value === "string"
    ? value.toLowerCase().trim().replace(/\s+/g, " ")
    : "";

const tokenSimilarity = (left, right) => {
  const a = new Set(normalize(left).split(" ").filter(Boolean));
  const b = new Set(normalize(right).split(" ").filter(Boolean));
  if (!a.size || !b.size) return null;

  let intersection = 0;
  a.forEach((token) => {
    if (b.has(token)) intersection += 1;
  });

  const union = new Set([...a, ...b]).size;
  return union ? intersection / union : null;
};

const exactSimilarity = (left, right) => {
  const a = normalize(left);
  const b = normalize(right);
  if (!a || !b) return null;
  return a === b ? 1 : 0;
};

const timeSimilarity = (leftDate, rightDate, windowDays = 14) => {
  if (!leftDate || !rightDate) return null;
  const left = new Date(leftDate).getTime();
  const right = new Date(rightDate).getTime();
  if (!Number.isFinite(left) || !Number.isFinite(right)) return null;

  const differenceDays = Math.abs(left - right) / 86_400_000;
  return Math.max(0, 1 - differenceDays / windowDays);
};

export const calculateMatchScore = (lostItem, foundItem) => {
  if (!lostItem || !foundItem) return { score: 0, components: {} };
  if (lostItem.type === foundItem.type) return { score: 0, components: {} };

  const components = {
    category: exactSimilarity(lostItem.category, foundItem.category),
    location: tokenSimilarity(lostItem.location, foundItem.location),
    time: timeSimilarity(lostItem.eventDate ?? lostItem.date, foundItem.eventDate ?? foundItem.date),
    title: tokenSimilarity(lostItem.title, foundItem.title),
    color: exactSimilarity(lostItem.color, foundItem.color),
    brand: exactSimilarity(lostItem.brand, foundItem.brand),
    description: tokenSimilarity(lostItem.description, foundItem.description),
  };

  // Missing attributes are excluded from the denominator instead of being treated as mismatches.
  let earned = 0;
  let available = 0;

  Object.entries(components).forEach(([key, similarity]) => {
    if (similarity === null) return;
    available += WEIGHTS[key];
    earned += WEIGHTS[key] * similarity;
  });

  const score = available ? Math.round((earned / available) * 100) : 0;
  return { score, components, algorithmVersion: "v1-deterministic" };
};

export const getMatchBand = (score) => {
  if (score >= 80) return "strong";
  if (score >= 65) return "possible";
  if (score >= 40) return "weak";
  return "discard";
};

export { WEIGHTS };
