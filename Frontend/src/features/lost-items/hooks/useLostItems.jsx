import { useState, useCallback } from "react";
import { getLostItems } from "../services/lost-item.service";

/**
 * Hook for fetching and filtering lost items feed
 */
export function useLostItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLostItems(params);
      setItems(data || []);
    } catch (err) {
      console.error("useLostItems fetch error:", err);
      setError(err.message || "Failed to load lost items.");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItemLocally = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    removeItemLocally,
  };
}
