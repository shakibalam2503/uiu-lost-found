import React from "react";
import { Search, X } from "lucide-react";
import { useDashboardItems } from "../hooks/useDashboardItems";

export const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useDashboardItems();

  return (
    <div className="feed-search-container">
      <div className="feed-search-input-wrapper">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search items by title, description, building, CSE dept, or reporter name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="feed-search-input"
        />
        {searchTerm && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => setSearchTerm("")}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
