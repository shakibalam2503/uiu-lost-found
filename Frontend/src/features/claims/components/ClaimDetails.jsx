import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Building,
  Layers,
  MapPin,
  ShieldCheck,
  User,
  Mail,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  PackageCheck,
} from "lucide-react";
import ClaimStatusBadge from "./ClaimStatusBadge";
import ClaimReview from "./ClaimReview";
import ConfirmRecoveryModal from "../../recovery/components/ConfirmRecoveryModal";
import { getFoundItemById } from "../../found-items/services/found-item.service";
import { getLostItemById } from "../../lost-items/services/lost-item.service";
import { AuthContext } from "../../auth/auth.context";

function formatDate(dateStr) {
  if (!dateStr) return "Unspecified Date";
  try {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

/**
 * ClaimDetails — Full detailed view of an ownership claim
 * Props:
 *   claim: object
 *   onClaimUpdate?: (updated) => void
 */
export function ClaimDetails({ claim: initialClaim, onClaimUpdate }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isStaff = user?.role === "staff" || user?.role === "admin";

  const [claim, setClaim] = useState(initialClaim);
  const [foundItem, setFoundItem] = useState(null);
  const [lostItem, setLostItem] = useState(null);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  useEffect(() => {
    setClaim(initialClaim);
    let mounted = true;

    async function loadItemDetails() {
      if (!initialClaim) return;
      setLoadingMedia(true);
      try {
        const [fRes, lRes] = await Promise.allSettled([
          initialClaim.foundItemId ? getFoundItemById(initialClaim.foundItemId) : null,
          initialClaim.lostItemId ? getLostItemById(initialClaim.lostItemId) : null,
        ]);

        if (mounted) {
          if (fRes.status === "fulfilled") setFoundItem(fRes.value);
          if (lRes.status === "fulfilled") setLostItem(lRes.value);
        }
      } catch (err) {
        // silent fallback
      } finally {
        if (mounted) setLoadingMedia(false);
      }
    }

    loadItemDetails();
    return () => {
      mounted = false;
    };
  }, [initialClaim]);

  const handleReviewComplete = (updated) => {
    setClaim(updated);
    if (onClaimUpdate) onClaimUpdate(updated);
  };

  if (!claim) return null;

  const foundImg = foundItem?.imageUrls?.[0] || null;
  const lostImg = lostItem?.imageUrls?.[0] || null;

  return (
    <div className="claim-details-container">
      {/* Top Header */}
      <div className="claim-details-top">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="claim-status-header-tag">
          <ClaimStatusBadge status={claim.status} size="lg" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="claim-details-grid">
        {/* Left Column: Items Comparison & Overview */}
        <div className="claim-items-comparison-col">
          {/* Target Found Item Card */}
          <div className="item-comparison-card found-card">
            <div className="comparison-card-badge">Found Item Record</div>
            <div className="comparison-card-content">
              {foundImg ? (
                <img src={foundImg} alt={foundItem?.title || "Found Item"} className="comparison-img" />
              ) : (
                <div className="no-img-placeholder">No Image Available</div>
              )}
              <div className="comparison-info">
                <h4 className="comparison-title">{foundItem?.title || claim.foundItemId}</h4>
                <div className="comparison-meta">
                  {foundItem?.category && (
                    <span className="meta-chip">
                      <Tag size={12} /> {foundItem.category}
                    </span>
                  )}
                  {foundItem?.building && (
                    <span className="meta-chip">
                      <Building size={12} /> {foundItem.building}
                    </span>
                  )}
                </div>
                {foundItem?.id && (
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => navigate(`/found-items/${foundItem.id}`)}
                  >
                    View Found Item Page <ExternalLink size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Claimant's Lost Item Card */}
          <div className="item-comparison-card lost-card">
            <div className="comparison-card-badge">Claimant's Lost Item Report</div>
            <div className="comparison-card-content">
              {lostImg ? (
                <img src={lostImg} alt={lostItem?.title || "Lost Item"} className="comparison-img" />
              ) : (
                <div className="no-img-placeholder">No Image Available</div>
              )}
              <div className="comparison-info">
                <h4 className="comparison-title">{lostItem?.title || claim.lostItemId}</h4>
                <div className="comparison-meta">
                  {lostItem?.category && (
                    <span className="meta-chip">
                      <Tag size={12} /> {lostItem.category}
                    </span>
                  )}
                </div>
                {lostItem?.id && (
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => navigate(`/lost-items/${lostItem.id}`)}
                  >
                    View Lost Report <ExternalLink size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Claim Metadata & Status */}
        <div className="claim-metadata-col">
          {/* Claim Submission Info */}
          <div className="claim-info-card">
            <h3 className="card-section-heading">Claim Overview</h3>
            <div className="claim-details-rows">
              <div className="claim-detail-row">
                <Clock size={15} />
                <span>Submitted: <strong>{formatDate(claim.createdAt)}</strong></span>
              </div>
              <div className="claim-detail-row">
                <User size={15} />
                <span>Claimant: <strong>{claim.claimantName || "Student Member"}</strong></span>
              </div>
              <div className="claim-detail-row">
                <Mail size={15} />
                <span>Contact Email: <strong>{claim.claimantEmail}</strong></span>
              </div>
            </div>
          </div>

          {/* Claim Explanation / Details */}
          <div className="claim-info-card">
            <h3 className="card-section-heading">Ownership Proof Explanation</h3>
            <p className="claim-explanation-text">"{claim.claimDetails}"</p>
          </div>

          {/* Approved Recovery Guidance Banner */}
          {claim.status === "approved" && (
            <div className="recovery-guidance-card">
              <div className="guidance-header">
                <CheckCircle2 size={22} className="text-emerald" />
                <h4>Claim Approved — Campus Retrieval Steps</h4>
              </div>
              <p className="guidance-body">
                Your ownership claim has been verified and approved by campus security staff!
              </p>
              <div className="retrieval-checklist">
                <div className="checklist-item">
                  <span className="step-num">1</span>
                  <span>Visit the <strong>UIU Library Information Desk</strong> or <strong>Gate 1 Security Office</strong> during official campus hours.</span>
                </div>
                <div className="checklist-item">
                  <span className="step-num">2</span>
                  <span>Present your official <strong>UIU Student ID Card</strong> and reference <strong>Claim #{claim.id?.substring(0, 8)}</strong>.</span>
                </div>
                <div className="checklist-item">
                  <span className="step-num">3</span>
                  <span>Campus staff will complete physical handover and confirm receipt in the system.</span>
                </div>
              </div>

              {/* Staff Action to Confirm Handover */}
              {isStaff && (
                <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px dashed #6ee7b7" }}>
                  <button
                    type="button"
                    className="btn-success btn-lg"
                    style={{ width: "100%" }}
                    onClick={() => setShowRecoveryModal(true)}
                  >
                    <PackageCheck size={18} /> Confirm Physical Handover
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Staff Review Controls (Only shown for staff/admin) */}
          {isStaff && (
            <ClaimReview claim={claim} onReviewComplete={handleReviewComplete} />
          )}
        </div>
      </div>

      {/* Recovery Confirmation Modal */}
      {showRecoveryModal && (
        <ConfirmRecoveryModal
          claim={claim}
          onClose={() => setShowRecoveryModal(false)}
          onSuccess={() => {
            setShowRecoveryModal(false);
            navigate("/recoveries/staff");
          }}
        />
      )}
    </div>
  );
}

export default ClaimDetails;
