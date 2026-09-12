import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  ClipboardCheck,
  PlusCircle,
  RefreshCw,
  Inbox,
  User,
  ArrowLeft,
  Shield,
  LogOut,
  PackageCheck,
} from "lucide-react";

import useAuth from "../../auth/hooks/useAuth";
import { useLostItemsContext } from "../../lost-items/lost-items.context";
import { useClaimsContext } from "../../claims/claims.context";
import { useRecoveryContext } from "../../recovery/recovery.context";
import { LostItemList } from "../../lost-items/components/LostItemList";
import ClaimCard from "../../claims/components/ClaimCard";
import RecoveryCard from "../../recovery/components/RecoveryCard";

const TABS = [
  { id: "lost", label: "My Lost Items", icon: ClipboardList },
  { id: "claims", label: "My Claims", icon: ClipboardCheck },
  { id: "recoveries", label: "Recovered Items", icon: PackageCheck },
];

export function StudentPortalPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("lost");

  const {
    myItems, myItemsLoading, error: lostError, loadMyItems, removeItem,
  } = useLostItemsContext();

  const {
    myClaims, rawMyClaims, loading: claimsLoading, error: claimsError,
    statusFilter, setStatusFilter, loadMyClaims,
  } = useClaimsContext();

  const {
    myRecoveries, loading: recLoading, error: recError, loadMyRecoveries,
  } = useRecoveryContext();

  useEffect(() => {
    document.title = "My Portal - UIU Lost & Found";
    loadMyItems();
    loadMyClaims();
    loadMyRecoveries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteLost = async (id) => {
    try { await removeItem(id); }
    catch (err) { alert(err.message || "Failed to delete item."); }
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "Student";

  return (
    <div className="portal-layout">
      <header className="dashboard-navbar">
        <div className="dashboard-nav-inner">
          <div className="nav-brand" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
            <div className="brand-logo-icon"><Shield size={22} strokeWidth={2.5} /></div>
            <span className="brand-logo-text">
              <span className="text-orange">uiu</span> lost &amp; found
            </span>
          </div>
          <div className="dashboard-user-bar">
            <div className="user-profile-summary">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.name || "User"} className="user-avatar" />
              ) : (
                <div className="user-avatar-fallback">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                </div>
              )}
              <div className="user-details">
                <span className="user-name">{user?.name || user?.email}</span>
                <span className="role-badge badge-student">
                  {user?.role ? user.role.toUpperCase() : "STUDENT"}
                </span>
              </div>
            </div>
            <button type="button" className="portal-back-btn" onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={15} /> Dashboard
            </button>
            <button type="button" className="btn-logout" onClick={logout} title="Sign Out">
              <LogOut size={16} /><span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="portal-main">
        <div className="portal-container">
          <div className="portal-hero">
            <div className="portal-hero-left">
              <p className="portal-eyebrow">Student Portal</p>
              <h1 className="portal-hero-title">Hello, {firstName}! 👋</h1>
              <p className="portal-hero-sub">
                Track your lost item reports, ownership claims and recovered items — all in one place.
              </p>
            </div>
            <div className="portal-hero-stats">
              <div className="portal-stat-pill">
                <ClipboardList size={18} className="pstat-icon lost-icon" />
                <div>
                  <span className="pstat-num">{myItems.length}</span>
                  <span className="pstat-label">Lost Reports</span>
                </div>
              </div>
              <div className="portal-stat-pill">
                <ClipboardCheck size={18} className="pstat-icon claim-icon" />
                <div>
                  <span className="pstat-num">{rawMyClaims.length}</span>
                  <span className="pstat-label">Claims Made</span>
                </div>
              </div>
              <div className="portal-stat-pill">
                <PackageCheck size={18} className="pstat-icon rec-icon" />
                <div>
                  <span className="pstat-num">{myRecoveries.length}</span>
                  <span className="pstat-label">Items Recovered</span>
                </div>
              </div>
            </div>
          </div>

          <div className="portal-tab-bar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`portal-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={16} /><span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === "lost" && (
            <div className="portal-tab-content">
              <div className="portal-tab-header">
                <h2 className="portal-tab-title">
                  <ClipboardList size={20} className="tab-title-icon lost-icon" />
                  My Lost Item Reports
                </h2>
                <div className="portal-tab-actions">
                  <button type="button" className="btn-icon-outline" onClick={loadMyItems} disabled={myItemsLoading} title="Refresh">
                    <RefreshCw size={15} className={myItemsLoading ? "spin" : ""} />
                  </button>
                  <button type="button" className="btn-primary" onClick={() => navigate("/lost-items/report")}>
                    <PlusCircle size={15} /> Report Lost Item
                  </button>
                </div>
              </div>
              {lostError && (
                <div className="page-error-banner"><span>⚠️ {lostError}</span><button onClick={loadMyItems}>Retry</button></div>
              )}
              {!myItemsLoading && myItems.length > 0 && (
                <div className="page-stats-bar" style={{ marginBottom: "1rem" }}>
                  <span>{myItems.length} report{myItems.length !== 1 ? "s" : ""}</span>
                  <span className="stat-sep">•</span>
                  <span className="stat-lost">{myItems.filter((i) => i.status === "lost").length} active</span>
                  {myItems.filter((i) => i.status === "returned").length > 0 && (
                    <><span className="stat-sep">•</span>
                    <span className="stat-returned">{myItems.filter((i) => i.status === "returned").length} returned</span></>
                  )}
                </div>
              )}
              <LostItemList
                items={myItems}
                loading={myItemsLoading}
                showActions={true}
                onDelete={handleDeleteLost}
                emptyMessage="No lost item reports yet"
                emptySubMessage="You haven't reported any lost items. Click 'Report Lost Item' to get started."
              />
            </div>
          )}

          {activeTab === "claims" && (
            <div className="portal-tab-content">
              <div className="portal-tab-header">
                <h2 className="portal-tab-title">
                  <ClipboardCheck size={20} className="tab-title-icon claim-icon" />
                  My Ownership Claims
                </h2>
                <div className="portal-tab-actions">
                  <button type="button" className="btn-icon-outline" onClick={loadMyClaims} disabled={claimsLoading} title="Refresh">
                    <RefreshCw size={15} className={claimsLoading ? "spin" : ""} />
                  </button>
                  <button type="button" className="btn-primary" onClick={() => navigate("/found-items")}>
                    <PlusCircle size={15} /> Claim a Found Item
                  </button>
                </div>
              </div>
              <div className="claims-filter-strip">
                {["all", "pending", "approved", "rejected"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`filter-tab-pill ${statusFilter === s ? "active" : ""}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s === "all"
                      ? `All (${rawMyClaims.length})`
                      : `${s.charAt(0).toUpperCase() + s.slice(1)} (${rawMyClaims.filter((c) => c.status === s).length})`}
                  </button>
                ))}
              </div>
              {claimsError && (
                <div className="page-error-banner"><span>⚠️ {claimsError}</span><button onClick={loadMyClaims}>Retry</button></div>
              )}
              {claimsLoading ? (
                <div className="claims-grid-feed">
                  {[1, 2, 3].map((i) => <div key={i} className="lost-item-skeleton" style={{ height: "220px" }} />)}
                </div>
              ) : myClaims.length === 0 ? (
                <div className="lost-item-empty">
                  <div className="lost-item-empty-icon"><Inbox size={48} /></div>
                  <h3>No Claims Found</h3>
                  <p>{statusFilter === "all"
                    ? "You haven't submitted any ownership claims yet. Browse found items to initiate a claim."
                    : `No claims with status '${statusFilter}'.`}</p>
                </div>
              ) : (
                <div className="claims-grid-feed">
                  {myClaims.map((claim) => <ClaimCard key={claim.id} claim={claim} />)}
                </div>
              )}
            </div>
          )}

          {activeTab === "recoveries" && (
            <div className="portal-tab-content">
              <div className="portal-tab-header">
                <h2 className="portal-tab-title">
                  <PackageCheck size={20} className="tab-title-icon rec-icon" />
                  My Recovered Items
                </h2>
                <div className="portal-tab-actions">
                  <button type="button" className="btn-icon-outline" onClick={loadMyRecoveries} disabled={recLoading} title="Refresh">
                    <RefreshCw size={15} className={recLoading ? "spin" : ""} />
                  </button>
                </div>
              </div>
              <p className="portal-rec-hint">
                Items listed here have been <strong>physically returned</strong> to you by campus staff after a successful ownership claim.
              </p>
              {recError && (
                <div className="page-error-banner"><span>⚠️ {recError}</span><button onClick={loadMyRecoveries}>Retry</button></div>
              )}
              {recLoading ? (
                <div className="claims-grid-feed">
                  {[1, 2, 3].map((i) => <div key={i} className="lost-item-skeleton" style={{ height: "200px" }} />)}
                </div>
              ) : myRecoveries.length === 0 ? (
                <div className="lost-item-empty">
                  <div className="lost-item-empty-icon"><PackageCheck size={48} /></div>
                  <h3>No Recovered Items Yet</h3>
                  <p>Once a claim is approved and you pick up your item from campus, it will appear here.</p>
                </div>
              ) : (
                <div className="claims-grid-feed">
                  {myRecoveries.map((rec) => <RecoveryCard key={rec.id} recovery={rec} />)}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentPortalPage;
