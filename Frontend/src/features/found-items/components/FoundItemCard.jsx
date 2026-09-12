import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Tag,
  Palette,
  Building,
  Layers,
  Eye,
  Trash2,
  Edit2,
  Clock,
  CheckSquare,
} from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "Unknown date";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const STATUS_STYLES = {
  found: { label: "Found", cls: "found-status-found" },
  claimed: { label: "Claimed", cls: "found-status-claimed" },
  returned: { label: "Returned", cls: "found-status-returned" },
};

/**
 * FoundItemCard
 * Props:
 *   item            — found item object
 *   isStaff         — show edit/delete actions
 *   canClaim        — show "Claim This Item" button (student/faculty)
 *   onDelete?       — (id) => void
 */
export function FoundItemCard({ item, isStaff = false, canClaim = false, onDelete }) {
  const navigate = useNavigate();
  const imageUrl = item.imageUrls?.[0] || null;
  const statusInfo = STATUS_STYLES[item.status] || STATUS_STYLES.found;

  const handleView = () => navigate(`/found-items/${item.id}`);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this found item record?")) return;
    if (onDelete) onDelete(item.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/found-items/${item.id}/edit`);
  };

  return (
    <div
      className="found-item-card"
      onClick={handleView}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleView()}
    >
      {/* Image */}
      <div className="found-item-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={item.title} loading="lazy" />
        ) : (
          <div className="found-item-card-no-image">
            <Tag size={32} />
          </div>
        )}
        <span className={`found-item-badge ${statusInfo.cls}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Body */}
      <div className="found-item-card-body">
        <h3 className="found-item-card-title">{item.title}</h3>

        <div className="found-item-card-meta">
          {item.category && (
            <span className="meta-chip">
              <Tag size={12} /> {item.category}
            </span>
          )}
          {item.color && (
            <span className="meta-chip">
              <Palette size={12} /> {item.color}
            </span>
          )}
        </div>

        {item.description && (
          <p className="found-item-card-desc">{item.description}</p>
        )}

        <div className="found-item-card-location">
          {item.building && (
            <span>
              <Building size={13} /> {item.building}
            </span>
          )}
          {item.floor && (
            <span>
              <Layers size={13} /> {item.floor}
            </span>
          )}
        </div>

        <div className="found-item-card-footer">
          <span className="found-item-card-date">
            <Clock size={12} />
            {formatDate(item.date || item.foundDate || item.createdAt)}
          </span>

          <div className="found-item-card-actions">
            {isStaff && (
              <>
                <button
                  className="icon-btn icon-btn-edit"
                  onClick={handleEdit}
                  title="Edit"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  className="icon-btn icon-btn-delete"
                  onClick={handleDelete}
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
            {canClaim && item.status === "found" && (
              <button
                className="btn-claim"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/found-items/${item.id}`);
                }}
              >
                <CheckSquare size={14} /> Claim
              </button>
            )}
            <button className="btn-view-details" onClick={handleView}>
              <Eye size={14} /> View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
