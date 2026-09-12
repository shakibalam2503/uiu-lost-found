import React, { useEffect, useContext } from "react";
import { ShieldCheck, RefreshCw, Inbox, AlertTriangle } from "lucide-react";
import ClaimCard from "../components/ClaimCard";
import { useClaimsContext } from "../claims.context";
import { AuthContext } from "../../auth/auth.context";

/**
 * StaffClaimsPage — Staff & Admin queue page for reviewing student ownership claims across campus
 */
export function StaffClaimsPage() {
  const { user } = useContext(AuthContext);
  const {
    allClaims,
    rawAllClaims,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    loadAllClaims,
  } = useClaimsContext();

  useEffect(() => {
    loadAllClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingCount = rawAllClaims.filter((c) => c.status === "pending").length;
  const approvedCount = rawAllClaims.filter((c) => c.status === "approved").length;
  const rejectedCount = rawAllClaims.filter((c) => c.status === "rejected").length;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-block">
          <h1 className="page-title">
            <ShieldCheck size={22} className="page-title-icon found" />
            Staff Claims Verification Queue
          </h1>
          <p className="page-subtitle">
            Review ownership proof explanations, verify matching items, and approve or reject student claims.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn-icon-outline"
            onClick={loadAllClaims}
            disabled={loading}
            title="Refresh queue"
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
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
          All Claims ({rawAllClaims.length})
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${statusFilter === "pending" ? "active" : ""}`}
          onClick={() => setStatusFilter("pending")}
        >
          Pending Review ({pendingCount})
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${statusFilter === "approved" ? "active" : ""}`}
          onClick={() => setStatusFilter("approved")}
        >
          Approved ({approvedCount})
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${statusFilter === "rejected" ? "active" : ""}`}
          onClick={() => setStatusFilter("rejected")}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="page-error-banner">
          <span>⚠️ {error}</span>
          <button onClick={loadAllClaims}>Retry</button>
        </div>
      )}

      {/* Loading Skeleton / Empty State / Claims Queue */}
      {loading ? (
        <div className="claims-grid-feed">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="lost-item-skeleton" style={{ height: "240px" }} />
          ))}
        </div>
      ) : allClaims.length === 0 ? (
        <div className="lost-item-empty">
          <div className="lost-item-empty-icon">
            <Inbox size={48} />
          </div>
          <h3>No Claims in Queue</h3>
          <p>
            {statusFilter === "all"
              ? "There are currently no ownership claims submitted by students."
              : `No claims matching filter '${statusFilter}'.`}
          </p>
        </div>
      ) : (
        <div className="claims-grid-feed">
          {allClaims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} isStaff={true} />
          ))}
        </div>
      )}
    </div>
  );
}

export default StaffClaimsPage;
