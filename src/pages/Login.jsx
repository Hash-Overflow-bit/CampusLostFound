/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Login.css";
import { auth } from "../firebaseConfig/firebaseCore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { isValidDomain } from "../data/UniversityDomains";
import { useAuth } from "../AuthContext/AuthContext";
import { getSafeReturnPath } from "../app/routePolicy";
import SEO from "../componenets/seo/SEO";

const Login = React.memo(() => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const { isAuthenticated, isEmailVerified } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const validationPatterns = useMemo(
    () => ({
      email:
        /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/,
    }),
    []
  );

  const validateUniversityDomain = useCallback((email) => {
    if (!email) return true;
    const emailDomain = email.split("@")[1];
    return Boolean(emailDomain && isValidDomain(emailDomain));
  }, []);

  const getRedirectTarget = useCallback(() => {
    const candidate = location.state?.from?.pathname || location.state?.redirectTo;
    return getSafeReturnPath(candidate, "/dashboard");
  }, [location.state]);

  const loginUser = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        if (!validateUniversityDomain(email)) {
          throw new Error(
            "Please use your university email address. Only registered university domains are allowed."
          );
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          throw new Error(
            "Please verify your email before logging in. Check your inbox for the verification link."
          );
        }

        navigate(getRedirectTarget(), { replace: true });
      } finally {
        setLoading(false);
      }
    },
    [getRedirectTarget, navigate, validateUniversityDomain]
  );

  useEffect(() => {
    // Legacy versions stored plaintext passwords in localStorage. Delete them and never restore them.
    localStorage.removeItem("rememberedPassword");
    const storedEmail = localStorage.getItem("rememberedEmail");
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    if (storedEmail && rememberMe) {
      setValue("email", storedEmail);
      setValue("rememberMe", true);
    }
  }, [setValue]);

  useEffect(() => {
    if (isAuthenticated && isEmailVerified) {
      navigate(getRedirectTarget(), { replace: true });
    }
  }, [isAuthenticated, isEmailVerified, navigate, getRedirectTarget]);

  const onSubmit = useCallback(
    async (data) => {
      setFormError("");
      try {
        await loginUser(data.email, data.password);
        localStorage.removeItem("rememberedPassword");
        if (data.rememberMe) {
          localStorage.setItem("rememberedEmail", data.email);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberMe");
        }
      } catch (error) {
        setFormError(error.message || "Unable to sign in. Please try again.");
      }
    },
    [loginUser]
  );

  return (
    <>
      <SEO
        title="Login to Campus Lost Found Pakistan"
        description="Sign in with your verified university account to access protected Campus Lost Found features."
        url="https://campuslostfound.vercel.app/login"
        image="/src/assets/logo.png"
        type="website"
        siteName="Campus Lost Found Pakistan - Login"
        author="Campus Lost Found Team"
        links={[{ rel: "canonical", href: "https://campuslostfound.vercel.app/login" }]}
        customMeta={[{ name: "page-type", content: "authentication-login" }]}
      />
      <main className="login-main-container">
        <div className="login-wrapper">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your Campus Lost Found account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-group">
              <label htmlFor="email" className="form-label">University Email Address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`form-control ${errors.email ? "error" : ""}`}
                placeholder="Enter your university email"
                {...register("email", {
                  required: "Email address is required",
                  pattern: { value: validationPatterns.email, message: "Please enter a valid email address" },
                  validate: (value) =>
                    validateUniversityDomain(value) ||
                    "Please use your university email address. Only registered university domains are allowed.",
                })}
              />
              {errors.email && <div className="error-message">⚠️ {errors.email.message}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`form-control ${errors.password ? "error" : ""}`}
                  placeholder="Enter your password"
                  style={{ paddingRight: "42px" }}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters long" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", border: 0, background: "transparent", cursor: "pointer" }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <div className="error-message">⚠️ {errors.password.message}</div>}
            </div>

            {formError && <div className="error-message" role="alert">⚠️ {formError}</div>}

            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="rememberMe" {...register("rememberMe")} />
                <label htmlFor="rememberMe">Remember my email</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <div className="signup-link">
              <p>Don't have an account? <Link to="/signup">Create Account</Link></p>
            </div>
          </form>
        </div>
      </main>
    </>
  );
});

Login.displayName = "Login";
export default Login;
