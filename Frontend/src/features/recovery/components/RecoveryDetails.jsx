import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  UserCheck,
  ShieldCheck,
  User,
  Mail,
  FileText,
  Building,
  Tag,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import RecoveryStatusBadge from "./RecoveryStatusBadge";
import { getFoundItemById } from "../../found-items/services/found-item.service";
import { getLostItemById } from "../../lost-items/services/lost-item.service";

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
 * RecoveryDetails — Full detail view of a completed item recovery
 * Props:
 *   recovery: object
 */
export function RecoveryDetails({ recovery }) {
  const navigate = useNavigate();

  const [foundItem, setFoundItem] = useState(null);
  const [lostItem, setLostItem] = useState(null);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadItemData() {
      if (!recovery) return;
      setLoadingItems(true);
      try {
        const [fRes, lRes] = await Promise.allSettled([
          recovery.foundItemId ? getFoundItemById(recovery.foundItemId) : null,
          recovery.lostItemId ? getLostItemById(recovery.lostItemId) : null,
        ]);

        if (mounted) {
          if (fRes.status === "fulfilled") setFoundItem(fRes.value);
          if (lRes.status === "fulfilled") setLostItem(lRes.value);
        }
      } catch (err) {
        // silent fallback
      } finally {
        if (mounted) setLoadingItems(false);
      }
    }

    loadItemData();
    return () => {
      mounted = false;
    };
  }, [recovery]);

  if (!recovery) return null;

  const foundImg = foundItem?.imageUrls?.[0] || null;
  const lostImg = lostItem?.imageUrls?.[0] || null;

  return (
    <div className="recovery-details-container">
      {/* Top Header */}
      <div className="recovery-details-top-nav">
        <button type="button" className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={18} /> Back
        </button>
        <RecoveryStatusBadge status={recovery.status} size="lg" />
      </div>

      <div className="recovery-details-grid">
        {/* Left Column: Handover Overview & Verifier Card */}
        <div className="recovery-overview-col">
          {/* Main Handover Status Banner */}
          <div className="handover-success-card">
            <div className="success-badge-circle">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="success-card-title">Physical Handover Completed</h3>
              <p className="success-card-desc">
                This lost item has been successfully returned to its verified owner at campus lost & found desk.
              </p>
            </div>
          </div>

          {/* Verification & Staff Custodian Metadata Card */}
          <div className="recovery-info-card">
            <h3 className="card-section-heading">Verification & Handover Record</h3>
            <div className="recovery-meta-rows">
              <div className="meta-row">
                <Clock size={15} />
                <span>
                  Handover Date: <strong>{formatDate(recovery.recoveredAt || recovery.createdAt)}</strong>
                </span>
              </div>
              <div className="meta-row">
                <UserCheck size={15} style={{ color: "#10b981" }} />
                <span>
                  Verified By Staff: <strong>{recovery.verifiedByName || "Campus Security Staff"}</strong>
                </span>
              </div>
              <div className="meta-row">
                <User size={15} />
                <span>
                  Recipient Student: <strong>{recovery.studentName || "UIU Student"}</strong>
                </span>
              </div>
              <div className="meta-row">
                <Mail size={15} />
                <span>
                  Student Email: <strong>{recovery.studentEmail}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Staff Handover Notes */}
          {recovery.notes && (
            <div className="recovery-info-card">
              <h3 className="card-section-heading">Staff Handover Notes</h3>
              <p className="handover-notes-text">"{recovery.notes}"</p>
            </div>
          )}
        </div>

        {/* Right Column: Recovered Items Summary */}
        <div className="recovery-items-col">
          {/* Found Item Card */}
          <div className="recovered-item-card">
            <div className="card-tag found">Found Item Turned In</div>
            <div className="recovered-item-body">
              {foundImg ? (
                <img src={foundImg} alt={foundItem?.title || "Found Item"} className="recovered-img" />
              ) : (
                <div className="no-img-box">No Image</div>
              )}
              <div className="recovered-info">
                <h4 className="recovered-title">{foundItem?.title || recovery.foundItemId}</h4>
                {foundItem?.category && (
                  <span className="summary-chip">
                    <Tag size={12} /> {foundItem.category}
                  </span>
                )}
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

          {/* Lost Item Card */}
          <div className="recovered-item-card">
            <div className="card-tag lost">Matched Lost Report</div>
            <div className="recovered-item-body">
              {lostImg ? (
                <img src={lostImg} alt={lostItem?.title || "Lost Item"} className="recovered-img" />
              ) : (
                <div className="no-img-box">No Image</div>
              )}
              <div className="recovered-info">
                <h4 className="recovered-title">{lostItem?.title || recovery.lostItemId}</h4>
                {lostItem?.category && (
                  <span className="summary-chip">
                    <Tag size={12} /> {lostItem.category}
                  </span>
                )}
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
      </div>
    </div>
  );
}

export default RecoveryDetails;
