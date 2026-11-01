import { useCallback, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import SEO from "../componenets/seo/SEO";
import ReportFlow from "../features/reports/components/ReportFlow";
import { getUniversityFromEmail } from "../features/reports/reportModel";
import { firebaseReportRepository } from "../features/reports/repositories/firebaseReportRepository";
import "./Report.css";

export default function Report() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState(false);

  const submitReport = useCallback(async (report) => {
    const university = getUniversityFromEmail(user?.email);
    if (!user?.uid || !university) throw new Error("A verified university account is required.");

    await firebaseReportRepository.create({ report, userId: user.uid, university });
    setCompleted(true);
  }, [user]);

  return <>
    <SEO title="Report Lost or Found Item | Campus Lost Found" description="Report a lost or found item at your university and help your campus community recover belongings safely." url={`${window.location.origin}/report`} />
    <main className="report-page">
      <div className="report-page-header"><h1>Report an Item</h1><p>Share the useful details. Private account information stays separate from public discovery.</p></div>
      {completed ? <div className="report-success"><h2>Item reported successfully</h2><p>Your report is ready for campus discovery and future matching.</p><button type="button" className="report-another-btn" onClick={() => setCompleted(false)}>Report another item</button></div> : <ReportFlow onCancel={() => window.history.back()} onComplete={submitReport} />}
    </main>
  </>;
}
