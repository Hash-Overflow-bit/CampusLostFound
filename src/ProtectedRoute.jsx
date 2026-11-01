import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext/AuthContext";
import MinimalLoader from "./componenets/loader/MinimalLoader";
import { ACCESS, canAccessRoute } from "./app/routePolicy";

const ProtectedRoute = ({ children, access = ACCESS.VERIFIED, allowedRoles = [] }) => {
  const { isAuthenticated, isEmailVerified, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <MinimalLoader fullScreen message="Checking your session..." />;

  if (canAccessRoute({ access, isAuthenticated, isEmailVerified, role, allowedRoles })) {
    return children;
  }

  if (access === ACCESS.GUEST_ONLY && isAuthenticated) {
    return <Navigate to={isEmailVerified ? "/dashboard" : "/login"} replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isEmailVerified) {
    return <Navigate to="/login" state={{ from: location, reason: "verify" }} replace />;
  }

  if (access === ACCESS.ROLE) {
    return <Navigate to="/dashboard" state={{ reason: "forbidden" }} replace />;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
