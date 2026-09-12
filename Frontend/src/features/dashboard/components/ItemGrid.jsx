import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { useDashboardItems } from "../hooks/useDashboardItems";
import ItemCard from "./ItemCard";
import EmptyFeed from "./EmptyFeed";
import Button from "../../../components/ui/button";

export const ItemGrid = ({ onItemClick, onReportClick }) => {
  const { items, loading, error, refetch } = useDashboardItems();

  // Loading Skeletons
  if (loading) {
    return (
      <div className="feed-grid">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="skeleton-card">
            <div className="skeleton-media pulse" />
            <div className="skeleton-body">
              <div className="skeleton-line skeleton-title pulse" />
              <div className="skeleton-line skeleton-desc pulse" />
              <div className="skeleton-line skeleton-meta pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // API Error State
  if (error) {
    return (
      <div className="feed-error-box">
        <div className="error-icon-box">
          <AlertCircle size={32} />
        </div>
        <h4 className="error-title">Unable to Load Feed Data</h4>
        <p className="error-message">{error}</p>
        <Button variant="primary" size="md" onClick={refetch}>
          <RotateCcw size={16} />
          <span>Retry Connection</span>
        </Button>
      </div>
    );
  }

  // Empty State
  if (!items || items.length === 0) {
    return <EmptyFeed onReportItem={onReportClick} />;
  }

  return (
    <div className="feed-grid">
      {items.map((item) => (
        <ItemCard
          key={`${item.type}-${item.id}`}
          item={item}
          onClick={() => onItemClick && onItemClick(item)}
        />
      ))}
    </div>
  );
};

export default ItemGrid;
