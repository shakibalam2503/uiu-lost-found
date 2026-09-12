import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, ArrowRight, UserCheck, Shield } from "lucide-react";
import useAuth from "../../auth/hooks/useAuth";

export const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="landing-navbar">
      <div className="navbar-inner">
        {/* Brand Logo - Far Left */}
        <Link to="/" className="nav-brand">
          <div className="brand-logo-icon">
            <Shield size={22} strokeWidth={2.5} />
          </div>
          <span className="brand-logo-text">
            <span className="text-orange">uiu</span> lost & found
          </span>
        </Link>

        {/* Navigation & Action Options - Far Right Pill Group */}
        <div className="nav-right-group">
          <nav className="nav-pill-list">
            <a href="#hero" className="nav-pill-item">
              Home
            </a>
            <a href="#problem" className="nav-pill-item">
              Campus Issues
            </a>
            <a href="#solution" className="nav-pill-item">
              Our System
            </a>
            <a href="#how-it-works" className="nav-pill-item">
              How It Works
            </a>
            <a href="#faq" className="nav-pill-item">
              FAQ
            </a>
          </nav>

          {isAuthenticated ? (
            <button
              type="button"
              className="nav-cta-pill nav-cta-primary"
              onClick={() => navigate("/dashboard")}
            >
              <UserCheck size={16} />
              <span>Dashboard</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              className="nav-cta-pill nav-cta-primary"
              onClick={() => navigate("/login")}
            >
              <LogIn size={16} />
              <span>Sign In with UIU Email</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
