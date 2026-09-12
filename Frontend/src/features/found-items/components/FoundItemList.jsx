import React from "react";
import { FoundItemCard } from "./FoundItemCard";
import { Inbox } from "lucide-react";

/**
 * FoundItemList — responsive grid with skeleton loading and empty state
 * Props:
 *   items, loading, isStaff, canClaim, onDelete
 *   emptyMessage?, emptySubMessage?
 */
export function FoundItemList({
  items,
  loading,
  isStaff = false,
  canClaim = false,
  onDelete,
  emptyMessage = "No found items",
  emptySubMessage = "Check back later or adjust your filters.",
}) {
  if (loading) {
    return (
      <div className="found-item-grid">
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
    <div className="found-item-grid">
      {items.map((item) => (
        <FoundItemCard
          key={item.id}
          item={item}
          isStaff={isStaff}
          canClaim={canClaim}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
