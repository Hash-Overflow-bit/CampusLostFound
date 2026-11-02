import React, { useState } from "react";
import ReportItemForm from "../componenets/reportForm/ReportItemForm";
import UserStatusIndicator from "../componenets/userStatus/UserStatusIndicator";
import { useAuth } from "../AuthContext/AuthContext";
import { authValidationUtils } from "../utils/authValidation";

const ReportDemo = () => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [showStatusPanel, setShowStatusPanel] = useState(true);
  const { user, isAuthenticated, isEmailVerified } = useAuth();

  const handleReportSubmit = () => {
    setShowReportForm(false);
    // Alert is now handled within ReportItemForm component
  };

  const handleReportClose = () => {
    setShowReportForm(false);
  };

  const handleValidatedReportClick = () => {
    const validation = authValidationUtils.validateReportAccess(
      user,
      isAuthenticated,
      isEmailVerified
    );

    if (!validation.canReport) {
      // Validation errors are now handled within ReportItemForm component
      return;
    }

    setShowReportForm(true);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <UserStatusIndicator showDetails={showStatusPanel} />

      <h1>Campus Lost & Found - Report Demo</h1>
      <p>Test the authentication and university validation system</p>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setShowStatusPanel(!showStatusPanel)}
          style={{
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {showStatusPanel ? "Hide" : "Show"} Status Panel
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setShowReportForm(true)}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Report Item (No Validation)
        </button>

        <button
          onClick={handleValidatedReportClick}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Report Item (With Validation)
        </button>
      </div>

      {showReportForm && (
        <ReportItemForm
          onClose={handleReportClose}
          onSubmit={handleReportSubmit}
        />
      )}

      <div
        style={{
          marginTop: "40px",
          textAlign: "left",
          maxWidth: "800px",
          margin: "40px auto",
        }}
      >
        <h2>How to Use the Report Form:</h2>
        <ol>
          <li>
            <strong>Select Role:</strong> Choose "Lost an Item" or "Found an
            Item"
          </li>
          <li>
            <strong>Item Details:</strong> Fill in title, description, category,
            location, and date
          </li>
          <li>
            <strong>Image Upload:</strong>
            <ul>
              <li>Required for found items (helps prove authenticity)</li>
              <li>Optional for lost items</li>
              <li>Supports file upload or camera capture</li>
            </ul>
          </li>
          <li>
            <strong>Contact Info:</strong> Your email from Firebase Auth
            (editable)
          </li>
          <li>
            <strong>Submit:</strong> Data gets saved to Firestore with proper
            schema
          </li>
        </ol>

        <h2>Features Implemented:</h2>
        <ul>
          <li>✅ Role-based form (Lost vs Found)</li>
          <li>✅ Required field validation</li>
          <li>✅ Image upload to Firebase Storage</li>
          <li>✅ Camera capture option (back camera on mobile)</li>
          <li>✅ Firestore integration with proper schema</li>
          <li>✅ Firebase Auth integration</li>
          <li>✅ Responsive design</li>
          <li>✅ Loading states and error handling</li>
        </ul>

        <h2>Firestore Schema:</h2>
        <pre
          style={{
            backgroundColor: "#f5f5f5",
            padding: "15px",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          {`items (collection)
  itemId (auto-generated doc)
    userId: "firebase_user_uid"
    role: "lost" | "found"
    title: "Item name"
    description: "Detailed description"
    category: "ID Card" | "Wallet" | etc.
    location: "Where lost/found"
    date: "YYYY-MM-DD"
    contact: "user@email.com"
    imageUrl: "firebase_storage_url" | null
    createdAt: firestore_timestamp
    status: "active" | "matched" | "resolved"`}
        </pre>
      </div>
    </div>
  );
};

export default ReportDemo;
