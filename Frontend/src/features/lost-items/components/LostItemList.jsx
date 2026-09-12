import React from "react";
import { LostItemCard } from "./LostItemCard";
import { Search, Inbox } from "lucide-react";

/**
 * LostItemList — renders a grid of lost item cards with loading/empty states
 * Props:
 *   items: array of lost item objects
 *   loading: boolean
 *   showActions?: boolean
 *   onDelete?: (id) => void
 *   emptyMessage?: string
 *   emptySubMessage?: string
 */
export function LostItemList({
  items,
  loading,
  showActions = false,
  onDelete,
  emptyMessage = "No lost items found",
  emptySubMessage = "Try adjusting your filters or check back later.",
}) {
  if (loading) {
    return (
      <div className="lost-item-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="lost-item-skeleton">
            <div className="skeleton-image" />
            <div className="skeleton-body">
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line skeleton-meta" />
              <div className="skeleton-line skeleton-desc" />
              <div className="skeleton-line skeleton-desc short" />
              <div className="skeleton-footer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="lost-item-empty">
        <div className="lost-item-empty-icon">
          <Inbox size={48} />
        </div>
        <h3>{emptyMessage}</h3>
        <p>{emptySubMessage}</p>
      </div>
    );
  }

  return (
    <div className="lost-item-grid">
      {items.map((item) => (
        <LostItemCard
          key={item.id}
          item={item}
          showActions={showActions}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
