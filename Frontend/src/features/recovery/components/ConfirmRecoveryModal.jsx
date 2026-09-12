import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, AlertCircle, AlertTriangle, FileText, User } from "lucide-react";
import useCreateRecovery from "../hooks/useCreateRecovery";

/**
 * ConfirmRecoveryModal — Modal for Staff / Admin to confirm physical item handover from an APPROVED claim
 * Props:
 *   claim: object (must have status === 'approved')
 *   onClose: () => void
 *   onSuccess?: (recovery) => void
 */
export function ConfirmRecoveryModal({ claim, onClose, onSuccess }) {
  const { confirmHandover, loading, error: submitError, success, recovery } = useCreateRecovery();
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState(null);

  // Check if claim is approved
  const isApproved = claim?.status === "approved";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isApproved) {
      setValidationError("Only approved claims can be marked as physically recovered.");
      return;
    }

    setValidationError(null);

    try {
      const res = await confirmHandover({
        claimId: claim.id,
        notes: notes.trim(),
      });
      if (onSuccess) onSuccess(res);
    } catch (_) {
      // Error handled in hook
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-md" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <ShieldCheck size={22} className="text-emerald" />
            <h3 className="modal-title-text">Confirm Physical Handover & Recovery</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        {success ? (
          <div className="modal-success-content text-center">
            <div className="success-icon-badge" style={{ margin: "1.5rem auto" }}>
              <CheckCircle2 size={56} />
            </div>
            <h2>Item Recovery Confirmed!</h2>
            <p>
              The physical handover has been logged successfully. The backend system has updated the status of both lost and found item records to <strong>Recovered</strong>.
            </p>
            <div className="modal-actions-single" style={{ marginTop: "1.5rem" }}>
              <button type="button" className="btn-primary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body-form">
            {(submitError || validationError) && (
              <div className="form-error-banner">
                <AlertCircle size={18} />
                <span>{submitError || validationError}</span>
              </div>
            )}

            {!isApproved && (
              <div className="page-error-banner" style={{ marginBottom: "1rem" }}>
                <AlertTriangle size={18} />
                <span>
                  Warning: Claim #{claim?.id?.substring(0, 8)} has status '{claim?.status}'. Only approved claims can proceed to physical recovery confirmation.
                </span>
              </div>
            )}

            {/* Handover Summary Box */}
            <div className="handover-summary-card">
              <div className="summary-row">
                <span className="row-label">Recipient / Student:</span>
                <span className="row-val font-bold">
                  <User size={14} className="inline-icon" /> {claim?.claimantName || "Campus Student"} ({claim?.claimantEmail})
                </span>
              </div>

              <div className="summary-row">
                <span className="row-label">Associated Claim:</span>
                <span className="row-val">Claim #{claim?.id?.substring(0, 8)} ({claim?.status})</span>
              </div>

              <div className="summary-row">
                <span className="row-label">Found Item ID:</span>
                <span className="row-val">{claim?.foundItemId}</span>
              </div>

              <div className="summary-row">
                <span className="row-label">Lost Item ID:</span>
                <span className="row-val">{claim?.lostItemId}</span>
              </div>
            </div>

            {/* Handover Notes Textarea */}
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label htmlFor="recovery-notes" className="form-label">
                <FileText size={15} /> Handover & Verifier Notes <span className="form-optional">(optional)</span>
              </label>
              <textarea
                id="recovery-notes"
                className="form-textarea"
                rows={3}
                placeholder="Log physical verification details (e.g. Student presented UIU ID Card #2019-123 at Library Info Desk, verified matching laptop serial number)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={loading || !isApproved}
              />
            </div>

            {/* Footer Actions */}
            <div className="modal-footer-row">
              <button type="button" className="btn-ghost" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-success btn-lg"
                disabled={loading || !isApproved}
              >
                {loading ? "Confirming Handover..." : "Confirm Recovery & Handover"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ConfirmRecoveryModal;
