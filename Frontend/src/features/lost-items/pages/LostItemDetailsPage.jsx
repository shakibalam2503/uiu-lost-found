import React from "react";
import ItemDetailsPage from "../../item-details/pages/ItemDetailsPage";

/**
 * LostItemDetailsPage — Wrapper around the reusable ItemDetailsPage for lost items
 */
export function LostItemDetailsPage() {
  return <ItemDetailsPage defaultType="lost" />;
}

export default LostItemDetailsPage;
