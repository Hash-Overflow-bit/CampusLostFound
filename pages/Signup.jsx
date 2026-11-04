import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { basicUniversities, getCampusesForUniversity } from "../data/UniversityDomains";
import { useAuth } from "../AuthContext/AuthContext";
import { resendConfirmation, signUp } from "../features/auth/authService";
import { AUTH_SUCCESS_MESSAGES, getAuthErrorMessage } from "../features/auth/authMessages";
import { consumeClientCooldown } from "../features/auth/clientCooldown";
import { normalizeEmail, validateFullName, validatePassword, validateUniversityEmailForSelection } from "../features/auth/authValidation";
import SEO from "../componenets/seo/SEO";
import AuthShell from "../components/auth/AuthShell";
import StatePanel from "../components/state/StatePanel";

export default function Signup() {
  const { isAuthenticated, isEmailVerified } = useAuth();
  const [campuses, setCampuses] = useState([]);
  const [campusLoading, setCampusLoading] = useState(false);
  const [campusError, setCampusError] = useState("");
  const [campusRetryKey, setCampusRetryKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [notice, setNotice] = useState(null);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: "onBlur" });
  const universityId = watch("university");
  const universityLookup = useMemo(() => Object.fromEntries(basicUniversities.map((item) => [String(item.id), item])), []);

  useEffect(() => {
    let active = true;
    if (!universityId) {
      setCampuses([]);
      setCampusError("");
      return undefined;
    }
    setCampusLoading(true);
    setCampusError("");
    getCampusesForUniversity(universityId)
      .then((items) => {
        if (!active) return;
        const university = universityLookup[String(universityId)];
        setCampuses(items?.length ? items : university ? [{ id: "main", name: "Main Campus" }] : []);
      })
      .catch((error) => {
        console.error("Campus list load error:", error);
        if (!active) return;
        setCampuses([]);
        setCampusError("We could not load campuses for this university.");
      })
      .finally(() => active && setCampusLoading(false));
    return () => { active = false; };
  }, [universityId, universityLookup, campusRetryKey]);

  if (isAuthenticated && isEmailVerified) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (values) => {
    setNotice(null);
    const email = normalizeEmail(values.email);
    const emailValidation = validateUniversityEmailForSelection(email, values.university);
    if (emailValidation !== true) { setNotice({ type: "error", text: emailValidation }); return; }
    const cooldown = consumeClientCooldown("signup", 5000);
    if (!cooldown.allowed) { setNotice({ type: "error", text: "Please wait a few seconds before trying again." }); return; }
    setSubmitting(true);
    try {
      await signUp({ email, password: values.password, fullName: values.fullName.trim(), university: values.university, campus: values.campus });
      setConfirmationEmail(email);
      setNotice({ type: "success", text: AUTH_SUCCESS_MESSAGES.confirmationSent });
    } catch (error) {
      setNotice({ type: "error", text: getAuthErrorMessage(error, "signup") });
    } finally { setSubmitting(false); }
  };

  const handleResend = async () => {
    const cooldown = consumeClientCooldown(`confirmation:${confirmationEmail}`, 60000);
    if (!cooldown.allowed) {
      setNotice({ type: "error", text: "Please wait about a minute before requesting another confirmation email." });
      return;
    }
    setResending(true);
    setNotice(null);
    try {
      await resendConfirmation(confirmationEmail);
      setNotice({ type: "success", text: AUTH_SUCCESS_MESSAGES.confirmationResent });
    } catch (error) {
      const text = error?.code === "auth/reauth-required"
        ? "For security, sign in again to request another confirmation email."
        : getAuthErrorMessage(error, "signup");
      setNotice({ type: "error", text });
    } finally { setResending(false); }
  };

  if (confirmationEmail) {
    return (
      <AuthShell
        eyebrow="Almost there"
        title="Check your university inbox."
        subtitle={`We sent a confirmation link to ${confirmationEmail}. Confirm it to activate your campus account.`}
        sideTitle={"One quick check.\nThen you’re in."}
      >
        <div className="auth-confirmation" aria-live="polite">
          <div className="auth-confirmation__icon">✉</div>
          {notice && <div className={`auth-notice auth-notice--${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>{notice.text}</div>}
          <p className="auth-help">Open the email, confirm your address, then sign in. Check spam or junk if it does not arrive shortly.</p>
          <div className="auth-confirmation__actions">
            <Link className="auth-submit" to="/login" state={{ email: confirmationEmail, reason: "confirmation-sent" }}>Continue to sign in →</Link>
            <button className="auth-secondary-button" type="button" onClick={handleResend} disabled={resending}>{resending ? "Sending…" : "Resend email"}</button>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <>
      <SEO title="Create your Campus Lost Found account" description="Join Campus Lost Found with a verified university email." url="https://campuslostfound.vercel.app/signup" links={[{ rel: "canonical", href: "https://campuslostfound.vercel.app/signup" }]} />
      <AuthShell
        eyebrow="Join your campus"
        title="Create your student account."
        subtitle="Your university email connects you to the right campus network and keeps recovery activity relevant."
        sideTitle={"Your campus.\nYour recovery network."}
      >
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-form-grid">
            <div className="auth-field auth-field--full">
              <label htmlFor="fullName">Full name</label>
              <input id="fullName" autoComplete="name" placeholder="Your full name" className={`auth-input ${errors.fullName ? "is-error" : ""}`} {...register("fullName", { validate: validateFullName })} />
              {errors.fullName && <span className="auth-error" role="alert">{errors.fullName.message}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="university">University</label>
              <select id="university" className={`auth-select ${errors.university ? "is-error" : ""}`} {...register("university", { required: "Select your university." })}>
                <option value="">Choose university</option>
                {basicUniversities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
              {errors.university && <span className="auth-error" role="alert">{errors.university.message}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="campus">Campus</label>
              <select id="campus" disabled={!universityId || campusLoading} className={`auth-select ${errors.campus ? "is-error" : ""}`} {...register("campus", { required: "Select your campus." })}>
                <option value="">{campusLoading ? "Loading campuses…" : "Choose campus"}</option>
                {campuses.map((item) => <option key={item.id ?? item.campusId} value={item.id ?? item.campusId}>{item.name}</option>)}
              </select>
              {errors.campus && <span className="auth-error" role="alert">{errors.campus.message}</span>}
              {campusError && (
                <StatePanel
                  compact
                  tone="error"
                  title="Campus list unavailable"
                  description={campusError}
                  action={{ label: "Retry", onClick: () => setCampusRetryKey((value) => value + 1) }}
                />
              )}
            </div>

            <div className="auth-field auth-field--full">
              <label htmlFor="email">University email</label>
              <input id="email" type="email" autoComplete="email" placeholder="you@university.edu.pk" className={`auth-input ${errors.email ? "is-error" : ""}`} {...register("email", { validate: (value) => validateUniversityEmailForSelection(value, universityId) })} />
              <span className="auth-help">We use this only to verify your university community.</span>
              {errors.email && <span className="auth-error" role="alert">{errors.email.message}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" autoComplete="new-password" placeholder="Create password" className={`auth-input ${errors.password ? "is-error" : ""}`} {...register("password", { validate: validatePassword })} />
              {errors.password && <span className="auth-error" role="alert">{errors.password.message}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input id="confirmPassword" type="password" autoComplete="new-password" placeholder="Repeat password" className={`auth-input ${errors.confirmPassword ? "is-error" : ""}`} {...register("confirmPassword", { validate: (value, values) => value === values.password || "Passwords do not match." })} />
              {errors.confirmPassword && <span className="auth-error" role="alert">{errors.confirmPassword.message}</span>}
            </div>
          </div>

          <span className="auth-help">Password: 10+ characters with uppercase, lowercase and a number.</span>
          {notice && <div className={`auth-notice auth-notice--${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>{notice.text}</div>}
          <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? "Creating account…" : "Create account →"}</button>
          <p className="auth-switch">Already have an account? <Link className="auth-link" to="/login">Sign in</Link></p>
        </form>
      </AuthShell>
    </>
  );
}
