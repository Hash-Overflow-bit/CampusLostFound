import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext/AuthContext";
import MinimalLoader from "./componenets/loader/MinimalLoader";
import { ACCESS, canAccessRoute } from "./app/routePolicy";

const ProtectedRoute = ({ children, access = ACCESS.VERIFIED }) => {
  const { isAuthenticated, isEmailVerified, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <MinimalLoader fullScreen message="Checking your session..." />;
  }

  if (
    canAccessRoute({ access, isAuthenticated, isEmailVerified })
  ) {
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (access === ACCESS.VERIFIED && !isEmailVerified) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, reason: "verify" }}
        replace
      />
    );
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
