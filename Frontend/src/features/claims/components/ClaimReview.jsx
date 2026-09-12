import React, { useState, useContext } from "react";
import { CheckCircle2, XCircle, ShieldCheck, Mail, User, AlertCircle } from "lucide-react";
import useReviewClaim from "../hooks/useReviewClaim";
import { AuthContext } from "../../auth/auth.context";

/**
 * ClaimReview — Staff / Admin review interface for approving or rejecting claims
 * Props:
 *   claim: object
 *   onReviewComplete?: (updatedClaim) => void
 */
export function ClaimReview({ claim, onReviewComplete }) {
  const { user } = useContext(AuthContext);
  const isStaff = user?.role === "staff" || user?.role === "admin";

  const { reviewClaim, loading, error: reviewError } = useReviewClaim();
  const [staffNote, setStaffNote] = useState(claim.staffNote || "");
  const [actionError, setActionError] = useState(null);

  // SECURITY CHECK: Hide review controls completely for non-staff/admin users
  if (!isStaff) {
    return null;
  }

  // If claim is already reviewed
  const isAlreadyReviewed = claim.status !== "pending";

  const handleAction = async (status) => {
    setActionError(null);
    try {
      const updated = await reviewClaim(claim.id, {
        status,
        staffNote: staffNote.trim(),
      });
      if (onReviewComplete) {
        onReviewComplete(updated);
      }
    } catch (err) {
      setActionError(err.message || `Failed to set claim status to ${status}.`);
    }
  };

  return (
    <div className="claim-review-panel">
      <div className="review-panel-header">
        <ShieldCheck size={20} className="text-orange" />
        <h3 className="review-panel-title">Staff Audit & Verification Controls</h3>
      </div>

      {(reviewError || actionError) && (
        <div className="form-error-banner" style={{ marginBottom: "1rem" }}>
          <AlertCircle size={18} />
          <span>{reviewError || actionError}</span>
        </div>
      )}

      {/* Claimant Details Grid */}
      <div className="review-claimant-grid">
        <div className="review-info-item">
          <span className="info-label">
            <User size={13} /> Claimant Name
          </span>
          <span className="info-val">{claim.claimantName || "Campus Student"}</span>
        </div>

        <div className="review-info-item">
          <span className="info-label">
            <Mail size={13} /> Claimant Email
          </span>
          <span className="info-val">{claim.claimantEmail || "Verified UIU Email"}</span>
        </div>
      </div>

      {/* Claim Explanation Box */}
      <div className="review-explanation-box">
        <span className="info-label">Submitted Ownership Explanation:</span>
        <p className="explanation-text">"{claim.claimDetails || "No explanation text provided."}"</p>
      </div>

      {/* Staff Note Field */}
      {!isAlreadyReviewed ? (
        <div className="form-group" style={{ marginTop: "1rem" }}>
          <label htmlFor="staff-review-note" className="form-label">
            Staff Administrative Note <span className="form-optional">(optional)</span>
          </label>
          <textarea
            id="staff-review-note"
            className="form-textarea"
            rows={3}
            placeholder="Add note for the student or internal verification records (e.g. Verified serial number against physical laptop, approved for Gate 1 pickup)..."
            value={staffNote}
            onChange={(e) => setStaffNote(e.target.value)}
            disabled={loading}
          />
        </div>
      ) : (
        claim.staffNote && (
          <div className="reviewed-note-box">
            <span className="info-label">Staff Decision Note:</span>
            <p className="note-text">{claim.staffNote}</p>
          </div>
        )
      )}

      {/* Action Buttons (Only enabled when claim status is pending) */}
      {!isAlreadyReviewed && (
        <div className="review-actions-row">
          <button
            type="button"
            className="btn-success btn-lg"
            onClick={() => handleAction("approved")}
            disabled={loading}
          >
            <CheckCircle2 size={18} />
            <span>Approve Ownership Claim</span>
          </button>

          <button
            type="button"
            className="btn-danger btn-lg"
            onClick={() => handleAction("rejected")}
            disabled={loading}
          >
            <XCircle size={18} />
            <span>Reject Claim</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ClaimReview;
