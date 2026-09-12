import React from "react";
import ItemDetailsPage from "../../item-details/pages/ItemDetailsPage";

/**
 * FoundItemDetailsPage — Wrapper around the reusable ItemDetailsPage for found items
 */
export function FoundItemDetailsPage() {
  return <ItemDetailsPage defaultType="found" />;
}

export default FoundItemDetailsPage;
