export const ACCESS = Object.freeze({
  PUBLIC: "public",
  GUEST_ONLY: "guest-only",
  AUTHENTICATED: "authenticated",
  VERIFIED: "verified",
});

const ROUTE_POLICY = Object.freeze({
  "/": ACCESS.PUBLIC,
  "/about": ACCESS.PUBLIC,
  "/how-it-works": ACCESS.PUBLIC,
  "/blog": ACCESS.PUBLIC,
  "/contact": ACCESS.PUBLIC,
  "/universities": ACCESS.PUBLIC,
  "/privacy-policy": ACCESS.PUBLIC,
  "/terms-of-service": ACCESS.PUBLIC,
  "/lost": ACCESS.PUBLIC,
  "/found": ACCESS.PUBLIC,
  "/login": ACCESS.GUEST_ONLY,
  "/signup": ACCESS.GUEST_ONLY,
  "/forgot-password": ACCESS.GUEST_ONLY,
  "/dashboard": ACCESS.VERIFIED,
  "/report": ACCESS.VERIFIED,
});

export const getRouteAccess = (pathname) => {
  if (pathname.startsWith("/universities/")) return ACCESS.PUBLIC;
  return ROUTE_POLICY[pathname] ?? ACCESS.PUBLIC;
};

export const canAccessRoute = ({ access, isAuthenticated, isEmailVerified }) => {
  switch (access) {
    case ACCESS.GUEST_ONLY:
      return !isAuthenticated;
    case ACCESS.AUTHENTICATED:
      return isAuthenticated;
    case ACCESS.VERIFIED:
      return isAuthenticated && isEmailVerified;
    case ACCESS.PUBLIC:
    default:
      return true;
  }
};

// Only internal absolute paths may be used as post-login destinations.
export const getSafeReturnPath = (candidate, fallback = "/dashboard") => {
  if (typeof candidate !== "string") return fallback;
  if (!candidate.startsWith("/") || candidate.startsWith("//")) return fallback;
  return candidate;
};
