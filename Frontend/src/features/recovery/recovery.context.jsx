import React, { createContext, useState, useCallback, useContext } from "react";
import { getMyRecoveries, getRecoveries } from "./services/recovery.service";

export const RecoveryContext = createContext(null);

export const RecoveryProvider = ({ children }) => {
  const [myRecoveries, setMyRecoveries] = useState([]);
  const [allRecoveries, setAllRecoveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyRecoveries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyRecoveries();
      setMyRecoveries(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch your recovery records.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllRecoveries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecoveries();
      setAllRecoveries(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch campus recovery log.");
    } finally {
      setLoading(false);
    }
  }, []);

  const addRecovery = useCallback((newRec) => {
    setMyRecoveries((prev) => [newRec, ...prev]);
    setAllRecoveries((prev) => [newRec, ...prev]);
  }, []);

  const value = {
    myRecoveries,
    allRecoveries,
    loading,
    error,
    loadMyRecoveries: fetchMyRecoveries,
    loadAllRecoveries: fetchAllRecoveries,
    addRecovery,
  };

  return <RecoveryContext.Provider value={value}>{children}</RecoveryContext.Provider>;
};

export const useRecoveryContext = () => {
  const ctx = useContext(RecoveryContext);
  if (!ctx) throw new Error("useRecoveryContext must be used within a RecoveryProvider");
  return ctx;
};

export default RecoveryContext;
