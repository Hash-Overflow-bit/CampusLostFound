import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../features/auth/authService";
import { AUTH_SUCCESS_MESSAGES, getAuthErrorMessage } from "../features/auth/authMessages";
import { assertCooldownReady, startCooldown } from "../features/auth/clientCooldown";
import AuthShell from "../components/auth/AuthShell";
import SEO from "../componenets/seo/SEO";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Enter your university email address.");
      return;
    }

    try {
      assertCooldownReady("password-reset");
      setLoading(true);
      await requestPasswordReset(normalizedEmail);
      startCooldown("password-reset", 60);
      setMessage(AUTH_SUCCESS_MESSAGES.resetRequested);
    } catch (requestError) {
      if (requestError?.code === "client-cooldown") setError(requestError.message);
      else setError(getAuthErrorMessage(requestError, "reset"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Reset password | Campus Lost Found" description="Request a secure password reset for your Campus Lost Found account." url="https://campuslostfound.vercel.app/forgot-password" links={[{ rel: "canonical", href: "https://campuslostfound.vercel.app/forgot-password" }]} />
      <AuthShell
        eyebrow="Account recovery"
        title="Reset your password."
        subtitle="Enter your university email. If an account exists, we’ll send a secure reset link."
        sideTitle={"Lost your password?\nNot your account."}
        sideCopy="Recovery stays simple and private. We never reveal whether an email is registered."
      >
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="reset-email">University email</label>
            <input id="reset-email" className={`auth-input ${error ? "is-error" : ""}`} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@university.edu.pk" disabled={loading} required />
          </div>

          {error && <div className="auth-notice auth-notice--error" role="alert">{error}</div>}
          {message && <div className="auth-notice auth-notice--success" role="status">{message}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>{loading ? "Sending reset link…" : "Send reset link →"}</button>
          <p className="auth-switch"><Link className="auth-link" to="/login">← Back to sign in</Link></p>
        </form>
      </AuthShell>
    </>
  );
}

export default ForgotPassword;
