import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext/AuthContext";
import MinimalLoader from "./componenets/loader/MinimalLoader";
import { ACCESS, canAccessRoute } from "./app/routePolicy";

const ProtectedRoute = ({ children, access = ACCESS.CAMPUS, allowedRoles = [] }) => {
  const { isAuthenticated, isEmailVerified, hasTrustedCampus, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <MinimalLoader fullScreen message="Checking your session..." />;

  if (canAccessRoute({ access, isAuthenticated, isEmailVerified, hasTrustedCampus, role, allowedRoles })) {
    return children;
  }

  if (access === ACCESS.GUEST_ONLY && isAuthenticated) {
    // Verified campus members go to their dashboard. Verified users whose campus has not been
    // resolved stay outside campus workflows until trusted onboarding succeeds.
    return <Navigate to={isEmailVerified && hasTrustedCampus ? "/dashboard" : "/"} replace state={{ reason: isEmailVerified ? "campus-required" : "verify" }} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isEmailVerified) {
    return <Navigate to="/login" state={{ from: location, reason: "verify" }} replace />;
  }

  if ((access === ACCESS.CAMPUS || access === ACCESS.ROLE) && !hasTrustedCampus) {
    return <Navigate to="/" replace state={{ from: location, reason: "campus-required" }} />;
  }

  if (access === ACCESS.ROLE) {
    return <Navigate to="/dashboard" state={{ reason: "forbidden" }} replace />;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
