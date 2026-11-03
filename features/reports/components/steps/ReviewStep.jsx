const labelForRole = (role) => role === "found" ? "Found item" : "Lost item";

export default function ReviewStep({ draft }) {
  const rows = [
    ["Report", labelForRole(draft.role)],
    ["Item", draft.title],
    ["Category", draft.category],
    ["Color", draft.color || "Not specified"],
    ["Campus area", draft.location || "Not specified"],
    ["Date", draft.date],
    ["Description", draft.description],
  ];

  return (
    <div className="report-step report-step--review">
      <p className="report-step__hint">
        This is what students in your verified campus network will use to recognize the item.
      </p>

      {draft.existingImageUrl && !draft.image && (
        <div className="report-review-photo">
          <img src={draft.existingImageUrl} alt="" />
          <span>Current report photo</span>
        </div>
      )}

      <dl className="report-review">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value || "—"}</dd>
          </div>
        ))}
      </dl>

      <div className="report-review__privacy">
        <span>Private</span>
        <p>Your verified email and optional phone are not included in the public report above.</p>
      </div>
    </div>
  );
}
