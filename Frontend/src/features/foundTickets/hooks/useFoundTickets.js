import { useState, useCallback } from "react";
import { getFoundTickets } from "../services/foundTicket.service";

export const useFoundTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFoundTickets();
      setTickets(data || []);
    } catch (err) {
      setError(err.message || "Failed to load found item tickets.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { tickets, loading, error, loadTickets };
};

export default useFoundTickets;
