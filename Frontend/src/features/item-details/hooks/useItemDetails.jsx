import { useState, useEffect, useCallback } from "react";
import { getItemDetails, updateItemDetails, deleteItemDetails } from "../services/item-details.service";

export function useItemDetails(itemType, id) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItem = useCallback(async () => {
    if (!id || !itemType) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getItemDetails(itemType, id);
      setItem(data);
    } catch (err) {
      setError(err.message || `Failed to load ${itemType} item details.`);
    } finally {
      setLoading(false);
    }
  }, [itemType, id]);

  useEffect(() => {
    let isMounted = true;
    fetchItem();
    return () => {
      isMounted = false;
    };
  }, [fetchItem]);

  const setStatus = useCallback(
    async (newStatus) => {
      if (!item || !id) return;
      try {
        const updated = await updateItemDetails(itemType, id, { status: newStatus });
        setItem((prev) => ({ ...prev, ...updated }));
        return updated;
      } catch (err) {
        throw err;
      }
    },
    [itemType, id, item]
  );

  const deleteItem = useCallback(async () => {
    if (!id || !itemType) return;
    await deleteItemDetails(itemType, id);
  }, [itemType, id]);

  return {
    item,
    loading,
    error,
    refetch: fetchItem,
    setStatus,
    deleteItem,
  };
}

export default useItemDetails;
