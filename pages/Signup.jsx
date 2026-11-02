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
import "./Signup.css";

export default function Signup() {
  const { isAuthenticated, isEmailVerified } = useAuth();
  const [campuses, setCampuses] = useState([]);
  const [campusLoading, setCampusLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [notice, setNotice] = useState(null);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: "onBlur" });
  const universityId = watch("university");
  const universityLookup = useMemo(() => Object.fromEntries(basicUniversities.map((item) => [String(item.id), item])), []);

  useEffect(() => {
    let active = true;
    if (!universityId) { setCampuses([]); return undefined; }
    setCampusLoading(true);
    getCampusesForUniversity(universityId)
      .then((items) => {
        if (!active) return;
        const university = universityLookup[String(universityId)];
        setCampuses(items?.length ? items : university ? [{ id: "main", name: "Main Campus" }] : []);
      })
      .catch(() => active && setCampuses([]))
      .finally(() => active && setCampusLoading(false));
    return () => { active = false; };
  }, [universityId, universityLookup]);

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

  if (confirmationEmail) return (
    <main className="signup-main-container">
      <section className="signup-wrapper auth-confirmation" aria-live="polite">
        <div className="signup-header"><h1 className="signup-title">Check your university email</h1><p className="signup-subtitle">We sent a confirmation link to <strong>{confirmationEmail}</strong>.</p></div>
        {notice && <div className={notice.type === "success" ? "success-message" : "error-message"} role={notice.type === "error" ? "alert" : "status"}>{notice.text}</div>}
        <p>Open the email, confirm your address, then sign in. Check spam or junk if it does not arrive shortly.</p>
        <Link className="login-btn" to="/login" state={{ email: confirmationEmail, reason: "confirmation-sent" }}>Continue to sign in</Link>
        <button className="signup-btn" type="button" onClick={handleResend} disabled={resending}>{resending ? "Sending…" : "Resend confirmation email"}</button>
      </section>
    </main>
  );

  return <><SEO title="Create your Campus Lost Found account" description="Join Campus Lost Found with a verified university email." url="https://campuslostfound.vercel.app/signup" links={[{ rel: "canonical", href: "https://campuslostfound.vercel.app/signup" }]} /><main className="signup-main-container"><div className="signup-wrapper"><div className="signup-header"><h1 className="signup-title">Create your account</h1><p className="signup-subtitle">Use your university email so the campus community stays trusted.</p></div><form className="signup-form" onSubmit={handleSubmit(onSubmit)} noValidate>
    <div className="form-group"><label className="form-label" htmlFor="fullName">Full name</label><input id="fullName" autoComplete="name" className={`form-control ${errors.fullName ? "error" : ""}`} {...register("fullName", { validate: validateFullName })} />{errors.fullName && <div className="error-message" role="alert">{errors.fullName.message}</div>}</div>
    <div className="form-group"><label className="form-label" htmlFor="university">University</label><select id="university" className={`form-control ${errors.university ? "error" : ""}`} {...register("university", { required: "Select your university." })}><option value="">Choose your university</option>{basicUniversities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>{errors.university && <div className="error-message" role="alert">{errors.university.message}</div>}</div>
    <div className="form-group"><label className="form-label" htmlFor="campus">Campus</label><select id="campus" disabled={!universityId || campusLoading} className={`form-control ${errors.campus ? "error" : ""}`} {...register("campus", { required: "Select your campus." })}><option value="">{campusLoading ? "Loading campuses…" : "Choose your campus"}</option>{campuses.map((item) => <option key={item.id ?? item.campusId} value={item.id ?? item.campusId}>{item.name}</option>)}</select>{errors.campus && <div className="error-message" role="alert">{errors.campus.message}</div>}</div>
    <div className="form-group"><label className="form-label" htmlFor="email">University email</label><input id="email" type="email" autoComplete="email" className={`form-control ${errors.email ? "error" : ""}`} {...register("email", { validate: (value) => validateUniversityEmailForSelection(value, universityId) })} />{errors.email && <div className="error-message" role="alert">{errors.email.message}</div>}</div>
    <div className="form-group"><label className="form-label" htmlFor="password">Password</label><input id="password" type="password" autoComplete="new-password" className={`form-control ${errors.password ? "error" : ""}`} {...register("password", { validate: validatePassword })} /><small>Use 10+ characters with uppercase, lowercase and a number.</small>{errors.password && <div className="error-message" role="alert">{errors.password.message}</div>}</div>
    <div className="form-group"><label className="form-label" htmlFor="confirmPassword">Confirm password</label><input id="confirmPassword" type="password" autoComplete="new-password" className={`form-control ${errors.confirmPassword ? "error" : ""}`} {...register("confirmPassword", { validate: (value, values) => value === values.password || "Passwords do not match." })} />{errors.confirmPassword && <div className="error-message" role="alert">{errors.confirmPassword.message}</div>}</div>
    {notice && <div className={notice.type === "success" ? "success-message" : "error-message"} role={notice.type === "error" ? "alert" : "status"}>{notice.text}</div>}<button className="signup-btn" type="submit" disabled={submitting}>{submitting ? "Creating account…" : "Create account"}</button><p className="login-link">Already have an account? <Link to="/login">Sign in</Link></p>
  </form></div></main></>;
}
