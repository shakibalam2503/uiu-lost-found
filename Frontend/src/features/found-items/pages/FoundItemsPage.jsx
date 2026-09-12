import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, RefreshCw, Archive } from "lucide-react";
import { FoundItemList } from "../components/FoundItemList";
import { FoundItemFilters } from "../components/FoundItemFilters";
import { useFoundItemsContext } from "../found-items.context";
import { AuthContext } from "../../auth/auth.context";

/**
 * FoundItemsPage — displays the list of found items across campus
 * Supports filtering, searching, viewing, claiming (student/faculty), and registering/editing/deleting (staff/admin).
 */
export function FoundItemsPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isStaff = user?.role === "staff" || user?.role === "admin";
  const canClaim = user?.role === "student" || user?.role === "faculty";

  const {
    items,
    loading,
    error,
    loadItems,
    removeItem,
    category, setCategory,
    color, setColor,
    building, setBuilding,
    floor, setFloor,
    sortBy, setSortBy,
    resetFilters,
  } = useFoundItemsContext();

  useEffect(() => {
    loadItems();
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
            <Archive size={22} className="page-title-icon found" />
            Found Items
          </h1>
          <p className="page-subtitle">
            Browse and search items that have been turned into lost & found offices across campus.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            className="btn-icon-outline"
            onClick={() => loadItems()}
            disabled={loading}
            title="Refresh list"
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
          </button>
          {isStaff && (
            <button
              className="btn-primary"
              onClick={() => navigate("/found-items/register")}
            >
              <PlusCircle size={16} /> Register Found Item
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <FoundItemFilters
        category={category} setCategory={setCategory}
        color={color} setColor={setColor}
        building={building} setBuilding={setBuilding}
        floor={floor} setFloor={setFloor}
        sortBy={sortBy} setSortBy={setSortBy}
        onReset={resetFilters}
      />

      {/* Error banner */}
      {error && (
        <div className="page-error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => loadItems()}>Retry</button>
        </div>
      )}

      {/* Stats counter */}
      {!loading && items.length > 0 && (
        <div className="page-stats-bar">
          <span>{items.length} item{items.length !== 1 ? "s" : ""} found</span>
          <span className="stat-sep">•</span>
          <span className="stat-found">
            {items.filter((i) => i.status === "found" || !i.status).length} available for claim
          </span>
        </div>
      )}

      {/* Found Item Grid / Empty State */}
      <FoundItemList
        items={items}
        loading={loading}
        isStaff={isStaff}
        canClaim={canClaim}
        onDelete={handleDelete}
        emptyMessage="No found items match your criteria"
        emptySubMessage="Try adjusting your filters or search terms."
      />
    </div>
  );
}

export default FoundItemsPage;
