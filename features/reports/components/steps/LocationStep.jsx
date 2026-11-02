export default function LocationStep({ draft, updateField }) {
  return <div className="report-step"><h3>Where and when?</h3><p className="report-step__hint">Use a campus building or public area. Avoid private personal addresses.</p><label>Location<input value={draft.location || ""} maxLength={200} onChange={(e) => updateField("location", e.target.value)} placeholder="e.g. Main library, second floor" /></label><label>Date<input type="date" value={draft.date || ""} onChange={(e) => updateField("date", e.target.value)} /></label></div>;
}
