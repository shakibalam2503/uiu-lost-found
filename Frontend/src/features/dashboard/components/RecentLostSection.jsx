import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Eye, MapPin, Tag, User } from "lucide-react";
import Button from "../../../components/ui/button";

export const RecentLostSection = ({ items = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-section-card">
      <div className="section-card-header">
        <div className="section-header-title">
          <div className="section-icon-wrap orange">
            <Search size={18} />
          </div>
          <div>
            <h3 className="section-title">Recently Reported Lost Items</h3>
            <p className="section-subtitle">Item loss declarations posted by students & faculty</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard")}
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </Button>
      </div>

      <div className="section-card-body">
        {items.length === 0 ? (
          <div className="section-empty-state">
            <Search size={32} className="empty-icon text-muted" />
            <p className="empty-text">No lost item reports recorded recently.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Item Title</th>
                  <th>Reporter</th>
                  <th>Category</th>
                  <th>Lost Location</th>
                  <th>Reported Date</th>
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
                          <div className="table-thumb-fallback orange">
                            <Search size={14} />
                          </div>
                        )}
                        <span className="table-item-title">{item.title}</span>
                      </div>
                    </td>
                    <td>
                      <div className="user-cell">
                        <div className="user-cell-avatar">
                          {item.reporterName ? item.reporterName.charAt(0).toUpperCase() : <User size={14} />}
                        </div>
                        <div>
                          <div className="user-cell-name">{item.reporterName || "Campus Member"}</div>
                          <div className="user-cell-sub">{item.reporterEmail}</div>
                        </div>
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
                        {item.lostDate || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent")}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/items/lost/${item.id}`)}
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

export default RecentLostSection;
