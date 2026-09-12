import React, { useState, useEffect } from "react";
import { X, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { getMyLostItems } from "../../lost-items/services/lost-item.service";
import { submitOwnershipClaim } from "../services/item-details.service";

/**
 * ClaimItemModal — Modal for Student / Faculty users to submit an ownership claim for a found item
 * Props:
 *   foundItem: object
 *   onClose: () => void
 *   onSuccess?: () => void
 */
export function ClaimItemModal({ foundItem, onClose, onSuccess }) {
  const [myLostItems, setMyLostItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [selectedLostItemId, setSelectedLostItemId] = useState("");
  const [claimDetails, setClaimDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadReports() {
      setLoadingItems(true);
      try {
        const reports = await getMyLostItems();
        if (mounted) {
          setMyLostItems(reports || []);
          if (reports && reports.length > 0) {
            setSelectedLostItemId(reports[0].id);
          }
        }
      } catch (err) {
        if (mounted) setError("Failed to retrieve your reported lost items.");
      } finally {
        if (mounted) setLoadingItems(false);
      }
    }
    loadReports();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!claimDetails.trim()) {
      setError("Please provide ownership proof or item details.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitOwnershipClaim({
        foundItemId: foundItem.id,
        lostItemId: selectedLostItemId || null,
        claimDetails: claimDetails.trim(),
      });
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Failed to submit ownership claim.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Claim Item: {foundItem.title}</h3>
            <p className="modal-subtitle">Submit proof of ownership for official staff review</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        {success ? (
          <div className="modal-success-state">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={48} />
            </div>
            <h4>Ownership Claim Submitted!</h4>
            <p>
              Your claim for <strong>{foundItem.title}</strong> has been submitted. Campus security staff will review your claim details and lost report.
            </p>
            <button type="button" className="btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form-body">
            {error && (
              <div className="form-error-banner">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Select Lost Item (Optional) */}
            <div className="form-group">
              <label className="form-label" htmlFor="claim-select-lost-item">
                Your Matching Lost Item Report <span style={{ fontSize: "0.8em", color: "#78716c", fontWeight: 400 }}>(Optional)</span>
              </label>
              {loadingItems ? (
                <p className="form-helper-text">Loading your reported lost items...</p>
              ) : (
                <select
                  id="claim-select-lost-item"
                  className="form-select"
                  value={selectedLostItemId}
                  onChange={(e) => setSelectedLostItemId(e.target.value)}
                >
                  <option value="">None / Direct Claim (No report linked)</option>
                  {myLostItems.map((report) => (
                    <option key={report.id} value={report.id}>
                      {report.title} ({report.category || "General"})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Claim Details / Proof */}
            <div className="form-group">
              <label className="form-label" htmlFor="claim-proof-details">
                <FileText size={15} /> Ownership Details & Unique Marks <span className="form-required">*</span>
              </label>
              <textarea
                id="claim-proof-details"
                className="form-textarea"
                rows={4}
                placeholder="Describe unique serial numbers, lockscreen wallpaper, stickers, pouch contents, or scratches to prove ownership..."
                value={claimDetails}
                onChange={(e) => setClaimDetails(e.target.value)}
                required
              />
            </div>

            {/* Modal Footer */}
            <div className="modal-footer-actions">
              <button type="button" className="btn-ghost" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? "Submitting Claim..." : "Submit Claim"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ClaimItemModal;
