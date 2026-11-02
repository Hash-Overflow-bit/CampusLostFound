import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isValidDomain } from "../data/UniversityDomains";
import { useAuth } from "../AuthContext/AuthContext";
import { getSafeReturnPath } from "../app/routePolicy";
import { signIn } from "../features/auth/authService";
import { getAuthErrorMessage } from "../features/auth/authMessages";
import { assertCooldownReady, startCooldown } from "../features/auth/clientCooldown";
import SEO from "../componenets/seo/SEO";
import AuthShell from "../components/auth/AuthShell";

const Login = React.memo(() => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const { isAuthenticated, isEmailVerified } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const emailPattern = useMemo(() => /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/, []);
  const validateUniversityDomain = useCallback((email) => {
    const domain = email?.split("@")[1];
    return Boolean(domain && isValidDomain(domain));
  }, []);
  const getRedirectTarget = useCallback(() => getSafeReturnPath(location.state?.from?.pathname || location.state?.redirectTo, "/dashboard"), [location.state]);

  useEffect(() => {
    localStorage.removeItem("rememberedPassword");
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem("rememberedEmail");
    if (stateEmail) {
      setValue("email", stateEmail);
    } else if (storedEmail && localStorage.getItem("rememberMe") === "true") {
      setValue("email", storedEmail);
      setValue("rememberMe", true);
    }
    if (location.state?.reason === "verify") setFormMessage("Confirm your university email before accessing that page.");
    if (location.state?.reason === "password-updated") setFormMessage("Password updated. Sign in with your new password.");
    if (location.state?.reason === "confirmation-sent") setFormMessage("Email confirmed? Sign in below to enter your campus network.");
  }, [location.state, setValue]);

  useEffect(() => {
    if (isAuthenticated && isEmailVerified) navigate(getRedirectTarget(), { replace: true });
  }, [isAuthenticated, isEmailVerified, navigate, getRedirectTarget]);

  const onSubmit = useCallback(async (data) => {
    setFormError("");
    setFormMessage("");
    const email = data.email.trim().toLowerCase();
    if (!validateUniversityDomain(email)) {
      setFormError("Use your registered university email address.");
      return;
    }

    try {
      assertCooldownReady("login");
      setLoading(true);
      await signIn(email, data.password);
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberMe");
      }
      navigate(getRedirectTarget(), { replace: true });
    } catch (error) {
      if (error?.code === "auth/email-not-verified") {
        setFormError("Your email is not confirmed yet. Check your university inbox, then sign in again.");
      } else if (error?.code === "client-cooldown") {
        setFormError(error.message);
      } else {
        startCooldown("login", 3);
        setFormError(getAuthErrorMessage(error, "login"));
      }
    } finally {
      setLoading(false);
    }
  }, [getRedirectTarget, navigate, validateUniversityDomain]);

  return (
    <>
      <SEO title="Login to Campus Lost Found Pakistan" description="Sign in with your verified university account to access protected Campus Lost Found features." url="https://campuslostfound.vercel.app/login" type="website" siteName="Campus Lost Found Pakistan - Login" author="Campus Lost Found Team" links={[{ rel: "canonical", href: "https://campuslostfound.vercel.app/login" }]} customMeta={[{ name: "page-type", content: "authentication-login" }]} />
      <AuthShell
        eyebrow="Welcome back"
        title="Sign in to your campus."
        subtitle="Use your verified university account to see reports, matches and recovery activity from your campus."
      >
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-field">
            <label htmlFor="email">University email</label>
            <input id="email" type="email" autoComplete="email" className={`auth-input ${errors.email ? "is-error" : ""}`} placeholder="you@university.edu.pk" disabled={loading} {...register("email", { required: "Email address is required", pattern: { value: emailPattern, message: "Enter a valid email address" }, validate: value => validateUniversityDomain(value) || "Use your registered university email address." })} />
            {errors.email && <span className="auth-error" role="alert">{errors.email.message}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className="auth-password-wrap">
              <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" className={`auth-input ${errors.password ? "is-error" : ""}`} placeholder="Enter your password" disabled={loading} {...register("password", { required: "Password is required" })} />
              <button type="button" className="auth-password-toggle" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
            </div>
            {errors.password && <span className="auth-error" role="alert">{errors.password.message}</span>}
          </div>

          {formMessage && <div className="auth-notice auth-notice--info" role="status">{formMessage}</div>}
          {formError && <div className="auth-notice auth-notice--error" role="alert">{formError}</div>}

          <div className="auth-row">
            <label className="auth-check" htmlFor="rememberMe"><input type="checkbox" id="rememberMe" {...register("rememberMe")} /> Remember my email</label>
            <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>{loading ? "Signing in…" : "Sign in →"}</button>
          <p className="auth-switch">New here? <Link className="auth-link" to="/signup">Create an account</Link></p>
        </form>
      </AuthShell>
    </>
  );
});

Login.displayName = "Login";
export default Login;
