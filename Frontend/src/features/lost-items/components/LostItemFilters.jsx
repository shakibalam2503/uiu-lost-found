import React from "react";
import { Tag, Palette, Building, Layers, RotateCcw, SlidersHorizontal } from "lucide-react";

const CATEGORIES = [
  "all",
  "Electronics",
  "Books & Stationery",
  "Clothing & Accessories",
  "ID & Cards",
  "Keys",
  "Bags",
  "Jewelry",
  "Sports Equipment",
  "Other",
];

const COLORS = [
  "all",
  "Black",
  "White",
  "Gray",
  "Brown",
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Purple",
  "Pink",
  "Multicolor",
  "Other",
];

const BUILDINGS = [
  "all",
  "Academic Building 1 (AB1)",
  "Academic Building 2 (AB2)",
  "Academic Building 3 (AB3)",
  "Library",
  "Student Center",
  "Cafeteria",
  "Sports Complex",
  "Administration Building",
  "Other",
];

const FLOORS = ["all", "Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor", "Rooftop"];

/**
 * LostItemFilters — filter bar for the lost items list
 * Props:
 *   category, setCategory, color, setColor, building, setBuilding, floor, setFloor
 *   sortBy, setSortBy, onReset
 */
export function LostItemFilters({
  category, setCategory,
  color, setColor,
  building, setBuilding,
  floor, setFloor,
  sortBy, setSortBy,
  onReset,
}) {
  const isFiltered =
    category !== "all" ||
    color !== "all" ||
    building !== "all" ||
    floor !== "all";

  return (
    <div className="lost-item-filters">
      <div className="filter-row">
        <div className="filter-label">
          <SlidersHorizontal size={15} /> Filters
        </div>

        {/* Category */}
        <div className="filter-group">
          <label htmlFor="filter-category">
            <Tag size={13} /> Category
          </label>
          <select
            id="filter-category"
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div className="filter-group">
          <label htmlFor="filter-color">
            <Palette size={13} /> Color
          </label>
          <select
            id="filter-color"
            className="filter-select"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Colors" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Building */}
        <div className="filter-group">
          <label htmlFor="filter-building">
            <Building size={13} /> Building
          </label>
          <select
            id="filter-building"
            className="filter-select"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
          >
            {BUILDINGS.map((b) => (
              <option key={b} value={b}>
                {b === "all" ? "All Buildings" : b}
              </option>
            ))}
          </select>
        </div>

        {/* Floor */}
        <div className="filter-group">
          <label htmlFor="filter-floor">
            <Layers size={13} /> Floor
          </label>
          <select
            id="filter-floor"
            className="filter-select"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
          >
            {FLOORS.map((f) => (
              <option key={f} value={f}>
                {f === "all" ? "All Floors" : f}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="filter-group">
          <label htmlFor="filter-sort">Sort By</label>
          <select
            id="filter-sort"
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Reset */}
        {isFiltered && (
          <button className="filter-reset-btn" onClick={onReset} title="Clear all filters">
            <RotateCcw size={14} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
