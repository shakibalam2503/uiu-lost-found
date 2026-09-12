import React from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "Pending Review",
    cls: "claim-status-pending",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    cls: "claim-status-approved",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    cls: "claim-status-rejected",
    icon: XCircle,
  },
};

/**
 * ClaimStatusBadge — Displays claim status badge (pending, approved, rejected)
 * Props:
 *   status: "pending" | "approved" | "rejected"
 *   size?: "sm" | "md" | "lg"
 */
export function ClaimStatusBadge({ status = "pending", size = "md" }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span className={`claim-status-badge ${config.cls} badge-size-${size}`}>
      <Icon size={size === "sm" ? 12 : size === "lg" ? 16 : 14} />
      <span>{config.label}</span>
    </span>
  );
}

export default ClaimStatusBadge;
