import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../AuthContext/AuthContext";
import { useReportDraft } from "../hooks/useReportDraft";
import { validateReport } from "../reportValidation";
import ReportTypeStep from "./steps/ReportTypeStep";
import ItemDetailsStep from "./steps/ItemDetailsStep";
import LocationStep from "./steps/LocationStep";
import PhotoStep from "./steps/PhotoStep";
import ContactStep from "./steps/ContactStep";
import ReviewStep from "./steps/ReviewStep";
import StatePanel from "../../../components/state/StatePanel";
import "./ReportFlow.css";

const steps = [
  { label: "Type", title: "What happened?", Component: ReportTypeStep },
  { label: "Item", title: "Describe the item", Component: ItemDetailsStep },
  { label: "Place", title: "Where and when?", Component: LocationStep },
  { label: "Photo", title: "Add a useful photo", Component: PhotoStep },
  { label: "Contact", title: "How can we reach you?", Component: ContactStep },
  { label: "Review", title: "Ready to publish", Component: ReviewStep },
];

const requiredMessage = (condition, message) => {
  if (!condition) throw new Error(message);
};

const validateCurrentStep = (step, draft) => {
  if (step === 0) {
    requiredMessage(["lost", "found"].includes(draft.role), "Choose whether the item was lost or found.");
  }

  if (step === 1) {
    requiredMessage(draft.title?.trim(), "Add a short item name.");
    requiredMessage(draft.category?.trim(), "Choose an item category.");
    requiredMessage(draft.description?.trim(), "Add a few identifying details.");
  }

  if (step === 2) {
    requiredMessage(draft.date, "Choose the date the item was lost or found.");
    const selectedDate = new Date(draft.date);
    requiredMessage(!Number.isNaN(selectedDate.getTime()), "Choose a valid date.");
    requiredMessage(selectedDate <= new Date(), "The report date cannot be in the future.");
  }

  if (step === 4 && draft.phone) {
    const normalizedPhone = draft.phone.replace(/\s+/g, "");
    requiredMessage(/^(\+92|0)?[0-9]{10}$/.test(normalizedPhone), "Enter a valid phone number or leave it blank.");
  }
};

export default function ReportFlow({ initialData, onCancel, onComplete }) {
  const { user } = useAuth();
  const { draft, updateField, reset } = useReportDraft({
    initialData,
    email: user?.email || initialData?.email || "",
  });

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [online, setOnline] = useState(() => typeof navigator === "undefined" ? true : navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const currentStep = steps[step];
  const Step = currentStep.Component;
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);
  const isEditing = Boolean(initialData?.id);
  const roleTone = draft.role === "found" ? "found" : draft.role === "lost" ? "lost" : "neutral";

  const next = () => {
    try {
      validateCurrentStep(step, draft);
      setError("");
      setStep((value) => Math.min(value + 1, steps.length - 1));
    } catch (stepError) {
      setError(stepError.message);
    }
  };

  const back = () => {
    setError("");
    setStep((value) => Math.max(value - 1, 0));
  };

  const jumpTo = (index) => {
    if (index >= step) return;
    setError("");
    setStep(index);
  };

  const submit = async () => {
    if (submitting) return;
    if (!online) {
      setError("You’re offline. Your draft is still here; reconnect before saving the report.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      validateReport(draft);
      await onComplete?.(draft);
      reset();
    } catch (submissionError) {
      setError(submissionError.message || "Unable to save this report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className={`report-flow report-flow--${roleTone}`}
      aria-labelledby="report-flow-title"
      aria-busy={submitting}
    >
      <aside className="report-flow__rail" aria-label="Report progress">
        <div className="report-flow__rail-brand">
          <span className="report-flow__rail-mark">C</span>
          <div>
            <strong>{isEditing ? "Edit report" : "New report"}</strong>
            <small>About 1 minute</small>
          </div>
        </div>

        <ol className="report-flow__steps">
          {steps.map((item, index) => {
            const completed = index < step;
            const active = index === step;
            return (
              <li key={item.label} className={active ? "is-active" : completed ? "is-complete" : ""}>
                <button
                  type="button"
                  onClick={() => jumpTo(index)}
                  disabled={!completed || submitting}
                  aria-current={active ? "step" : undefined}
                >
                  <span>{completed ? "✓" : index + 1}</span>
                  <div>
                    <small>Step {index + 1}</small>
                    <strong>{item.label}</strong>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="report-flow__privacy">
          <span>✓</span>
          <p><strong>Campus-safe by default.</strong> Contact details stay private.</p>
        </div>
      </aside>

      <div className="report-flow__workspace">
        <header className="report-flow__header">
          <div>
            <p className="report-flow__eyebrow">
              Step {step + 1} of {steps.length} · {currentStep.label}
            </p>
            <h2 id="report-flow-title">{currentStep.title}</h2>
            <p>
              {isEditing
                ? "Update only what changed. Your campus report will refresh immediately."
                : "Answer one small question at a time. You can review everything before publishing."}
            </p>
          </div>

          <button
            type="button"
            className="report-flow__close"
            onClick={onCancel}
            disabled={submitting}
            aria-label="Close report form"
          >
            ×
          </button>
        </header>

        <div className="report-flow__mobile-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        {!online && (
          <StatePanel
            compact
            tone="warning"
            title="You’re offline"
            description="You can keep reviewing this draft, but publishing and updates need an internet connection."
          />
        )}

        {error && <div className="report-flow__error" role="alert">{error}</div>}

        <div className="report-flow__step-body" key={step}>
          <Step draft={draft} updateField={updateField} />
        </div>

        <footer className="report-flow__actions">
          <div>
            {step > 0 && (
              <button type="button" className="report-flow__back" onClick={back} disabled={submitting}>
                ← Back
              </button>
            )}
          </div>

          {step < steps.length - 1 ? (
            <button type="button" className="report-flow__continue" onClick={next} disabled={submitting}>
              Continue <span>→</span>
            </button>
          ) : (
            <button
              type="button"
              className="report-flow__continue report-flow__submit"
              onClick={submit}
              disabled={submitting}
            >
              {submitting ? "Saving report…" : isEditing ? "Save changes" : "Publish report"}
            </button>
          )}
        </footer>
      </div>
    </section>
  );
}
