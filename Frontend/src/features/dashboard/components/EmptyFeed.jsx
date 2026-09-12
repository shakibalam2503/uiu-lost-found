import React from "react";
import { SearchX, RotateCcw, PlusCircle } from "lucide-react";
import Button from "../../../components/ui/button";
import { useDashboardItems } from "../hooks/useDashboardItems";

export const EmptyFeed = ({ onReportItem }) => {
  const { resetFilters, searchTerm } = useDashboardItems();

  return (
    <div className="empty-feed-card">
      <div className="empty-icon-box">
        <SearchX size={36} />
      </div>

      <h3 className="empty-feed-title">No Matching Campus Items Found</h3>

      <p className="empty-feed-desc">
        {searchTerm
          ? `We couldn't find any lost or found items matching "${searchTerm}". Try checking your spelling or clearing filters.`
          : "There are currently no items matching your filter criteria. Try resetting your active filters or be the first to report an item."}
      </p>

      <div className="empty-feed-actions">
        <Button variant="outline" size="md" onClick={resetFilters}>
          <RotateCcw size={16} />
          <span>Reset Filters</span>
        </Button>

        {onReportItem && (
          <Button variant="primary" size="md" onClick={onReportItem}>
            <PlusCircle size={16} />
            <span>Report Item</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyFeed;
