import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, CheckCircle2, Inbox } from "lucide-react";
import RecoveryCard from "../components/RecoveryCard";
import { useRecoveryContext } from "../recovery.context";
import { AuthContext } from "../../auth/auth.context";

/**
 * MyRecoveriesPage — Displays completed item recovery records for student & faculty users
 */
export function MyRecoveriesPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { myRecoveries, loading, error, loadMyRecoveries } = useRecoveryContext();

  useEffect(() => {
    loadMyRecoveries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-block">
          <h1 className="page-title">
            <CheckCircle2 size={22} className="page-title-icon found" />
            My Recovered Items
          </h1>
          <p className="page-subtitle">
            {user?.name ? `Hello, ${user.name.split(" ")[0]}!` : "Hello!"} View records of items you have successfully recovered from campus lost & found desks.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn-icon-outline"
            onClick={loadMyRecoveries}
            disabled={loading}
            title="Refresh recoveries"
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="page-error-banner">
          <span>⚠️ {error}</span>
          <button onClick={loadMyRecoveries}>Retry</button>
        </div>
      )}

      {/* Loading Skeleton / Empty State / Recoveries Grid */}
      {loading ? (
        <div className="claims-grid-feed">
          {[1, 2, 3].map((i) => (
            <div key={i} className="lost-item-skeleton" style={{ height: "200px" }} />
          ))}
        </div>
      ) : myRecoveries.length === 0 ? (
        <div className="lost-item-empty">
          <div className="lost-item-empty-icon">
            <Inbox size={48} />
          </div>
          <h3>No Recovered Items Yet</h3>
          <p>You have no completed physical item recovery records yet.</p>
        </div>
      ) : (
        <div className="claims-grid-feed">
          {myRecoveries.map((rec) => (
            <RecoveryCard key={rec.id} recovery={rec} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRecoveriesPage;
