import { useState, useCallback } from "react";
import { getFoundItems } from "../services/found-item.service";

export function useFoundItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFoundItems(params);
      setItems(data || []);
    } catch (err) {
      setError(err.message || "Failed to load found items.");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItemLocally = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { items, loading, error, fetchItems, removeItemLocally };
}
