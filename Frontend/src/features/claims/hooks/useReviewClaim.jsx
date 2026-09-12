import { useState, useCallback } from "react";
import { updateClaimStatus } from "../services/claim.service";

export function useReviewClaim() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatedClaim, setUpdatedClaim] = useState(null);

  const reviewClaim = useCallback(async (claimId, { status, staffNote }) => {
    setLoading(true);
    setError(null);

    try {
      if (!["approved", "rejected"].includes(status)) {
        throw new Error("Invalid review status. Must be 'approved' or 'rejected'.");
      }

      const res = await updateClaimStatus(claimId, {
        status,
        staffNote: staffNote ? staffNote.trim() : null,
      });

      setUpdatedClaim(res);
      return res;
    } catch (err) {
      setError(err.message || `Failed to ${status} claim.`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    updatedClaim,
    reviewClaim,
  };
}

export default useReviewClaim;
