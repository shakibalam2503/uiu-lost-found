import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, UserCheck, ShieldCheck, Eye, FileText, User } from "lucide-react";
import RecoveryStatusBadge from "./RecoveryStatusBadge";

function formatDate(dateStr) {
  if (!dateStr) return "Recently";
  try {
    let d = dateStr;
    if (typeof dateStr === "object" && dateStr._seconds) {
      d = new Date(dateStr._seconds * 1000);
    } else {
      d = new Date(dateStr);
    }

    if (isNaN(d.getTime())) return "Recently";

    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Recently";
  }
}

/**
 * RecoveryCard — Displays summary card for a completed item recovery
 * Props:
 *   recovery: object
 *   isStaff?: boolean
 */
export function RecoveryCard({ recovery, isStaff = false }) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/recoveries/${recovery.id}`);
  };

  return (
    <div className="recovery-card" onClick={handleView}>
      <div className="recovery-card-header">
        <div className="recovery-card-title-group">
          <span className="recovery-id-tag">Rec #{recovery.id?.substring(0, 8)}</span>
          <RecoveryStatusBadge status={recovery.status} size="sm" />
        </div>
        <span className="recovery-date">
          <Clock size={12} /> {formatDate(recovery.recoveredAt || recovery.createdAt)}
        </span>
      </div>

      <div className="recovery-card-body">
        {/* Recipient / Student Info */}
        <div className="recovery-user-row">
          <User size={14} className="text-orange" />
          <span>
            Returned to: <strong>{recovery.studentName || recovery.studentEmail || "UIU Student"}</strong>
          </span>
        </div>

        {/* Staff Verifier Info */}
        <div className="recovery-verifier-row">
          <UserCheck size={14} style={{ color: "#10b981" }} />
          <span>
            Verified by: <strong>{recovery.verifiedByName || "Campus Security Staff"}</strong>
          </span>
        </div>

        {/* Handover Notes preview if present */}
        {recovery.notes && (
          <p className="recovery-notes-preview">
            <FileText size={13} /> "{recovery.notes}"
          </p>
        )}
      </div>

      <div className="recovery-card-footer">
        <button type="button" className="btn-view-recovery" onClick={handleView}>
          <Eye size={14} /> View Recovery Details
        </button>
      </div>
    </div>
  );
}

export default RecoveryCard;
