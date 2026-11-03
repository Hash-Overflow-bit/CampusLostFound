export default function ReportTypeStep({ draft, updateField }) {
  return (
    <div className="report-step report-step--type">
      <p className="report-step__hint">
        Pick the situation that matches you. This helps us show the right action to other students.
      </p>

      <div className="report-choice-grid">
        <button
          type="button"
          className={`report-choice report-choice--lost ${draft.role === "lost" ? "is-selected" : ""}`}
          onClick={() => updateField("role", "lost")}
        >
          <span className="report-choice__number">01</span>
          <strong>I lost something</strong>
          <span>Ask your campus network to help locate it.</span>
          <small>{draft.role === "lost" ? "Selected ✓" : "Choose lost"}</small>
        </button>

        <button
          type="button"
          className={`report-choice report-choice--found ${draft.role === "found" ? "is-selected" : ""}`}
          onClick={() => updateField("role", "found")}
        >
          <span className="report-choice__number">02</span>
          <strong>I found something</strong>
          <span>Create a safe report so the owner can identify it.</span>
          <small>{draft.role === "found" ? "Selected ✓" : "Choose found"}</small>
        </button>
      </div>
    </div>
  );
}
