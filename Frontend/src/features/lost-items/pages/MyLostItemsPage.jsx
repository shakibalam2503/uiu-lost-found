import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, RefreshCw, ClipboardList } from "lucide-react";
import { LostItemList } from "../components/LostItemList";
import { LostItemFilters } from "../components/LostItemFilters";
import { useLostItemsContext } from "../lost-items.context";
import { AuthContext } from "../../auth/auth.context";

/**
 * MyLostItemsPage — shows the authenticated user's own lost item reports
 */
export function MyLostItemsPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    myItems,
    myItemsLoading,
    error,
    loadMyItems,
    removeItem,
    category, setCategory,
    color, setColor,
    building, setBuilding,
    floor, setFloor,
    sortBy, setSortBy,
    resetFilters,
  } = useLostItemsContext();

  useEffect(() => {
    loadMyItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    try {
      await removeItem(id);
    } catch (err) {
      alert(err.message || "Failed to delete item.");
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-block">
          <h1 className="page-title">
            <ClipboardList size={22} className="page-title-icon lost" />
            My Lost Item Reports
          </h1>
          <p className="page-subtitle">
            {user?.name ? `Hello, ${user.name.split(" ")[0]}!` : "Hello!"} Here are all your submitted reports.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            className="btn-icon-outline"
            onClick={loadMyItems}
            disabled={myItemsLoading}
            title="Refresh"
          >
            <RefreshCw size={16} className={myItemsLoading ? "spin" : ""} />
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate("/lost-items/report")}
          >
            <PlusCircle size={16} /> Report New Item
          </button>
        </div>
      </div>

      {/* Filters */}
      <LostItemFilters
        category={category} setCategory={setCategory}
        color={color} setColor={setColor}
        building={building} setBuilding={setBuilding}
        floor={floor} setFloor={setFloor}
        sortBy={sortBy} setSortBy={setSortBy}
        onReset={resetFilters}
      />

      {/* Error */}
      {error && (
        <div className="page-error-banner">
          <span>⚠️ {error}</span>
          <button onClick={loadMyItems}>Retry</button>
        </div>
      )}

      {/* Stats bar */}
      {!myItemsLoading && myItems.length > 0 && (
        <div className="page-stats-bar">
          <span>{myItems.length} report{myItems.length !== 1 ? "s" : ""}</span>
          <span className="stat-sep">•</span>
          <span className="stat-lost">{myItems.filter((i) => i.status === "lost").length} active</span>
          {myItems.filter((i) => i.status === "returned").length > 0 && (
            <>
              <span className="stat-sep">•</span>
              <span className="stat-returned">
                {myItems.filter((i) => i.status === "returned").length} returned
              </span>
            </>
          )}
        </div>
      )}

      {/* Items list */}
      <LostItemList
        items={myItems}
        loading={myItemsLoading}
        showActions={true}
        onDelete={handleDelete}
        emptyMessage="No reports yet"
        emptySubMessage="You haven't reported any lost items. Click 'Report New Item' to get started."
      />
    </div>
  );
}

export default MyLostItemsPage;
