import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../features/auth/authService";
import { AUTH_SUCCESS_MESSAGES, getAuthErrorMessage } from "../features/auth/authMessages";
import { assertCooldownReady, startCooldown } from "../features/auth/clientCooldown";

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
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="forgot-password-title">
        <p className="auth-eyebrow">Account recovery</p>
        <h1 id="forgot-password-title">Reset your password</h1>
        <p>Enter your university email. If an account exists, we'll send instructions to reset your password.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="reset-email">University email</label>
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@university.edu.pk"
            disabled={loading}
            required
          />

          {error && <div className="auth-message auth-message--error" role="alert">{error}</div>}
          {message && <div className="auth-message auth-message--success" role="status">{message}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="auth-footer"><Link to="/login">Back to sign in</Link></p>
      </section>
    </main>
  );
}

export default ForgotPassword;
