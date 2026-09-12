import React from "react";
import { ShieldCheck, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import GoogleSignInButton from "./GoogleSignInButton";
import Alert from "../../../components/Alert";
import Badge from "../../../components/ui/badge";

export const LoginForm = ({ onLogin, loading, error, onClearError }) => {
  return (
    <div className="login-card">
      <div className="login-header">
        <div className="login-badge-wrapper">
          <Badge variant="primary" className="mb-3">
            <ShieldCheck size={14} style={{ color: "#ea580c" }} />
            <span>Institutional SSO Portal</span>
          </Badge>
        </div>

        <div className="university-badge">
          <ShieldCheck size={32} strokeWidth={2.2} />
        </div>

        <h1 className="login-title">Sign In to UIU Portal</h1>

        <p className="login-description">
          Access the official United International University Lost & Found network to search
          logs, report items, and manage claim verifications.
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          title={
            error.code === "UNIVERSITY_ACCOUNT_REQUIRED"
              ? "UIU Account Required"
              : "Authentication Error"
          }
          message={error.message}
          onClose={onClearError}
        />
      )}

      <div className="login-body">
        <GoogleSignInButton onClick={onLogin} loading={loading} disabled={loading} />

        <div className="domain-info-card">
          <div className="domain-info-title">
            <CheckCircle2 size={16} style={{ color: "#ea580c" }} />
            <span>Supported Email Domains:</span>
          </div>
          <div className="domain-pills">
            <span className="domain-pill">@bscse.uiu.ac.bd</span>
            <span className="domain-pill">@uiu.ac.bd</span>
          </div>
          <p className="domain-hint-text">
            Log in using your official university Google account for Student, Faculty, or Staff access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
