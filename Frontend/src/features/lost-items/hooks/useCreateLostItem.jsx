import { useState, useCallback } from "react";
import { createLostItem } from "../services/lost-item.service";

/**
 * Hook for creating a new lost item report
 * Handles multipart/form-data submission with image
 */
export function useCreateLostItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [createdItem, setCreatedItem] = useState(null);

  const submitLostItem = useCallback(async (fields, imageFile) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setCreatedItem(null);

    try {
      // Build multipart form data
      const formData = new FormData();
      formData.append("title", fields.title);
      formData.append("description", fields.description || "");
      formData.append("category", fields.category);
      formData.append("color", fields.color || "");
      formData.append("lostDate", fields.lostDate || "");
      formData.append("building", fields.building || "");
      formData.append("floor", fields.floor || "");
      formData.append("locationDescription", fields.locationDescription || "");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const item = await createLostItem(formData);
      setCreatedItem(item);
      setSuccess(true);
      return item;
    } catch (err) {
      console.error("useCreateLostItem error:", err);
      setError(err.message || "Failed to report lost item.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setCreatedItem(null);
  }, []);

  return {
    loading,
    error,
    success,
    createdItem,
    submitLostItem,
    reset,
  };
}
