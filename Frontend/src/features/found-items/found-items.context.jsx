import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";
import {
  getFoundItems,
  deleteFoundItem,
} from "./services/found-item.service";

export const FoundItemsContext = createContext(null);

export const FoundItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [color, setColor] = useState("all");
  const [building, setBuilding] = useState("all");
  const [floor, setFloor] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const loadItems = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFoundItems({
          limit: 50,
          category: params.category ?? category,
          color: params.color ?? color,
          building: params.building ?? building,
          floor: params.floor ?? floor,
        });
        setItems(data || []);
      } catch (err) {
        console.error("Load found items error:", err);
        setError(err.message || "Failed to load found items.");
      } finally {
        setLoading(false);
      }
    },
    [category, color, building, floor]
  );

  const removeItem = useCallback(async (id) => {
    await deleteFoundItem(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addItem = useCallback((newItem) => {
    const mapped = {
      ...newItem,
      type: "found",
      date: newItem.foundDate || newItem.createdAt,
    };
    setItems((prev) => [mapped, ...prev]);
  }, []);

  const replaceItem = useCallback((updatedItem) => {
    const mapped = {
      ...updatedItem,
      type: "found",
      date: updatedItem.foundDate || updatedItem.createdAt,
    };
    setItems((prev) =>
      prev.map((item) => (item.id === mapped.id ? mapped : item))
    );
  }, []);

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
    loading,
    error,
    searchTerm, setSearchTerm,
    category, setCategory,
    color, setColor,
    building, setBuilding,
    floor, setFloor,
    sortBy, setSortBy,
    resetFilters,
    loadItems,
    removeItem,
    addItem,
    replaceItem,
  };

  return (
    <FoundItemsContext.Provider value={value}>
      {children}
    </FoundItemsContext.Provider>
  );
};

export const useFoundItemsContext = () => {
  const ctx = useContext(FoundItemsContext);
  if (!ctx)
    throw new Error(
      "useFoundItemsContext must be used within FoundItemsProvider"
    );
  return ctx;
};
