import { useState, useCallback } from "react";
import { getMyClaims, getClaims, getClaimById } from "../services/claim.service";

export function useClaims() {
  const [claims, setClaims] = useState([]);
  const [currentClaim, setCurrentClaim] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyClaims = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyClaims();
      setClaims(data || []);
    } catch (err) {
      setError(err.message || "Failed to load your claims.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllClaims = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClaims();
      setClaims(data || []);
    } catch (err) {
      setError(err.message || "Failed to load claims queue.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClaimById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClaimById(id);
      setCurrentClaim(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to load claim details.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    claims,
    currentClaim,
    loading,
    error,
    fetchMyClaims,
    fetchAllClaims,
    fetchClaimById,
  };
}

export default useClaims;
