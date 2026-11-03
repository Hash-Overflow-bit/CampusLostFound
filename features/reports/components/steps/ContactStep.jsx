export default function ContactStep({ draft, updateField }) {
  return (
    <div className="report-step">
      <p className="report-step__hint">
        These details are private. They are stored separately from the public item report.
      </p>

      <div className="report-private-note">
        <span>✓</span>
        <div>
          <strong>Your email is never shown on public item cards.</strong>
          <p>CampusLostFound uses your verified account identity for safe recovery workflows.</p>
        </div>
      </div>

      <div className="report-field-grid">
        <label className="report-field report-field--wide">
          <span>Verified account email</span>
          <input type="email" value={draft.email || ""} readOnly />
        </label>

        <label className="report-field report-field--wide">
          <span>Phone <em>optional</em></span>
          <input
            type="tel"
            value={draft.phone || ""}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="e.g. 03001234567"
            inputMode="tel"
          />
          <small>Only add this if you want it available to secure recovery workflows.</small>
        </label>
      </div>
    </div>
  );
}
