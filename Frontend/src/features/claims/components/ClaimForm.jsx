import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, FileText, Package, AlertTriangle } from "lucide-react";
import useCreateClaim from "../hooks/useCreateClaim";
import { getMyLostItems } from "../../lost-items/services/lost-item.service";
import { getFoundItems } from "../../found-items/services/found-item.service";

/**
 * ClaimForm — Form component for submitting a new ownership claim
 * Props:
 *   initialFoundItemId?: string
 *   onSuccess?: (claim) => void
 */
export function ClaimForm({ initialFoundItemId = "", onSuccess }) {
  const navigate = useNavigate();
  const { submitClaim, loading, error: submitError, success, claim } = useCreateClaim();

  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [selectedFoundItemId, setSelectedFoundItemId] = useState(initialFoundItemId);
  const [selectedLostItemId, setSelectedLostItemId] = useState("");
  const [claimDetails, setClaimDetails] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoadingData(true);
      try {
        const [fItems, lItems] = await Promise.all([getFoundItems(), getMyLostItems()]);
        if (mounted) {
          setFoundItems(fItems || []);
          setLostItems(lItems || []);

          if (!selectedFoundItemId && fItems?.length > 0) {
            setSelectedFoundItemId(fItems[0].id);
          }
          if (lItems?.length > 0) {
            setSelectedLostItemId(lItems[0].id);
          }
        }
      } catch (err) {
        // silent fallback, handled on submit
      } finally {
        if (mounted) setLoadingData(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [initialFoundItemId]);

  const validate = () => {
    const e = {};
    if (!selectedFoundItemId) e.foundItemId = "Please select the turned-in found item.";
    if (!claimDetails.trim()) e.claimDetails = "Claim proof details are required.";
    if (claimDetails.trim().length < 10) e.claimDetails = "Please provide more detailed proof (at least 10 characters).";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    try {
      const result = await submitClaim({
        foundItemId: selectedFoundItemId,
        lostItemId: selectedLostItemId || null,
        claimDetails: claimDetails.trim(),
      });
      if (onSuccess) onSuccess(result);
    } catch (_) {
      // Error handled in hook
    }
  };

  if (success) {
    return (
      <div className="claim-form-success">
        <div className="success-icon-badge">
          <CheckCircle2 size={56} />
        </div>
        <h2>Ownership Claim Submitted!</h2>
        <p>
          Your claim request has been registered and is pending staff review. You can track your claim status on your claims dashboard.
        </p>
        <div className="success-actions-row">
          <button className="btn-primary" onClick={() => navigate("/claims/my")}>
            View My Claims
          </button>
          <button className="btn-outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="claim-form-container" onSubmit={handleSubmit} noValidate>
      {submitError && (
        <div className="form-error-banner">
          <AlertCircle size={18} />
          <span>{submitError}</span>
        </div>
      )}

      {/* Selected Found Item */}
      <div className={`form-group ${errors.foundItemId ? "has-error" : ""}`}>
        <label className="form-label" htmlFor="cf-found-item">
          Target Found Item <span className="form-required">*</span>
        </label>
        {loadingData ? (
          <p className="form-loading-text">Loading available found items...</p>
        ) : (
          <select
            id="cf-found-item"
            className="form-select"
            value={selectedFoundItemId}
            onChange={(e) => {
              setSelectedFoundItemId(e.target.value);
              setErrors((prev) => ({ ...prev, foundItemId: null }));
            }}
            disabled={loading}
          >
            <option value="">Select found item...</option>
            {foundItems.map((fi) => (
              <option key={fi.id} value={fi.id}>
                {fi.title} ({fi.building || "Campus Area"} - {fi.category || "General"})
              </option>
            ))}
          </select>
        )}
        {errors.foundItemId && <p className="form-error-msg">{errors.foundItemId}</p>}
      </div>

      {/* Selected Owned Lost Item (Optional) */}
      <div className={`form-group ${errors.lostItemId ? "has-error" : ""}`}>
        <label className="form-label" htmlFor="cf-lost-item">
          Your Matching Lost Item Report <span style={{ fontSize: "0.8em", color: "#78716c", fontWeight: 400 }}>(Optional)</span>
        </label>
        {loadingData ? (
          <p className="form-loading-text">Loading your lost item reports...</p>
        ) : (
          <select
            id="cf-lost-item"
            className="form-select"
            value={selectedLostItemId}
            onChange={(e) => {
              setSelectedLostItemId(e.target.value);
              setErrors((prev) => ({ ...prev, lostItemId: null }));
            }}
            disabled={loading}
          >
            <option value="">None / Direct Claim (No report linked)</option>
            {lostItems.map((li) => (
              <option key={li.id} value={li.id}>
                {li.title} ({li.category || "General"})
              </option>
            ))}
          </select>
        )}
        {errors.lostItemId && <p className="form-error-msg">{errors.lostItemId}</p>}
      </div>

      {/* Claim Explanation / Details */}
      <div className={`form-group ${errors.claimDetails ? "has-error" : ""}`}>
        <label className="form-label" htmlFor="cf-details">
          <FileText size={15} /> Proof of Ownership & Secret Details <span className="form-required">*</span>
        </label>
        <textarea
          id="cf-details"
          className="form-textarea"
          rows={5}
          placeholder="Provide secret details to prove ownership — e.g. lockscreen wallpaper description, laptop serial number, unique pouch contents, scratch marks, or passwords..."
          value={claimDetails}
          onChange={(e) => {
            setClaimDetails(e.target.value);
            setErrors((prev) => ({ ...prev, claimDetails: null }));
          }}
          disabled={loading}
        />
        {errors.claimDetails && <p className="form-error-msg">{errors.claimDetails}</p>}
      </div>

      <div className="form-footer">
        <button type="button" className="btn-ghost" onClick={() => navigate(-1)} disabled={loading}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary btn-lg"
          disabled={loading}
        >
          {loading ? "Submitting Claim..." : "Submit Ownership Claim"}
        </button>
      </div>
    </form>
  );
}

export default ClaimForm;
