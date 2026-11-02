const VALID_STATUSES = new Set(["lost", "found", "match", "recovered"]);

export default function StatusBadge({ status, children }) {
  const normalized = String(status || "").toLowerCase();
  const safeStatus = VALID_STATUSES.has(normalized) ? normalized : "match";

  return (
    <span className={`ui-status-badge ui-status-badge--${safeStatus}`}>
      {children ?? safeStatus.toUpperCase()}
    </span>
  );
}
