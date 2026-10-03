import { useState, useCallback } from "react";
import { getMyFoundTickets } from "../services/foundTicket.service";

export const useMyFoundTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyFoundTickets();
      setTickets(data || []);
    } catch (err) {
      setError(err.message || "Failed to load your found item tickets.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { tickets, loading, error, loadTickets };
};

export default useMyFoundTickets;
