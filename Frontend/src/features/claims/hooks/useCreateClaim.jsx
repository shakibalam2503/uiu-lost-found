import { useState, useCallback } from "react";
import { createClaim } from "../services/claim.service";

export function useCreateClaim() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [claim, setClaim] = useState(null);

  const submitClaim = useCallback(async ({ foundItemId, lostItemId, claimDetails }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!foundItemId || !lostItemId || !claimDetails?.trim()) {
        throw new Error("Found item, lost item, and claim details are required.");
      }

      const res = await createClaim({
        foundItemId,
        lostItemId,
        claimDetails: claimDetails.trim(),
      });
      setClaim(res);
      setSuccess(true);
      return res;
    } catch (err) {
      setError(err.message || "Failed to submit ownership claim.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setClaim(null);
  }, []);

  return {
    loading,
    error,
    success,
    claim,
    submitClaim,
    reset,
  };
}

export default useCreateClaim;
