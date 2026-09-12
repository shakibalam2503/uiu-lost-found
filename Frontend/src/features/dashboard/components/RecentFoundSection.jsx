import React from "react";
import { useNavigate } from "react-router-dom";
import { Package, ArrowRight, Eye, MapPin, Tag } from "lucide-react";
import Button from "../../../components/ui/button";

export const RecentFoundSection = ({ items = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-section-card">
      <div className="section-card-header">
        <div className="section-header-title">
          <div className="section-icon-wrap green">
            <Package size={18} />
          </div>
          <div>
            <h3 className="section-title">Recently Registered Found Items</h3>
            <p className="section-subtitle">Items surrendered to security desk or library</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/found-items")}
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </Button>
      </div>

      <div className="section-card-body">
        {items.length === 0 ? (
          <div className="section-empty-state">
            <Package size={32} className="empty-icon text-muted" />
            <p className="empty-text">No found items registered recently.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Item Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Logged Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="item-title-cell">
                        {item.imageUrls && item.imageUrls[0] ? (
                          <img
                            src={item.imageUrls[0]}
                            alt={item.title}
                            className="table-thumb-img"
                          />
                        ) : (
                          <div className="table-thumb-fallback">
                            <Package size={14} />
                          </div>
                        )}
                        <span className="table-item-title">{item.title}</span>
                      </div>
                    </td>
                    <td>
                      <span className="table-category-tag">
                        <Tag size={12} />
                        {item.category || "General"}
                      </span>
                    </td>
                    <td>
                      <span className="table-location">
                        <MapPin size={12} />
                        {item.building || "Campus"}{item.floor ? ` (${item.floor})` : ""}
                      </span>
                    </td>
                    <td>
                      <span className="table-date">
                        {item.foundDate || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent")}
                      </span>
                    </td>
                    <td>
                      <span className={`staff-status-badge ${item.status || "unclaimed"}`}>
                        {item.status || "unclaimed"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/items/found/${item.id}`)}
                      >
                        <Eye size={14} />
                        <span>Inspect</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentFoundSection;
