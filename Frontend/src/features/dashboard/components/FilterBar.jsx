import React from "react";
import { Filter, RotateCcw, ArrowUpDown, Tag, MapPin, Layers, Palette } from "lucide-react";
import { useDashboardItems } from "../hooks/useDashboardItems";
import Badge from "../../../components/ui/badge";

export const FilterBar = () => {
  const {
    items,
    rawLostCount,
    rawFoundCount,
    itemType,
    setItemType,
    category,
    setCategory,
    building,
    setBuilding,
    floor,
    setFloor,
    color,
    setColor,
    sortBy,
    setSortBy,
    resetFilters,
  } = useDashboardItems();

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "electronics", label: "Electronics" },
    { id: "wallet", label: "Wallets & Purses" },
    { id: "keys", label: "Keys & Chains" },
    { id: "idcard", label: "UIU ID Cards" },
    { id: "book", label: "Books & Notes" },
    { id: "accessories", label: "Accessories" },
    { id: "clothing", label: "Clothing & Bags" },
    { id: "bag", label: "Backpacks" },
    { id: "other", label: "Others" },
  ];

  const buildings = [
    { id: "all", label: "All Buildings" },
    { id: "Main Building", label: "Main Building" },
    { id: "Canteen", label: "Cafeteria / Canteen" },
    { id: "Library", label: "UIU Library" },
    { id: "Auditorium", label: "Auditorium" },
    { id: "Academic Building", label: "Academic Building" },
    { id: "Campus Ground", label: "Campus Plaza & Fields" },
    { id: "Gate 1", label: "Security Gate 1" },
    { id: "Gate 2", label: "Security Gate 2" },
  ];

  const floors = [
    { id: "all", label: "All Floors" },
    { id: "Ground Floor", label: "Ground Floor" },
    { id: "1", label: "1st Floor" },
    { id: "2", label: "2nd Floor" },
    { id: "3", label: "3rd Floor" },
    { id: "4", label: "4th Floor" },
    { id: "5", label: "5th Floor" },
    { id: "6", label: "6th Floor" },
    { id: "7", label: "7th Floor" },
    { id: "8", label: "8th Floor" },
    { id: "9", label: "9th Floor" },
    { id: "Basement", label: "Basement Parking" },
  ];

  const colors = [
    { id: "all", label: "All Colors" },
    { id: "black", label: "Black" },
    { id: "white", label: "White" },
    { id: "blue", label: "Blue" },
    { id: "red", label: "Red" },
    { id: "green", label: "Green" },
    { id: "silver", label: "Silver" },
    { id: "gold", label: "Gold" },
    { id: "brown", label: "Brown" },
    { id: "grey", label: "Grey" },
    { id: "yellow", label: "Yellow" },
  ];

  const hasActiveFilters =
    category !== "all" ||
    building !== "all" ||
    floor !== "all" ||
    color !== "all" ||
    itemType !== "all";

  return (
    <div className="feed-filter-bar">
      {/* Type Toggle Pills */}
      <div className="filter-type-pills">
        <button
          type="button"
          className={`type-pill ${itemType === "all" ? "active" : ""}`}
          onClick={() => setItemType("all")}
        >
          <span>All Items</span>
          <span className="type-count-badge">
            {rawLostCount + rawFoundCount}
          </span>
        </button>

        <button
          type="button"
          className={`type-pill type-pill-lost ${
            itemType === "lost" ? "active" : ""
          }`}
          onClick={() => setItemType("lost")}
        >
          <span>Lost Items</span>
          <span className="type-count-badge">{rawLostCount}</span>
        </button>

        <button
          type="button"
          className={`type-pill type-pill-found ${
            itemType === "found" ? "active" : ""
          }`}
          onClick={() => setItemType("found")}
        >
          <span>Found Items</span>
          <span className="type-count-badge">{rawFoundCount}</span>
        </button>
      </div>

      {/* Dropdown Filters Grid */}
      <div className="filter-dropdowns-row">
        {/* Category Selector */}
        <div className="select-wrapper">
          <Tag size={15} className="select-icon" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Building Selector */}
        <div className="select-wrapper">
          <MapPin size={15} className="select-icon" />
          <select
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            className="filter-select"
          >
            {buildings.map((bld) => (
              <option key={bld.id} value={bld.id}>
                {bld.label}
              </option>
            ))}
          </select>
        </div>

        {/* Floor Selector */}
        <div className="select-wrapper">
          <Layers size={15} className="select-icon" />
          <select
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="filter-select"
          >
            {floors.map((flr) => (
              <option key={flr.id} value={flr.id}>
                {flr.label}
              </option>
            ))}
          </select>
        </div>

        {/* Color Selector */}
        <div className="select-wrapper">
          <Palette size={15} className="select-icon" />
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="filter-select"
          >
            {colors.map((clr) => (
              <option key={clr.id} value={clr.id}>
                {clr.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="select-wrapper">
          <ArrowUpDown size={15} className="select-icon" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="reset-filters-btn"
            title="Reset All Filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Active Filter Badges Bar */}
      {hasActiveFilters && (
        <div className="active-filters-bar">
          <span className="active-filter-label">Active Filters:</span>
          {itemType !== "all" && (
            <Badge variant="primary">
              Type: {itemType.toUpperCase()}
            </Badge>
          )}
          {category !== "all" && (
            <Badge variant="outline">
              Category: {category}
            </Badge>
          )}
          {building !== "all" && (
            <Badge variant="outline">
              Building: {building}
            </Badge>
          )}
          {floor !== "all" && (
            <Badge variant="outline">
              Floor: {floor}
            </Badge>
          )}
          {color !== "all" && (
            <Badge variant="outline">
              Color: {color}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
