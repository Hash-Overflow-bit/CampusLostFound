export default function LocationStep({ draft, updateField }) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="report-step">
      <p className="report-step__hint">
        Give students enough context to recognize the area, without exposing a private address.
      </p>

      <div className="report-field-grid">
        <label className="report-field report-field--wide">
          <span>Campus area <em>optional</em></span>
          <input
            value={draft.location || ""}
            maxLength={200}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="e.g. Main library · second floor"
          />
          <small>Building, cafeteria, parking area, classroom block, or another public campus place.</small>
        </label>

        <label className="report-field report-field--wide">
          <span>When did this happen?</span>
          <input
            type="date"
            max={today}
            value={draft.date || ""}
            onChange={(event) => updateField("date", event.target.value)}
          />
        </label>
      </div>
    </div>
  );
}
