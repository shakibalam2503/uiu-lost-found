import { useContext } from "react";
import { DashboardContext } from "../dashboard.context";

export const useDashboardItems = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardItems must be used within a DashboardProvider");
  }
  return context;
};

export default useDashboardItems;
