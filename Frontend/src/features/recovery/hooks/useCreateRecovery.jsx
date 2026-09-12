import { useState, useCallback } from "react";
import { createRecovery } from "../services/recovery.service";

export function useCreateRecovery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [recovery, setRecovery] = useState(null);

  const confirmHandover = useCallback(async ({ claimId, notes }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!claimId) {
        throw new Error("claimId is required to confirm physical recovery.");
      }

      const data = await createRecovery({ claimId, notes });
      setRecovery(data);
      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.message || "Failed to confirm item recovery.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setRecovery(null);
  }, []);

  return {
    loading,
    error,
    success,
    recovery,
    confirmHandover,
    reset,
  };
}

export default useCreateRecovery;
