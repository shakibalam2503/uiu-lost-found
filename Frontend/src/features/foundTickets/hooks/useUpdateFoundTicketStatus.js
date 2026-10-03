import { useState } from "react";
import { updateFoundTicketStatus } from "../services/foundTicket.service";

export const useUpdateFoundTicketStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateStatus = async (id, status, staffNote) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateFoundTicketStatus(id, status, staffNote);
      return result;
    } catch (err) {
      setError(err.message || "Failed to update ticket status.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading, error };
};

export default useUpdateFoundTicketStatus;
