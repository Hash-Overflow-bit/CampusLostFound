import { isValidDomain } from "../data/UniversityDomains";

// Enhanced authentication and university validation utilities
export const authValidationUtils = {
  // Check if user is logged in and has valid authentication
  isUserAuthenticated: (user, isAuthenticated) => {
    return isAuthenticated && user && user.uid;
  },

  // Check if user's email is verified
  isEmailVerified: (user) => {
    return user && user.emailVerified === true;
  },

  // Check if user's email domain matches a valid university domain
  isValidUniversityEmail: (userEmail) => {
    if (!userEmail || typeof userEmail !== "string") {
      return false;
    }

    const emailParts = userEmail.split("@");
    if (emailParts.length !== 2) {
      return false;
    }

    const emailDomain = emailParts[1];
    return isValidDomain(emailDomain);
  },

  // Get the university domain from user's email
  getUserUniversityDomain: (userEmail) => {
    if (!userEmail || typeof userEmail !== "string") {
      return null;
    }

    const emailParts = userEmail.split("@");
    if (emailParts.length !== 2) {
      return null;
    }

    return emailParts[1];
  },

  // Comprehensive validation for report access
  validateReportAccess: (user, isAuthenticated, isEmailVerified) => {
    const validation = {
      canReport: false,
      errors: [],
      warnings: [],
    };

    // Check authentication
    if (!authValidationUtils.isUserAuthenticated(user, isAuthenticated)) {
      validation.errors.push({
        type: "authentication",
        message: "Please sign in to report an item",
        action: "redirect_login",
      });
      return validation;
    }

    // Check email verification
    if (!isEmailVerified || !authValidationUtils.isEmailVerified(user)) {
      validation.errors.push({
        type: "email_verification",
        message:
          "Please verify your email address before reporting items. Check your inbox for the verification link.",
        action: "show_alert",
      });
      return validation;
    }

    // Check university email domain
    if (!authValidationUtils.isValidUniversityEmail(user.email)) {
      validation.errors.push({
        type: "university_domain",
        message:
          "Your email domain doesn't match any registered university. Please contact support or use a valid university email.",
        action: "show_alert",
      });
      return validation;
    }

    // All validations passed
    validation.canReport = true;
    return validation;
  },

  // Get user-friendly error messages
  getErrorMessage: (errorType) => {
    const messages = {
      authentication:
        "Please sign in to your university account to report items.",
      email_verification:
        "Please verify your email address first. Check your inbox for the verification link.",
      university_domain:
        "Only verified university students can report items. Please use your official university email address.",
      unknown:
        "Unable to validate access. Please try again or contact support.",
    };

    return messages[errorType] || messages.unknown;
  },

  // Get detailed user info for debugging
  getUserValidationInfo: (user, isAuthenticated, isEmailVerified) => {
    return {
      isAuthenticated,
      isEmailVerified,
      userEmail: user?.email || "Not available",
      userDomain: authValidationUtils.getUserUniversityDomain(user?.email),
      isValidDomain: authValidationUtils.isValidUniversityEmail(user?.email),
      userId: user?.uid || "Not available",
      emailVerifiedStatus: user?.emailVerified || false,
    };
  },
};

export default authValidationUtils;
