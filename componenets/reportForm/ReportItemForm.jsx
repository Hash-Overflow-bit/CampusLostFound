import { useCallback, useState } from "react";
import { useAuth } from "../../AuthContext/AuthContext";
import ReportFlow from "../../features/reports/components/ReportFlow";
import { createReport } from "../../features/reports/repositories/supabaseReportRepository";

/**
 * Temporary V2 compatibility wrapper for legacy surfaces that still render
 * ReportItemForm. The actual form UI lives in features/reports/ReportFlow.
 * Remove this wrapper when Dashboard/Home/ReportDemo all use the V2 route.
 */
export default function ReportItemForm({ onClose, onSubmit }) {
  const { user, profile } = useAuth();
  const [error, setError] = useState("");

  const handleComplete = useCallback(async (report) => {
    setError("");

    if (!user?.id || !profile?.campus_id) {
      setError("A verified university account with a trusted campus is required.");
      return;
    }

    try {
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
      onSubmit?.(report);
    } catch (submissionError) {
      setError(submissionError?.message || "Unable to submit the report. Please try again.");
    }
  }, [onSubmit, profile, user]);

  return (
    <div className="report-item-form-v2">
      {error ? <p role="alert" className="report-form-error">{error}</p> : null}
      <ReportFlow onCancel={() => onClose?.()} onComplete={handleComplete} />
    </div>
  );
}
