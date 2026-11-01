export default function ReviewStep({ draft }) {
  const rows = [["Type", draft.role], ["Item", draft.title], ["Category", draft.category], ["Location", draft.location || "Not specified"], ["Date", draft.date], ["Description", draft.description]];
  return <div className="report-step"><h3>Review report</h3><p className="report-step__hint">Check the public report details before submitting.</p><dl className="report-review">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "—"}</dd></div>)}</dl></div>;
}
