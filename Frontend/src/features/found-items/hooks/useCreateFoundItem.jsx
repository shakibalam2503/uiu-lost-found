import { useState, useCallback } from "react";
import { createFoundItem } from "../services/found-item.service";

export function useCreateFoundItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [createdItem, setCreatedItem] = useState(null);

  const submitFoundItem = useCallback(async (fields, imageFile) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setCreatedItem(null);

    try {
      const formData = new FormData();
      formData.append("title", fields.title);
      formData.append("description", fields.description || "");
      formData.append("category", fields.category);
      formData.append("color", fields.color || "");
      formData.append("foundDate", fields.foundDate || "");
      formData.append("building", fields.building || "");
      formData.append("floor", fields.floor || "");
      formData.append("locationDescription", fields.locationDescription || "");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const item = await createFoundItem(formData);
      setCreatedItem(item);
      setSuccess(true);
      return item;
    } catch (err) {
      setError(err.message || "Failed to register found item.");
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

  return { loading, error, success, createdItem, submitFoundItem, reset };
}
