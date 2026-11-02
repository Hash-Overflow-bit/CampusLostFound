import { useMemo, useState } from "react";
import { useAuth } from "../../../AuthContext/AuthContext";
import Button from "../../../components/ui/Button";
import { useReportDraft } from "../hooks/useReportDraft";
import { validateReport } from "../reportValidation";
import ReportTypeStep from "./steps/ReportTypeStep";
import ItemDetailsStep from "./steps/ItemDetailsStep";
import LocationStep from "./steps/LocationStep";
import PhotoStep from "./steps/PhotoStep";
import ContactStep from "./steps/ContactStep";
import ReviewStep from "./steps/ReviewStep";
import "./ReportFlow.css";

const steps = [ReportTypeStep, ItemDetailsStep, LocationStep, PhotoStep, ContactStep, ReviewStep];

export default function ReportFlow({ initialData, onCancel, onComplete }) {
  const { user } = useAuth();
  const { draft, updateField, reset } = useReportDraft({ ...initialData, email: user?.email || initialData?.email || "" });
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const Step = steps[step];
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  const next = () => { setError(""); setStep((value) => Math.min(value + 1, steps.length - 1)); };
  const back = () => { setError(""); setStep((value) => Math.max(value - 1, 0)); };
  const submit = async () => {
    try {
      validateReport(draft);
      await onComplete?.(draft);
      reset();
    } catch (submissionError) {
      setError(submissionError.message || "Unable to submit report.");
    }
  };

  return (
    <section className="report-flow" aria-labelledby="report-flow-title">
      <header className="report-flow__header">
        <div><p className="report-flow__eyebrow">Step {step + 1} of {steps.length}</p><h2 id="report-flow-title">Report an item</h2></div>
        <button type="button" className="report-flow__close" onClick={onCancel} aria-label="Close report form">×</button>
      </header>
      <div className="report-flow__progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      {error && <div className="report-flow__error" role="alert">{error}</div>}
      <Step draft={draft} updateField={updateField} />
      <footer className="report-flow__actions">
        {step > 0 ? <Button variant="secondary" onClick={back}>Back</Button> : <span />}
        {step < steps.length - 1 ? <Button onClick={next}>Continue</Button> : <Button onClick={submit}>Submit report</Button>}
      </footer>
    </section>
  );
}
