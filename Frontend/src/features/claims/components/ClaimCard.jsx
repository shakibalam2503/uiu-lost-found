import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Tag, MapPin, Eye, User, FileText } from "lucide-react";
import ClaimStatusBadge from "./ClaimStatusBadge";

function formatDate(dateStr) {
  if (!dateStr) return "Unknown Date";
  try {
    let d = dateStr;
    if (typeof dateStr === "object" && dateStr._seconds) {
      d = new Date(dateStr._seconds * 1000);
    } else {
      d = new Date(dateStr);
    }
    
    // Check for Invalid Date
    if (isNaN(d.getTime())) return "Unknown Date";

    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Unknown Date";
  }
}

/**
 * ClaimCard — Card item displaying summary of an ownership claim
 * Props:
 *   claim: object
 *   isStaff?: boolean
 */
export function ClaimCard({ claim, isStaff = false }) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/claims/${claim.id}`);
  };

  return (
    <div className="claim-card" onClick={handleView}>
      <div className="claim-card-header">
        <div className="claim-card-title-group">
          <span className="claim-id-tag">Claim #{claim.id?.substring(0, 8)}</span>
          <ClaimStatusBadge status={claim.status} size="sm" />
        </div>
        <span className="claim-date">
          <Clock size={12} /> {formatDate(claim.createdAt)}
        </span>
      </div>

      <div className="claim-card-body">
        {/* Found Item Info */}
        <div className="claim-item-summary found">
          <span className="summary-label">Target Found Item:</span>
          <h4 className="summary-title">{claim.foundItemTitle || claim.foundItemId}</h4>
          {claim.foundItemCategory && (
            <span className="summary-chip">
              <Tag size={12} /> {claim.foundItemCategory}
            </span>
          )}
        </div>

        {/* Linked Lost Item Info */}
        <div className="claim-item-summary lost">
          <span className="summary-label">Claimant's Lost Item Report:</span>
          <h4 className="summary-title">{claim.lostItemTitle || claim.lostItemId}</h4>
        </div>

        {/* Claimant Info for Staff */}
        {isStaff && (claim.claimantName || claim.claimantEmail) && (
          <div className="claim-claimant-info">
            <User size={13} />
            <span>
              Claimant: <strong>{claim.claimantName || "Student Member"}</strong> (
              {claim.claimantEmail})
            </span>
          </div>
        )}

        {claim.claimDetails && (
          <p className="claim-preview-desc">
            <FileText size={13} /> "{claim.claimDetails}"
          </p>
        )}
      </div>

      <div className="claim-card-footer">
        <button type="button" className="btn-view-claim" onClick={handleView}>
          <Eye size={14} /> View Claim Details
        </button>
      </div>
    </div>
  );
}

export default ClaimCard;
