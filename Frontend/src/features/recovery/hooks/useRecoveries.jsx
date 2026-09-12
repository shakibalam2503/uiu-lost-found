import { useState, useCallback } from "react";
import { getMyRecoveries, getRecoveries, getRecoveryById } from "../services/recovery.service";

export function useRecoveries() {
  const [recoveries, setRecoveries] = useState([]);
  const [currentRecovery, setCurrentRecovery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyRecoveries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyRecoveries();
      setRecoveries(data || []);
    } catch (err) {
      setError(err.message || "Failed to load your recovery records.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllRecoveries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecoveries();
      setRecoveries(data || []);
    } catch (err) {
      setError(err.message || "Failed to load campus recovery log.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecoveryById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecoveryById(id);
      setCurrentRecovery(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to load recovery details.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    recoveries,
    currentRecovery,
    loading,
    error,
    fetchMyRecoveries,
    fetchAllRecoveries,
    fetchRecoveryById,
  };
}

export default useRecoveries;
