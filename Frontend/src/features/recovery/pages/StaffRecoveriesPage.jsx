import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, RefreshCw, Inbox, CheckCircle2 } from "lucide-react";
import RecoveryCard from "../components/RecoveryCard";
import { useRecoveryContext } from "../recovery.context";
import { AuthContext } from "../../auth/auth.context";

/**
 * StaffRecoveriesPage — Staff & Admin audit page for viewing all completed campus item handovers
 */
export function StaffRecoveriesPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { allRecoveries, loading, error, loadAllRecoveries } = useRecoveryContext();

  useEffect(() => {
    loadAllRecoveries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-block">
          <h1 className="page-title">
            <ShieldCheck size={22} className="page-title-icon found" />
            Campus Physical Recovery Log
          </h1>
          <p className="page-subtitle">
            Audit history of completed physical item handovers verified by UIU security and library desks.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn-icon-outline"
            onClick={loadAllRecoveries}
            disabled={loading}
            title="Refresh log"
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/claims/manage")}
          >
            <CheckCircle2 size={16} /> Audit Pending Claims Queue
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="page-error-banner">
          <span>⚠️ {error}</span>
          <button onClick={loadAllRecoveries}>Retry</button>
        </div>
      )}

      {/* Loading Skeleton / Empty State / Recoveries Log */}
      {loading ? (
        <div className="claims-grid-feed">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="lost-item-skeleton" style={{ height: "220px" }} />
          ))}
        </div>
      ) : allRecoveries.length === 0 ? (
        <div className="lost-item-empty">
          <div className="lost-item-empty-icon">
            <Inbox size={48} />
          </div>
          <h3>No Recovery Records Logged</h3>
          <p>No physical item handovers have been confirmed yet. Handovers are confirmed from approved claims.</p>
        </div>
      ) : (
        <div className="claims-grid-feed">
          {allRecoveries.map((rec) => (
            <RecoveryCard key={rec.id} recovery={rec} isStaff={true} />
          ))}
        </div>
      )}
    </div>
  );
}

export default StaffRecoveriesPage;
