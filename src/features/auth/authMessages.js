const GENERIC_LOGIN_ERROR = "We couldn't sign you in with those credentials. Check your email and password and try again.";

export function getAuthErrorMessage(error, action = "login") {
  const code = String(error?.code || error?.name || "").toLowerCase();
  const message = String(error?.message || "").toLowerCase();

  if (code.includes("too-many-requests") || code.includes("over_request_rate_limit") || message.includes("rate limit")) {
    return "Too many attempts. Please wait a few minutes before trying again.";
  }

  if (action === "login") {
    if (code.includes("network") || message.includes("network")) return "We couldn't reach the authentication service. Check your connection and try again.";
    return GENERIC_LOGIN_ERROR;
  }

  if (action === "signup") {
    if (code.includes("email-already") || message.includes("already registered") || message.includes("already exists")) {
      return "An account may already exist for this email. Try signing in or resetting your password.";
    }
    if (code.includes("weak-password") || message.includes("password")) return "Choose a stronger password and try again.";
    if (code.includes("invalid-email")) return "Enter a valid university email address.";
    return "We couldn't create your account right now. Please try again shortly.";
  }

  if (action === "reset") {
    if (code.includes("too-many-requests") || message.includes("rate limit")) return "Too many reset requests. Please wait before trying again.";
    return "We couldn't process that request right now. Please try again shortly.";
  }

  return "Something went wrong. Please try again.";
}

export const AUTH_SUCCESS_MESSAGES = Object.freeze({
  resetRequested: "If an account exists for that email, a password reset link has been sent.",
  confirmationSent: "Account created. Check your university inbox and confirm your email to continue.",
  confirmationResent: "A new confirmation email has been sent. Please check your inbox.",
});
