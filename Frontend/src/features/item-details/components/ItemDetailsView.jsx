import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  Palette,
  Building,
  Layers,
  Clock,
  CheckCircle2,
  Edit2,
  Trash2,
  CheckSquare,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import ItemImageGallery from "./ItemImageGallery";
import ItemReporterCard from "./ItemReporterCard";
import ClaimItemModal from "./ClaimItemModal";
import { AuthContext } from "../../auth/auth.context";

function formatDate(dateStr) {
  if (!dateStr) return "Unspecified Date";
  try {
    let d = dateStr;
    if (typeof dateStr === "object" && dateStr._seconds) {
      d = new Date(dateStr._seconds * 1000);
    } else {
      d = new Date(dateStr);
    }
    if (isNaN(d.getTime())) return "Unspecified Date";

    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Unspecified Date";
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return "Recently";
  try {
    let d = dateStr;
    if (typeof dateStr === "object" && dateStr._seconds) {
      d = new Date(dateStr._seconds * 1000);
    } else {
      d = new Date(dateStr);
    }
    if (isNaN(d.getTime())) return "Recently";

    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Recently";
  }
}

const STATUS_CONFIG = {
  lost: { label: "Lost", cls: "status-lost" },
  found: { label: "Found / Available", cls: "status-found" },
  matched: { label: "Match Pending", cls: "status-matched" },
  claimed: { label: "Claim Submitted", cls: "status-matched" },
  returned: { label: "Returned to Owner", cls: "status-returned" },
};

/**
 * Reusable ItemDetailsView component — supports both Lost and Found items
 * Props:
 *   item: object
 *   itemType: "lost" | "found"
 *   onDelete?: () => void
 *   onStatusChange?: (newStatus) => void
 */
export function ItemDetailsView({ item, itemType = "lost", onDelete, onStatusChange }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  if (!item) return null;

  const isFound = itemType === "found";
  const userRole = user?.role?.toLowerCase();
  const isStudentOrFaculty = userRole === "student" || userRole === "faculty";
  const isStaffOrAdmin = userRole === "staff" || userRole === "admin";

  const isOwner = user && (item.reportedBy === user.uid || item.registeredBy === user.uid);
  const canEdit = isOwner || isStaffOrAdmin;

  const statusInfo = STATUS_CONFIG[item.status] || (isFound ? STATUS_CONFIG.found : STATUS_CONFIG.lost);
  const images = item.imageUrls || [];

  const handleMarkReturned = async () => {
    if (!window.confirm("Mark this item as returned to its rightful owner?")) return;
    setUpdating(true);
    try {
      if (onStatusChange) {
        await onStatusChange("returned");
      }
    } catch (err) {
      alert(err.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="item-details-container">
      {/* Back Header */}
      <div className="item-details-top-nav">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="item-type-pill">
          <span className={`pill-type-tag ${itemType}`}>
            {isFound ? "Found Item Record" : "Lost Item Report"}
          </span>
        </div>
      </div>

      <div className="item-details-grid">
        {/* LEFT COLUMN: Large Image Gallery */}
        <div className="item-details-left">
          <ItemImageGallery
            imageUrls={images}
            title={item.title}
            statusBadge={
              <span className={`detail-status-badge ${statusInfo.cls}`}>
                {statusInfo.label}
              </span>
            }
          />
        </div>

        {/* RIGHT COLUMN: Details & Metadata */}
        <div className="item-details-right">
          {/* Header Title & Chips */}
          <div className="item-header-block">
            <h1 className="item-main-title">{item.title}</h1>
            <div className="item-chips-row">
              {item.category && (
                <span className="item-chip">
                  <Tag size={13} /> {item.category}
                </span>
              )}
              {item.color && (
                <span className="item-chip">
                  <Palette size={13} /> {item.color}
                </span>
              )}
            </div>
          </div>

          {/* Detailed Description */}
          {item.description && (
            <div className="item-section">
              <h3 className="section-heading">Description</h3>
              <p className="item-description-text">{item.description}</p>
            </div>
          )}

          {/* Location Information */}
          <div className="item-section">
            <h3 className="section-heading">Location Details</h3>
            <div className="info-pairs-grid">
              {item.building && (
                <div className="info-pair-row">
                  <Building size={15} />
                  <span>Building: <strong>{item.building}</strong></span>
                </div>
              )}
              {item.floor && (
                <div className="info-pair-row">
                  <Layers size={15} />
                  <span>Floor: <strong>{item.floor}</strong></span>
                </div>
              )}
              {item.locationDescription && (
                <div className="info-pair-row">
                  <MapPin size={15} />
                  <span>Exact Spot: <strong>{item.locationDescription}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Date & Time Log */}
          <div className="item-section">
            <h3 className="section-heading">Timeline</h3>
            <div className="info-pairs-grid">
              <div className="info-pair-row">
                <Calendar size={15} />
                <span>
                  {isFound ? "Found Date:" : "Lost Date:"}{" "}
                  <strong>{formatDate(item.lostDate || item.foundDate || item.date)}</strong>
                </span>
              </div>
              <div className="info-pair-row">
                <Clock size={15} />
                <span>
                  Logged On: <strong>{formatDateTime(item.createdAt)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Safe Privacy-Preserving Reporter Information */}
          <div className="item-section">
            <h3 className="section-heading">
              {isFound ? "Registered By Custodian" : "Reported By Member"}
            </h3>
            <ItemReporterCard
              name={item.reporterName || item.registeredByName}
              email={item.reporterEmail || item.registeredByEmail}
              role={item.reporterRole || (isFound ? "staff" : "student")}
              itemType={itemType}
            />
          </div>

          {/* Action Row */}
          <div className="item-actions-footer">
            {/* Found Item + Student/Faculty -> Claim Button */}
            {isFound && isStudentOrFaculty && item.status !== "returned" && (
              <button
                type="button"
                className="btn-primary btn-lg full-width"
                onClick={() => setShowClaimModal(true)}
              >
                <CheckSquare size={18} /> Claim This Item
              </button>
            )}

            {/* Owner or Staff/Admin Action Controls */}
            {canEdit && (
              <div className="owner-action-buttons">
                {item.status !== "returned" && (
                  <button
                    type="button"
                    className="btn-success"
                    onClick={handleMarkReturned}
                    disabled={updating}
                  >
                    <CheckCircle2 size={16} />
                    {updating ? "Updating..." : "Mark as Returned"}
                  </button>
                )}
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() =>
                    navigate(isFound ? `/found-items/${item.id}/edit` : `/lost-items/${item.id}/edit`)
                  }
                >
                  <Edit2 size={16} /> Edit Details
                </button>
                {onDelete && (
                  <button type="button" className="btn-danger" onClick={onDelete}>
                    <Trash2 size={16} /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <ClaimItemModal
          foundItem={item}
          onClose={() => setShowClaimModal(false)}
        />
      )}
    </div>
  );
}

export default ItemDetailsView;
