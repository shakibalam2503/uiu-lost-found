import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  PlusCircle,
  LogOut,
  User,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  X,
  MapPin,
  Clock,
  Mail,
  ShieldCheck,
  Building,
  Tag,
  Palette,
  Layers,
  FileText,
  LayoutDashboard,
} from "lucide-react";

import useAuth from "../../auth/hooks/useAuth";
import { DashboardProvider } from "../dashboard.context";
import { useDashboardItems } from "../hooks/useDashboardItems";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import ItemGrid from "../components/ItemGrid";
import StatusBadge from "../components/StatusBadge";
import Button from "../../../components/ui/button";
import Badge from "../../../components/ui/badge";
import ClaimItemModal from "../../item-details/components/ClaimItemModal";

const DashboardContent = ({ selectedItem, setSelectedItem }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { items, rawLostCount, rawFoundCount } = useDashboardItems();
  const [claimingItem, setClaimingItem] = useState(null);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "badge-admin";
      case "faculty":
        return "badge-faculty";
      case "staff":
        return "badge-staff";
      case "student":
      default:
        return "badge-student";
    }
  };

  const handleReportLost = () => {
    navigate("/lost-items/report");
  };

  const handleReportFound = () => {
    if (user?.role === "staff" || user?.role === "admin") {
      navigate("/found-items/register");
    } else {
      navigate("/found-items");
    }
  };

  return (
    <div className="dashboard-layout bg-grid-pattern">
      {/* Top Navbar */}
      <header className="dashboard-navbar">
        <div className="dashboard-nav-inner">
          <div className="nav-brand" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <div className="brand-logo-icon">
              <Shield size={22} strokeWidth={2.5} />
            </div>
            <span className="brand-logo-text">
              <span className="text-orange">uiu</span> lost & found
            </span>
          </div>

          <div className="dashboard-user-bar">

            <div className="user-profile-summary">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name || "User"}
                  className="user-avatar"
                />
              ) : (
                <div className="user-avatar-fallback">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                </div>
              )}
              <div className="user-details">
                <span className="user-name">{user?.name || user?.email}</span>
                <span className={`role-badge ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role ? user.role.toUpperCase() : "STUDENT"}
                </span>
              </div>
            </div>

            {/* My Portal shortcut — students & faculty only */}
            {user?.role !== "staff" && user?.role !== "admin" && (
              <button
                type="button"
                className="btn-portal-nav"
                onClick={() => navigate("/student/portal")}
                title="My Portal"
              >
                <LayoutDashboard size={15} />
                <span>My Portal</span>
              </button>
            )}

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
          {/* Welcome Banner */}
          <div className="welcome-banner-card">
            <div className="welcome-banner-content">
              <div className="welcome-badge-row">
                <Badge variant="primary">
                  <CheckCircle2 size={13} style={{ color: "#ea580c" }} />
                  <span>Verified UIU Account</span>
                </Badge>
                <span className={`role-badge ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role ? user.role.toUpperCase() : "STUDENT"}
                </span>
              </div>

              <h1 className="welcome-title">
                Welcome back, {user?.name ? user.name.split(" ")[0] : "Student"}! 👋
              </h1>

              <p className="welcome-subtitle">
                Browse official lost and found item reports across United International University campus.
                Filter by location, category, or date to reconnect with lost belongings.
              </p>
            </div>

            <div className="welcome-actions-row">
              {user?.role !== "staff" && user?.role !== "admin" && (
                <Button variant="gradient" size="md" onClick={handleReportLost}>
                  <PlusCircle size={18} />
                  <span>Report Lost Item</span>
                </Button>
              )}
              {(user?.role === "staff" || user?.role === "admin") && (
                <>
                  <Button variant="gradient" size="md" onClick={() => navigate("/staff/dashboard")}>
                    <Shield size={18} />
                    <span>Staff Dashboard</span>
                  </Button>
                  <Button variant="outline" size="md" onClick={handleReportFound}>
                    <PlusCircle size={18} />
                    <span>Report Found Item</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="dashboard-stats-strip">
            <div className="strip-stat-item">
              <span className="strip-stat-num text-gradient-orange">{items.length}</span>
              <span className="strip-stat-label">Active Feed Items</span>
            </div>
            <div className="strip-stat-item">
              <span className="strip-stat-num">{rawLostCount}</span>
              <span className="strip-stat-label">Lost Reports</span>
            </div>
            <div className="strip-stat-item">
              <span className="strip-stat-num" style={{ color: "#10b981" }}>{rawFoundCount}</span>
              <span className="strip-stat-label">Found Entries</span>
            </div>
            <div className="strip-stat-item desk-status-item">
              <div className="status-pill">
                <span className="status-dot" />
                <span>Library & Security Desks Active</span>
              </div>
            </div>
          </div>

          {/* Feed Controls */}
          <div className="feed-controls-section">
            <SearchBar />
            <FilterBar />
          </div>

          {/* Feed Grid */}
          <ItemGrid
            onItemClick={(item) => setSelectedItem(item)}
            onReportClick={handleReportLost}
          />
        </div>
      </main>

      {/* Item Detail Modal Overlay */}
      {selectedItem && (
        <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title-group">
                <StatusBadge type={selectedItem.type} status={selectedItem.status} />
                <h3 className="modal-item-title">{selectedItem.title}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedItem(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Media Image */}
              {selectedItem.imageUrls && selectedItem.imageUrls.length > 0 && selectedItem.imageUrls[0] ? (
                <div className="modal-media-wrapper">
                  <img
                    src={selectedItem.imageUrls[0]}
                    alt={selectedItem.title}
                    className="modal-media-img"
                  />
                </div>
              ) : null}

              <div className="modal-section">
                <h4 className="modal-section-title">
                  <FileText size={16} />
                  <span>Item Description</span>
                </h4>
                <p className="modal-desc-text">
                  {selectedItem.description || "No detailed description provided."}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="modal-specs-grid">
                <div className="modal-spec-item">
                  <span className="spec-label">
                    <Building size={14} /> Building
                  </span>
                  <span className="spec-value">{selectedItem.building || "Campus Area"}</span>
                </div>

                <div className="modal-spec-item">
                  <span className="spec-label">
                    <Layers size={14} /> Floor
                  </span>
                  <span className="spec-value">{selectedItem.floor || "N/A"}</span>
                </div>

                <div className="modal-spec-item">
                  <span className="spec-label">
                    <Tag size={14} /> Category
                  </span>
                  <span className="spec-value" style={{ textTransform: "capitalize" }}>
                    {selectedItem.category || "General"}
                  </span>
                </div>

                <div className="modal-spec-item">
                  <span className="spec-label">
                    <Palette size={14} /> Color
                  </span>
                  <span className="spec-value" style={{ textTransform: "capitalize" }}>
                    {selectedItem.color || "Unspecified"}
                  </span>
                </div>

                <div className="modal-spec-item">
                  <span className="spec-label">
                    <Clock size={14} /> Logged Date
                  </span>
                  <span className="spec-value">
                    {selectedItem.lostDate || selectedItem.foundDate || "Recently"}
                  </span>
                </div>

                <div className="modal-spec-item">
                  <span className="spec-label">
                    <MapPin size={14} /> Exact Location
                  </span>
                  <span className="spec-value">
                    {selectedItem.locationDescription || "Campus Location"}
                  </span>
                </div>
              </div>

              {/* Reporter Box */}
              <div className="modal-reporter-card">
                <div className="reporter-avatar-lg">
                  {selectedItem.reporterName ? selectedItem.reporterName.charAt(0).toUpperCase() : <User size={18} />}
                </div>
                <div>
                  <div className="reporter-name-lg">{selectedItem.reporterName || "Campus Member"}</div>
                  <div className="reporter-email-sub">{selectedItem.reporterEmail || "UIU Verified User"}</div>
                </div>
              </div>

              {/* Verification & Claim Notice */}
              <div className="modal-claim-notice">
                <ShieldCheck size={20} style={{ color: "#ea580c", flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#1c1917" }}>
                    Safe Campus Retrieval Instructions
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#78716c", marginTop: "2px" }}>
                    To claim or verify ownership of this item, please visit the UIU Library Info Desk or Security Gate 1 with your official UIU Student ID card.
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Button variant="outline" size="md" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
              {selectedItem.type === "found" && user?.role !== "staff" && user?.role !== "admin" && (
                <Button
                  variant="gradient"
                  size="md"
                  onClick={() => {
                    setClaimingItem(selectedItem);
                    setSelectedItem(null);
                  }}
                >
                  Initiate Ownership Claim
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ownership Claim Modal for Found Item */}
      {claimingItem && (
        <ClaimItemModal
          foundItem={claimingItem}
          onClose={() => setClaimingItem(null)}
        />
      )}
    </div>
  );
};

export const DashboardPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    document.title = "Campus Feed - UIU Lost & Found";
  }, []);

  return (
    <DashboardProvider>
      <DashboardContent
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
    </DashboardProvider>
  );
};

export default DashboardPage;
