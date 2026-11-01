export const ACCESS = Object.freeze({
  PUBLIC: "public",
  GUEST_ONLY: "guest-only",
  AUTHENTICATED: "authenticated",
  VERIFIED: "verified",
  CAMPUS: "campus",
  ROLE: "role",
});

export const ROLES = Object.freeze({
  STUDENT: "student",
  MODERATOR: "moderator",
  ADMIN: "admin",
});

const ROUTE_POLICY = Object.freeze({
  "/": { access: ACCESS.PUBLIC },
  "/about": { access: ACCESS.PUBLIC },
  "/how-it-works": { access: ACCESS.PUBLIC },
  "/blog": { access: ACCESS.PUBLIC },
  "/contact": { access: ACCESS.PUBLIC },
  "/universities": { access: ACCESS.PUBLIC },
  "/privacy-policy": { access: ACCESS.PUBLIC },
  "/terms-of-service": { access: ACCESS.PUBLIC },
  "/lost": { access: ACCESS.PUBLIC },
  "/found": { access: ACCESS.PUBLIC },
  "/login": { access: ACCESS.GUEST_ONLY },
  "/signup": { access: ACCESS.GUEST_ONLY },
  "/forgot-password": { access: ACCESS.GUEST_ONLY },
  // Recovery providers may establish a temporary session before the password is changed.
  "/update-password": { access: ACCESS.PUBLIC },
  // Campus workflows require a confirmed identity plus server-resolved campus membership.
  "/dashboard": { access: ACCESS.CAMPUS },
  "/report": { access: ACCESS.CAMPUS },
});

export const getRoutePolicy = (pathname) => {
  if (pathname.startsWith("/universities/")) return { access: ACCESS.PUBLIC };
  return ROUTE_POLICY[pathname] ?? { access: ACCESS.PUBLIC };
};

export const getRouteAccess = (pathname) => getRoutePolicy(pathname).access;

export const canAccessRoute = ({ access, isAuthenticated, isEmailVerified, hasTrustedCampus, role, allowedRoles = [] }) => {
  switch (access) {
    case ACCESS.GUEST_ONLY:
      return !isAuthenticated;
    case ACCESS.AUTHENTICATED:
      return isAuthenticated;
    case ACCESS.VERIFIED:
      return isAuthenticated && isEmailVerified;
    case ACCESS.CAMPUS:
      return isAuthenticated && isEmailVerified && hasTrustedCampus;
    case ACCESS.ROLE:
      return isAuthenticated && isEmailVerified && hasTrustedCampus && allowedRoles.includes(role);
    case ACCESS.PUBLIC:
    default:
      return true;
  }
};

export const getSafeReturnPath = (candidate, fallback = "/dashboard") => {
  if (typeof candidate !== "string") return fallback;
  if (!candidate.startsWith("/") || candidate.startsWith("//")) return fallback;
  return candidate;
};
