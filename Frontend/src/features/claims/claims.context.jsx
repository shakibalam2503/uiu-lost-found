import React, { createContext, useState, useCallback, useMemo, useContext } from "react";
import { getMyClaims, getClaims } from "./services/claim.service";

export const ClaimsContext = createContext(null);

export const ClaimsProvider = ({ children }) => {
  const [myClaims, setMyClaims] = useState([]);
  const [allClaims, setAllClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchMyClaims = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyClaims();
      setMyClaims(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch your claims.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllClaims = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClaims();
      setAllClaims(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch claims directory.");
    } finally {
      setLoading(false);
    }
  }, []);

  const addClaim = useCallback((claim) => {
    setMyClaims((prev) => [claim, ...prev]);
    setAllClaims((prev) => [claim, ...prev]);
  }, []);

  const updateClaimInState = useCallback((updatedClaim) => {
    setMyClaims((prev) => prev.map((c) => (c.id === updatedClaim.id ? updatedClaim : c)));
    setAllClaims((prev) => prev.map((c) => (c.id === updatedClaim.id ? updatedClaim : c)));
  }, []);

  const filteredMyClaims = useMemo(() => {
    if (statusFilter === "all") return myClaims;
    return myClaims.filter((c) => c.status === statusFilter);
  }, [myClaims, statusFilter]);

  const filteredAllClaims = useMemo(() => {
    if (statusFilter === "all") return allClaims;
    return allClaims.filter((c) => c.status === statusFilter);
  }, [allClaims, statusFilter]);

  const value = {
    myClaims: filteredMyClaims,
    rawMyClaims: myClaims,
    allClaims: filteredAllClaims,
    rawAllClaims: allClaims,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    loadMyClaims: fetchMyClaims,
    loadAllClaims: fetchAllClaims,
    addClaim,
    updateClaimInState,
  };

  return <ClaimsContext.Provider value={value}>{children}</ClaimsContext.Provider>;
};

export const useClaimsContext = () => {
  const ctx = useContext(ClaimsContext);
  if (!ctx) throw new Error("useClaimsContext must be used within a ClaimsProvider");
  return ctx;
};

export default ClaimsContext;
