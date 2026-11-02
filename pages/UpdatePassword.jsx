import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthBackend, AUTH_BACKENDS } from "../features/auth/authBackend";
import { getSupabaseSession, hasPasswordRecoveryIntent } from "../features/auth/supabaseAuthAdapter";
import { setNewPassword } from "../features/auth/authService";
import { getAuthErrorMessage } from "../features/auth/authMessages";
import { validatePassword } from "../features/auth/authValidation";
import { consumeClientCooldown } from "../features/auth/clientCooldown";
import SEO from "../componenets/seo/SEO";
import AuthShell from "../components/auth/AuthShell";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let active = true;
    async function checkRecoverySession() {
      if (getAuthBackend() !== AUTH_BACKENDS.SUPABASE) {
        if (active) {
          setNotice({ type: "error", text: "This recovery link cannot be completed here. Request a new password reset link." });
          setChecking(false);
        }
        return;
      }
      try {
        const session = await getSupabaseSession();
        if (!active) return;
        const validRecovery = Boolean(session?.user) && hasPasswordRecoveryIntent();
        setRecoveryReady(validRecovery);
        if (!validRecovery) setNotice({ type: "error", text: "This password recovery link is invalid or has expired. Request a new one." });
      } catch {
        if (active) setNotice({ type: "error", text: "We could not verify this recovery link. Request a new one." });
      } finally {
        if (active) setChecking(false);
      }
    }
    checkRecoverySession();
    return () => { active = false; };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setNotice(null);
    const passwordError = validatePassword(password);
    if (passwordError !== true) { setNotice({ type: "error", text: passwordError }); return; }
    if (password !== confirmPassword) { setNotice({ type: "error", text: "Passwords do not match." }); return; }
    const cooldown = consumeClientCooldown("update-password", 5000);
    if (!cooldown.allowed) { setNotice({ type: "error", text: "Please wait a few seconds before trying again." }); return; }
    setSubmitting(true);
    try {
      await setNewPassword(password);
      setRecoveryReady(false);
      setNotice({ type: "success", text: "Your password has been updated. You can now sign in with your new password." });
      setTimeout(() => navigate("/login", { replace: true, state: { reason: "password-updated" } }), 1200);
    } catch (error) {
      setNotice({ type: "error", text: getAuthErrorMessage(error, "reset") });
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <SEO title="Update password | Campus Lost Found" description="Securely update your Campus Lost Found password." url="https://campuslostfound.vercel.app/update-password" links={[{ rel: "canonical", href: "https://campuslostfound.vercel.app/update-password" }]} />
      <AuthShell
        eyebrow="Secure recovery"
        title="Choose a new password."
        subtitle="Use a strong password you don’t reuse elsewhere. Once updated, you’ll return to sign in."
        sideTitle={"A fresh password.\nSame campus network."}
      >
        {checking ? (
          <div className="auth-status-line" role="status"><span className="auth-spinner" /> Checking recovery link…</div>
        ) : (
          <form className="auth-form" onSubmit={submit} noValidate>
            <div className="auth-field">
              <label htmlFor="newPassword">New password</label>
              <input id="newPassword" className="auth-input" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={!recoveryReady || submitting} placeholder="Create a new password" />
              <span className="auth-help">Use 10+ characters with uppercase, lowercase and a number.</span>
            </div>

            <div className="auth-field">
              <label htmlFor="confirmNewPassword">Confirm new password</label>
              <input id="confirmNewPassword" className="auth-input" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} disabled={!recoveryReady || submitting} placeholder="Repeat your new password" />
            </div>

            {notice && <div className={`auth-notice auth-notice--${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>{notice.text}</div>}
            {recoveryReady && <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? "Updating password…" : "Update password →"}</button>}
            {!recoveryReady && <p className="auth-switch"><Link className="auth-link" to="/forgot-password">Request a new reset link</Link></p>}
          </form>
        )}
      </AuthShell>
    </>
  );
}
