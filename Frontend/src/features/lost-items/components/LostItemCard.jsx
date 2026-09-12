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

/**
 * LostItemCard — card shown in the feed and "My Items" list
 * Props:
 *   item: lost item object
 *   showActions?: boolean — show edit/delete buttons (for owner)
 *   onDelete?: (id) => void
 */
export function LostItemCard({ item, showActions = false, onDelete }) {
  const navigate = useNavigate();

  const imageUrl = item.imageUrls?.[0] || null;

  const handleView = () => navigate(`/lost-items/${item.id}`);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    if (onDelete) onDelete(item.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/lost-items/${item.id}/edit`);
  };

  return (
    <div className="lost-item-card" onClick={handleView} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleView()}
    >
      {/* Image */}
      <div className="lost-item-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={item.title} loading="lazy" />
        ) : (
          <div className="lost-item-card-no-image">
            <Tag size={32} />
          </div>
        )}
        {/* Status badge */}
        <span className={`lost-item-status-badge status-${item.status || "lost"}`}>
          {item.status === "returned" ? "Returned" : item.status === "matched" ? "Matched" : "Lost"}
        </span>
      </div>

      {/* Content */}
      <div className="lost-item-card-body">
        <h3 className="lost-item-card-title">{item.title}</h3>

        <div className="lost-item-card-meta">
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
          <p className="lost-item-card-desc">{item.description}</p>
        )}

        <div className="lost-item-card-location">
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

        <div className="lost-item-card-footer">
          <span className="lost-item-card-date">
            <Clock size={12} />
            {formatDate(item.date || item.lostDate || item.createdAt)}
          </span>

          <div className="lost-item-card-actions">
            {showActions && (
              <>
                <button
                  className="icon-btn icon-btn-edit"
                  onClick={handleEdit}
                  title="Edit"
                  aria-label="Edit item"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  className="icon-btn icon-btn-delete"
                  onClick={handleDelete}
                  title="Delete"
                  aria-label="Delete item"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
            <button className="btn-view-details" onClick={handleView}>
              <Eye size={14} /> View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
