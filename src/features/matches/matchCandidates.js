import { calculateMatchScore, getMatchBand } from "./matchScore";

const ACTIVE_STATUSES = new Set(["open", "possible_match", "claim_pending"]);

export const generateMatchCandidates = (items, options = {}) => {
  const { minimumScore = 40, limitPerItem = 10 } = options;
  if (!Array.isArray(items) || !items.length) return [];

  const activeItems = items.filter(
    (item) => item && ACTIVE_STATUSES.has(item.status) && item.campus_id
  );

  const lostItems = activeItems.filter((item) => item.kind === "lost");
  const foundItems = activeItems.filter((item) => item.kind === "found");
  const candidates = [];

  for (const lostItem of lostItems) {
    const perLostItem = [];

    for (const foundItem of foundItems) {
      if (lostItem.campus_id !== foundItem.campus_id) continue;
      if (lostItem.owner_id && lostItem.owner_id === foundItem.owner_id) continue;

      const result = calculateMatchScore(lostItem, foundItem);
      if (result.score < minimumScore) continue;

      perLostItem.push({
        lost_item_id: lostItem.id,
        found_item_id: foundItem.id,
        score: result.score,
        band: getMatchBand(result.score),
        algorithm_version: result.algorithmVersion,
        components: result.components,
      });
    }

    perLostItem
      .sort((a, b) => b.score - a.score)
      .slice(0, limitPerItem)
      .forEach((candidate) => candidates.push(candidate));
  }

  return candidates.sort((a, b) => b.score - a.score);
};

export const toMatchRows = (candidates) =>
  candidates.map(({ lost_item_id, found_item_id, score, algorithm_version }) => ({
    lost_item_id,
    found_item_id,
    score,
    algorithm_version,
  }));
