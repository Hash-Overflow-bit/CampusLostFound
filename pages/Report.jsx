import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import SEO from "../componenets/seo/SEO";
import ReportFlow from "../features/reports/components/ReportFlow";
import { createReport } from "../features/reports/repositories/supabaseReportRepository";
import "./Report.css";

export default function Report() {
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  const initialData = useMemo(() => ({ role: location.state?.kind === "found" ? "found" : location.state?.kind === "lost" ? "lost" : undefined }), [location.state?.kind]);

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

  return <>
    <SEO title="Report Lost or Found Item | Campus Lost Found" description="Report a lost or found item at your university and help your campus community recover belongings safely." url={`${window.location.origin}/report`} />
    <main className="report-page">
      <div className="report-page-header"><h1>Report an Item</h1><p>Share the useful details. Private account information stays separate from public discovery.</p></div>
      {completed ? <div className="report-success"><h2>Item reported successfully</h2><p>Your report is ready for campus discovery and future matching.</p><div className="report-success-actions"><button type="button" className="report-another-btn" onClick={() => setCompleted(false)}>Report another item</button><button type="button" className="report-another-btn" onClick={() => navigate("/dashboard", { replace: true })}>Back to dashboard</button></div></div> : <ReportFlow initialData={initialData} onCancel={() => navigate(location.state?.from || "/dashboard")} onComplete={submitReport} />}
    </main>
  </>;
}
