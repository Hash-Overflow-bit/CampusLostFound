import React from "react";
import { useAuth } from "../../AuthContext/AuthContext";
import { authValidationUtils } from "../../utils/authValidation";
import "./UserStatusIndicator.css";

const UserStatusIndicator = ({ showDetails = false }) => {
  const { user, isAuthenticated, isEmailVerified } = useAuth();

  if (!showDetails) return null;

  const userInfo = authValidationUtils.getUserValidationInfo(
    user,
    isAuthenticated,
    isEmailVerified
  );
  const validation = authValidationUtils.validateReportAccess(
    user,
    isAuthenticated,
    isEmailVerified
  );

  return (
    <div className="user-status-indicator">
      <div className="status-header">
        <h4>User Status Debug Panel</h4>
        <span
          className={`status-badge ${
            validation.canReport ? "verified" : "invalid"
          }`}
        >
          {validation.canReport ? "✓ Can Report" : "⚠ Cannot Report"}
        </span>
      </div>

      <div className="status-details">
        <div className="status-item">
          <strong>Authentication:</strong>
          <span className={isAuthenticated ? "valid" : "invalid"}>
            {isAuthenticated ? "✓ Signed In" : "✗ Not Signed In"}
          </span>
        </div>

        <div className="status-item">
          <strong>Email Verified:</strong>
          <span className={isEmailVerified ? "valid" : "invalid"}>
            {isEmailVerified ? "✓ Verified" : "✗ Not Verified"}
          </span>
        </div>

        <div className="status-item">
          <strong>University Email:</strong>
          <span className={userInfo.isValidDomain ? "valid" : "invalid"}>
            {userInfo.isValidDomain ? "✓ Valid Domain" : "✗ Invalid Domain"}
          </span>
        </div>

        <div className="status-item">
          <strong>Email:</strong>
          <span className="email">{userInfo.userEmail}</span>
        </div>

        <div className="status-item">
          <strong>Domain:</strong>
          <span className="domain">{userInfo.userDomain || "N/A"}</span>
        </div>

        {validation.errors.length > 0 && (
          <div className="status-errors">
            <strong>Issues:</strong>
            <ul>
              {validation.errors.map((error, index) => (
                <li key={index} className="error-item">
                  {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStatusIndicator;
