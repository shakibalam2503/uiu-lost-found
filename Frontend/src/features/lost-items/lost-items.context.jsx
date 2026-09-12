import React, { createContext, useState, useCallback, useMemo, useContext } from "react";
import { getLostItems, getMyLostItems, deleteLostItem } from "./services/lost-item.service";

export const LostItemsContext = createContext(null);

export const LostItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myItemsLoading, setMyItemsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [color, setColor] = useState("all");
  const [building, setBuilding] = useState("all");
  const [floor, setFloor] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  /**
   * Load all lost items (public feed)
   */
  const loadItems = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLostItems({
        limit: 50,
        category: params.category || category,
        color: params.color || color,
        building: params.building || building,
        floor: params.floor || floor,
      });
      setItems(data || []);
    } catch (err) {
      console.error("Load lost items error:", err);
      setError(err.message || "Failed to load lost items.");
    } finally {
      setLoading(false);
    }
  }, [category, color, building, floor]);

  /**
   * Load current user's lost items
   */
  const loadMyItems = useCallback(async () => {
    setMyItemsLoading(true);
    setError(null);
    try {
      const data = await getMyLostItems({ limit: 50 });
      setMyItems(data || []);
    } catch (err) {
      console.error("Load my lost items error:", err);
      setError(err.message || "Failed to load your lost items.");
    } finally {
      setMyItemsLoading(false);
    }
  }, []);

  /**
   * Remove a deleted item from local state
   */
  const removeItem = useCallback(async (id) => {
    await deleteLostItem(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    setMyItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  /**
   * Add newly created item to local state
   */
  const addItem = useCallback((newItem) => {
    const mapped = { ...newItem, type: "lost", date: newItem.lostDate || newItem.createdAt };
    setItems((prev) => [mapped, ...prev]);
    setMyItems((prev) => [mapped, ...prev]);
  }, []);

  /**
   * Replace an updated item in local state
   */
  const replaceItem = useCallback((updatedItem) => {
    const mapped = { ...updatedItem, type: "lost", date: updatedItem.lostDate || updatedItem.createdAt };
    setItems((prev) => prev.map((item) => (item.id === mapped.id ? mapped : item)));
    setMyItems((prev) => prev.map((item) => (item.id === mapped.id ? mapped : item)));
  }, []);

  // Filtered items for public feed
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.building?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.color?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const da = new Date(a.createdAt || a.date || 0).getTime();
      const db = new Date(b.createdAt || b.date || 0).getTime();
      return sortBy === "newest" ? db - da : da - db;
    });

    return result;
  }, [items, searchTerm, sortBy]);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setCategory("all");
    setColor("all");
    setBuilding("all");
    setFloor("all");
    setSortBy("newest");
  }, []);

  const value = {
    items: filteredItems,
    rawItems: items,
    myItems,
    loading,
    myItemsLoading,
    error,
    searchTerm, setSearchTerm,
    category, setCategory,
    color, setColor,
    building, setBuilding,
    floor, setFloor,
    sortBy, setSortBy,
    resetFilters,
    loadItems,
    loadMyItems,
    removeItem,
    addItem,
    replaceItem,
  };

  return <LostItemsContext.Provider value={value}>{children}</LostItemsContext.Provider>;
};

export const useLostItemsContext = () => {
  const ctx = useContext(LostItemsContext);
  if (!ctx) throw new Error("useLostItemsContext must be used within LostItemsProvider");
  return ctx;
};
