import { useState, useEffect, useCallback } from "react";
import { getStaffDashboardData } from "../services/staff-dashboard.service";

export function useStaffDashboard() {
  const [data, setData] = useState({
    stats: {
      totalLostItems: 0,
      totalFoundItems: 0,
      pendingClaims: 0,
      approvedClaims: 0,
      recoveredItems: 0,
    },
    pendingClaims: [],
    recentFoundItems: [],
    recentLostItems: [],
    recentRecoveries: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getStaffDashboardData();
      setData(result);
    } catch (err) {
      console.error("Error fetching staff dashboard data:", err);
      setError(err.message || "Failed to load staff dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    ...data,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}

export default useStaffDashboard;
