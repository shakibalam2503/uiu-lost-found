import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  LogOut,
  User,
  RefreshCw,
  Search,
  Package,
  ClipboardList,
  CheckCircle2,
  Archive,
  LayoutGrid,
  ShieldCheck,
  Building,
} from "lucide-react";

import useAuth from "../../auth/hooks/useAuth";
import useStaffDashboard from "../hooks/useStaffDashboard";
import StaffStatCard from "../components/StaffStatCard";
import StaffQuickActions from "../components/StaffQuickActions";
import PendingClaimsSection from "../components/PendingClaimsSection";
import RecentFoundSection from "../components/RecentFoundSection";
import RecentLostSection from "../components/RecentLostSection";
import RecentRecoveredSection from "../components/RecentRecoveredSection";
import Button from "../../../components/ui/button";

export const StaffDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    stats,
    pendingClaims,
    recentFoundItems,
    recentLostItems,
    recentRecoveries,
    loading,
    error,
    refetch,
  } = useStaffDashboard();

  useEffect(() => {
    document.title = "Staff Console - UIU Lost & Found";
  }, []);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "badge-admin";
      case "staff":
      default:
        return "badge-staff";
    }
  };

  return (
    <div className="dashboard-layout bg-grid-pattern">
      {/* Top Navbar */}
      <header className="dashboard-navbar staff-nav-border">
        <div className="dashboard-nav-inner">
          <div
            className="nav-brand"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <div className="brand-logo-icon staff-brand-icon">
              <Shield size={22} strokeWidth={2.5} />
            </div>
            <span className="brand-logo-text">
              <span className="text-orange">uiu</span> staff operations
            </span>
          </div>

          <div className="dashboard-user-bar">
            <button
              type="button"
              className="btn-switch-feed"
              onClick={() => navigate("/dashboard")}
              title="Switch to Public Feed"
            >
              <LayoutGrid size={15} />
              <span>Public Feed</span>
            </button>

            <div className="user-profile-summary">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name || "Staff Member"}
                  className="user-avatar"
                />
              ) : (
                <div className="user-avatar-fallback staff-avatar-bg">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                </div>
              )}
              <div className="user-details">
                <span className="user-name">{user?.name || user?.email}</span>
                <span className={`role-badge ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role ? user.role.toUpperCase() : "STAFF"}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-logout"
              onClick={logout}
              title="Sign Out"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome & Console Header */}
          <div className="staff-header-banner">
            <div className="staff-banner-content">
              <div className="staff-banner-badge">
                <ShieldCheck size={14} />
                <span>Authorized Administrative Access</span>
              </div>
              <h1 className="staff-banner-title">
                Campus Security & Desk Operations Console
              </h1>
              <p className="staff-banner-sub">
                Manage item inventory, review ownership claims, record physical handovers, and monitor live campus retrieval metrics.
              </p>
            </div>
            <div className="staff-banner-actions">
              <Button
                variant="outline"
                size="md"
                onClick={refetch}
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? "spin-icon" : ""} />
                <span>Refresh Operations Data</span>
              </Button>
            </div>
          </div>

          {error && (
            <div className="error-banner">
              <p>{error}</p>
              <Button variant="outline" size="sm" onClick={refetch}>
                Try Again
              </Button>
            </div>
          )}

          {/* Operational Statistics Grid */}
          <div className="staff-stats-grid">
            <StaffStatCard
              title="Total Lost Items"
              value={stats.totalLostItems}
              icon={Search}
              color="orange"
              subtitle="Logged by campus community"
            />
            <StaffStatCard
              title="Total Found Items"
              value={stats.totalFoundItems}
              icon={Package}
              color="green"
              subtitle="Surrendered to security / desk"
            />
            <StaffStatCard
              title="Pending Claims"
              value={stats.pendingClaims}
              icon={ClipboardList}
              color="amber"
              subtitle="Awaiting staff review"
            />
            <StaffStatCard
              title="Approved Claims"
              value={stats.approvedClaims}
              icon={CheckCircle2}
              color="blue"
              subtitle="Verified & ready for pickup"
            />
            <StaffStatCard
              title="Recovered Items"
              value={stats.recoveredItems}
              icon={Archive}
              color="purple"
              subtitle="Handover completed to owner"
            />
          </div>

          {/* Quick Actions Panel */}
          <StaffQuickActions />

          {/* Operational Sections */}
          <div className="staff-sections-stack">
            {/* Section 1: Pending Claims */}
            <PendingClaimsSection claims={pendingClaims} />

            {/* Section 2: Recently Registered Found Items */}
            <RecentFoundSection items={recentFoundItems} />

            {/* Section 3: Recently Reported Lost Items */}
            <RecentLostSection items={recentLostItems} />

            {/* Section 4: Recently Recovered Items */}
            <RecentRecoveredSection recoveries={recentRecoveries} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboardPage;
