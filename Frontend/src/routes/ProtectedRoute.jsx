import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../features/auth/hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="full-screen-loader">
        <LoadingSpinner size="large" text="Verifying authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login while preserving target location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization if specific roles are required
  if (allowedRoles.length > 0 && (!user?.role || !allowedRoles.includes(user.role))) {
    return (
      <div className="unauthorized-container" style={{ padding: "40px 20px", maxWidth: "600px", margin: "40px auto" }}>
        <Alert
          type="warning"
          title="Access Restricted"
          message={`Your role (${user?.role || "Unknown"}) does not have permission to access this page.`}
        />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
