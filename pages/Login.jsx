import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Login.css";
import { isValidDomain } from "../data/UniversityDomains";
import { useAuth } from "../AuthContext/AuthContext";
import { getSafeReturnPath } from "../app/routePolicy";
import { signIn } from "../features/auth/authService";
import { getAuthErrorMessage } from "../features/auth/authMessages";
import { assertCooldownReady, startCooldown } from "../features/auth/clientCooldown";
import SEO from "../componenets/seo/SEO";

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
    const storedEmail = localStorage.getItem("rememberedEmail");
    if (storedEmail && localStorage.getItem("rememberMe") === "true") {
      setValue("email", storedEmail);
      setValue("rememberMe", true);
    }
    if (location.state?.reason === "verify") setFormMessage("Confirm your university email before accessing that page.");
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
      <SEO title="Login to Campus Lost Found Pakistan" description="Sign in with your verified university account to access protected Campus Lost Found features." url="https://campuslostfound.vercel.app/login" image="/src/assets/logo.png" type="website" siteName="Campus Lost Found Pakistan - Login" author="Campus Lost Found Team" links={[{ rel: "canonical", href: "https://campuslostfound.vercel.app/login" }]} customMeta={[{ name: "page-type", content: "authentication-login" }]} />
      <main className="login-main-container">
        <div className="login-wrapper">
          <div className="login-header"><h1 className="login-title">Welcome back</h1><p className="login-subtitle">Sign in securely with your university account</p></div>
          <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-group">
              <label htmlFor="email" className="form-label">University email</label>
              <input id="email" type="email" autoComplete="email" className={`form-control ${errors.email ? "error" : ""}`} placeholder="you@university.edu.pk" disabled={loading} {...register("email", { required: "Email address is required", pattern: { value: emailPattern, message: "Enter a valid email address" }, validate: value => validateUniversityDomain(value) || "Use your registered university email address." })} />
              {errors.email && <div className="error-message" role="alert">{errors.email.message}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-field">
                <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" className={`form-control ${errors.password ? "error" : ""}`} placeholder="Enter your password" disabled={loading} {...register("password", { required: "Password is required" })} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
              </div>
              {errors.password && <div className="error-message" role="alert">{errors.password.message}</div>}
            </div>
            {formMessage && <div className="auth-message auth-message--info" role="status">{formMessage}</div>}
            {formError && <div className="auth-message auth-message--error" role="alert">{formError}</div>}
            <div className="form-options">
              <div className="remember-me"><input type="checkbox" id="rememberMe" {...register("rememberMe")} /><label htmlFor="rememberMe">Remember my email</label></div>
              <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
            <div className="signup-link"><p>New here? <Link to="/signup">Create an account</Link></p></div>
          </form>
        </div>
      </main>
    </>
  );
});

Login.displayName = "Login";
export default Login;
