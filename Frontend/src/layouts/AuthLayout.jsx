import React from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

export const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout bg-grid-pattern">
      {/* Background radial orange glow */}
      <div className="auth-bg-overlay">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
      </div>

      {/* Top Navbar Header */}
      <header className="auth-nav-header">
        <Link to="/" className="nav-brand">
          <div className="brand-logo-icon">
            <Shield size={22} strokeWidth={2.5} />
          </div>
          <span className="brand-logo-text">
            <span className="text-orange">uiu</span> lost & found
          </span>
        </Link>

        <Link to="/" className="nav-pill-item" style={{ gap: "0.5rem" }}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </header>
      
      <main className="auth-content-container">
        {children}
      </main>

      <footer className="auth-footer">
        <p>© {new Date().getFullYear()} United International University Lost & Found Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
