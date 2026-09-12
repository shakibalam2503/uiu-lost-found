import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { fetchLostItems, fetchFoundItems } from "./services/dashboard.service";

export const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [itemType, setItemType] = useState("all"); // "all" | "lost" | "found"
  const [category, setCategory] = useState("all");
  const [building, setBuilding] = useState("all");
  const [floor, setFloor] = useState("all");
  const [color, setColor] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "oldest"

  /**
   * Fetch item feeds from backend API
   */
  const loadFeedData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        limit: 50,
        category,
        building,
        floor,
        color,
      };

      const promises = [];
      if (itemType === "all" || itemType === "lost") {
        promises.push(fetchLostItems(params));
      } else {
        promises.push(Promise.resolve([]));
      }

      if (itemType === "all" || itemType === "found") {
        promises.push(fetchFoundItems(params));
      } else {
        promises.push(Promise.resolve([]));
      }

      const [lostResult, foundResult] = await Promise.all(promises);
      setLostItems(lostResult || []);
      setFoundItems(foundResult || []);
    } catch (err) {
      console.error("Dashboard feed fetch error:", err);
      setError(err.message || "Failed to load campus feed items.");
    } finally {
      setLoading(false);
    }
  }, [itemType, category, building, floor, color]);

  useEffect(() => {
    loadFeedData();
  }, [loadFeedData]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setItemType("all");
    setCategory("all");
    setBuilding("all");
    setFloor("all");
    setColor("all");
    setSortBy("newest");
  }, []);

  // Combine and filter items
  const filteredItems = useMemo(() => {
    let combined = [];

    if (itemType === "all") {
      combined = [...lostItems, ...foundItems];
    } else if (itemType === "lost") {
      combined = [...lostItems];
    } else {
      combined = [...foundItems];
    }

    // Search term filtering
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      combined = combined.filter((item) => {
        const titleMatch = item.title?.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        const locMatch = item.locationDescription?.toLowerCase().includes(query);
        const bldMatch = item.building?.toLowerCase().includes(query);
        const reporterMatch = item.reporterName?.toLowerCase().includes(query);
        const catMatch = item.category?.toLowerCase().includes(query);

        return titleMatch || descMatch || locMatch || bldMatch || reporterMatch || catMatch;
      });
    }

    // Sort by date
    combined.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return combined;
  }, [lostItems, foundItems, itemType, searchTerm, sortBy]);

  const value = {
    items: filteredItems,
    rawLostCount: lostItems.length,
    rawFoundCount: foundItems.length,
    loading,
    error,
    refetch: loadFeedData,

    // Filter states & setters
    searchTerm,
    setSearchTerm,
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
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
