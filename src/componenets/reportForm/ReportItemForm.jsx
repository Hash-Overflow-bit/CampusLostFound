import { useCallback, useState } from "react";
import { useAuth } from "../../AuthContext/AuthContext";
import ReportFlow from "../../features/reports/components/ReportFlow";
import { getUniversityFromEmail } from "../../features/reports/reportModel";
import { firebaseReportRepository } from "../../features/reports/repositories/firebaseReportRepository";

/**
 * Temporary V2 compatibility wrapper for legacy surfaces that still render
 * ReportItemForm. The actual form UI lives in features/reports/ReportFlow.
 * Remove this wrapper when Dashboard/Home/ReportDemo all use the V2 route.
 */
export default function ReportItemForm({ onClose, onSubmit }) {
  const { user } = useAuth();
  const [error, setError] = useState("");

  const handleComplete = useCallback(async (report) => {
    setError("");
    const university = getUniversityFromEmail(user?.email);

    if (!user?.uid || !university) {
      setError("A verified university account is required.");
      return;
    }

    try {
      await firebaseReportRepository.create({ report, userId: user.uid, university });
      onSubmit?.(report);
    } catch (submissionError) {
      setError(submissionError?.message || "Unable to submit the report. Please try again.");
    }
  }, [onSubmit, user]);

  return (
    <div className="report-item-form-v2">
      {error ? <p role="alert" className="report-form-error">{error}</p> : null}
      <ReportFlow onCancel={() => onClose?.()} onComplete={handleComplete} />
    </div>
  );
}
