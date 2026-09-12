import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import useItemDetails from "../hooks/useItemDetails";
import ItemDetailsView from "../components/ItemDetailsView";
import LoadingSpinner from "../../../components/LoadingSpinner";

/**
 * ItemDetailsPage — Generic reusable route page for viewing Lost and Found items
 * Props:
 *   defaultType?: "lost" | "found"
 */
export function ItemDetailsPage({ defaultType }) {
  const { id, type } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine itemType from route params, explicit prop, or URL path pattern
  let itemType = defaultType || type;
  if (!itemType) {
    if (location.pathname.includes("/found-items/")) {
      itemType = "found";
    } else {
      itemType = "lost";
    }
  }

  const { item, loading, error, setStatus, deleteItem } = useItemDetails(itemType, id);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete this ${itemType} item report?`)) return;
    try {
      await deleteItem();
      navigate(itemType === "found" ? "/found-items" : "/lost-items/my");
    } catch (err) {
      alert(err.message || "Failed to delete item.");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="detail-skeleton" style={{ padding: "40px 0" }}>
          <LoadingSpinner size="large" text={`Loading ${itemType} item details...`} />
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="page-container">
        <div className="page-error-state">
          <AlertTriangle size={48} />
          <h2>Item Not Found</h2>
          <p>{error || "The requested item report could not be found."}</p>
          <button className="btn-primary" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <ItemDetailsView
        item={item}
        itemType={itemType}
        onDelete={handleDelete}
        onStatusChange={setStatus}
      />
    </div>
  );
}

export default ItemDetailsPage;
