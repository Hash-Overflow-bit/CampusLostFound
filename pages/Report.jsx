import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import SEO from "../componenets/seo/SEO";
import ReportFlow from "../features/reports/components/ReportFlow";
import { createReport } from "../features/reports/repositories/supabaseReportRepository";
import "./Report.css";

export default function Report() {
  const { user, profile, campus } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);

  const initialData = useMemo(() => ({
    role: location.state?.kind === "found"
      ? "found"
      : location.state?.kind === "lost"
        ? "lost"
        : undefined,
  }), [location.state?.kind]);

  const submitReport = useCallback(async (report) => {
    if (!user?.id || !profile?.campus_id) {
      throw new Error("A verified university account with a trusted campus is required.");
    }

    const occurredAt = report.date ? new Date(report.date).toISOString() : null;

    await createReport({
      item: {
        owner_id: user.id,
        campus_id: profile.campus_id,
        kind: report.role,
        status: "open",
        title: report.title,
        category: report.category,
        color: report.color || null,
        description: report.description || null,
        public_location: report.location || null,
        occurred_at: occurredAt,
      },
      privateDetails: {
        exact_location: null,
        identifying_details: null,
        contact_email: report.email || user.email || null,
        contact_phone: report.phone || null,
      },
      image: report.image || null,
    });

    setCompleted(true);
  }, [user, profile]);

  const campusName = campus?.name || profile?.campuses?.name || "your campus";

  return (
    <>
      <SEO
        title="Report Lost or Found Item | Campus Lost Found"
        description="Report a lost or found item at your university and help your campus community recover belongings safely."
        url={`${window.location.origin}/report`}
      />

      <main className="report-page">
        <div className="report-page__intro">
          <span className="report-page__campus">{campusName}</span>
          <h1>{completed ? "Report published." : "Tell your campus what happened."}</h1>
          <p>
            {completed
              ? "Your report is now available to the right campus community."
              : "A short guided flow keeps the report useful, private, and easy for other students to recognize."}
          </p>
        </div>

        {completed ? (
          <section className="report-success">
            <div className="report-success__mark">✓</div>
            <p className="report-success__eyebrow">Published successfully</p>
            <h2>Your campus can help now.</h2>
            <p>
              The report is live in your verified campus feed. Private contact details remain separate from the public listing.
            </p>

            <div className="report-success-actions">
              <button
                type="button"
                className="report-another-btn report-another-btn--secondary"
                onClick={() => setCompleted(false)}
              >
                Report another item
              </button>
              <button
                type="button"
                className="report-another-btn"
                onClick={() => navigate("/dashboard", { replace: true })}
              >
                View campus feed →
              </button>
            </div>
          </section>
        ) : (
          <ReportFlow
            initialData={initialData}
            onCancel={() => navigate(location.state?.from || "/dashboard")}
            onComplete={submitReport}
          />
        )}
      </main>
    </>
  );
}
