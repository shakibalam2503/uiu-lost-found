import React from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";

/**
 * RecoveryStatusBadge — Displays status badge for recovery records
 * Statuses: "completed" | "recovered"
 */
export function RecoveryStatusBadge({ status = "completed", size = "md" }) {
  const isCompleted = status === "completed" || status === "recovered";

  return (
    <span className={`recovery-status-badge ${isCompleted ? "status-completed" : "status-pending"} badge-size-${size}`}>
      <CheckCircle2 size={size === "sm" ? 12 : size === "lg" ? 16 : 14} />
      <span>{isCompleted ? "Item Recovered" : "Processing"}</span>
    </span>
  );
}

export default RecoveryStatusBadge;
