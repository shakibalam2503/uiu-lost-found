import React from "react";
import Badge from "../../../components/ui/badge";

export const StatusBadge = ({ type = "lost", status = "lost" }) => {
  const isFound = type === "found" || status === "found";

  const getStatusLabel = () => {
    switch (status) {
      case "matched":
        return "Matched";
      case "claim_requested":
        return "Claim Requested";
      case "recovered":
        return "Recovered";
      case "closed":
        return "Closed";
      case "found":
        return "Found Item";
      case "lost":
      default:
        return isFound ? "Found Item" : "Lost Item";
    }
  };

  const getVariant = () => {
    if (status === "recovered" || status === "closed") return "default";
    if (status === "matched") return "warning";
    if (status === "claim_requested") return "info";
    return isFound ? "success" : "warning";
  };

  return (
    <Badge variant={getVariant()} dot>
      {getStatusLabel()}
    </Badge>
  );
};

export default StatusBadge;
