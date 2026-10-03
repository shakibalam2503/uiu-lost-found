import { useState } from "react";
import { createFoundTicket } from "../services/foundTicket.service";

export const useCreateFoundTicket = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitTicket = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createFoundTicket(formData);
      return result;
    } catch (err) {
      setError(err.message || "Failed to submit ticket.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitTicket, loading, error };
};

export default useCreateFoundTicket;
