import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, RefreshCw, ClipboardCheck, Inbox } from "lucide-react";
import ClaimCard from "../components/ClaimCard";
import { useClaimsContext } from "../claims.context";
import { AuthContext } from "../../auth/auth.context";

/**
 * MyClaimsPage — Displays the submitted ownership claims for student & faculty users
 */
export function MyClaimsPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    myClaims,
    rawMyClaims,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    loadMyClaims,
  } = useClaimsContext();

  useEffect(() => {
    loadMyClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-block">
          <h1 className="page-title">
            <ClipboardCheck size={22} className="page-title-icon lost" />
            My Ownership Claims
          </h1>
          <p className="page-subtitle">
            {user?.name ? `Hello, ${user.name.split(" ")[0]}!` : "Hello!"} Track the status of your item ownership claims submitted to campus security.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn-icon-outline"
            onClick={loadMyClaims}
            disabled={loading}
            title="Refresh claims"
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/found-items")}
          >
            <PlusCircle size={16} /> Claim a Found Item
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="claims-filter-strip">
        <button
          type="button"
          className={`filter-tab-pill ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All Claims ({rawMyClaims.length})
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${statusFilter === "pending" ? "active" : ""}`}
          onClick={() => setStatusFilter("pending")}
        >
          Pending ({rawMyClaims.filter((c) => c.status === "pending").length})
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${statusFilter === "approved" ? "active" : ""}`}
          onClick={() => setStatusFilter("approved")}
        >
          Approved ({rawMyClaims.filter((c) => c.status === "approved").length})
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${statusFilter === "rejected" ? "active" : ""}`}
          onClick={() => setStatusFilter("rejected")}
        >
          Rejected ({rawMyClaims.filter((c) => c.status === "rejected").length})
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="page-error-banner">
          <span>⚠️ {error}</span>
          <button onClick={loadMyClaims}>Retry</button>
        </div>
      )}

      {/* Loading Skeleton / Empty State / Claims Feed */}
      {loading ? (
        <div className="claims-grid-feed">
          {[1, 2, 3].map((i) => (
            <div key={i} className="lost-item-skeleton" style={{ height: "220px" }} />
          ))}
        </div>
      ) : myClaims.length === 0 ? (
        <div className="lost-item-empty">
          <div className="lost-item-empty-icon">
            <Inbox size={48} />
          </div>
          <h3>No Ownership Claims Found</h3>
          <p>
            {statusFilter === "all"
              ? "You haven't submitted any ownership claims yet. Browse turned-in found items to initiate a claim."
              : `No claims matching status '${statusFilter}'.`}
          </p>
        </div>
      ) : (
        <div className="claims-grid-feed">
          {myClaims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyClaimsPage;
