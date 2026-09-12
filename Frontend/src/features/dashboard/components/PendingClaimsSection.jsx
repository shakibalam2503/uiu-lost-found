import React from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, ArrowRight, Eye, Clock, User } from "lucide-react";
import Button from "../../../components/ui/button";

export const PendingClaimsSection = ({ claims = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-section-card">
      <div className="section-card-header">
        <div className="section-header-title">
          <div className="section-icon-wrap amber">
            <ClipboardList size={18} />
          </div>
          <div>
            <h3 className="section-title">Pending Claims</h3>
            <p className="section-subtitle">Ownership claims requiring staff review & verification</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/claims/manage")}
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </Button>
      </div>

      <div className="section-card-body">
        {claims.length === 0 ? (
          <div className="section-empty-state">
            <Clock size={32} className="empty-icon text-muted" />
            <p className="empty-text">No pending claims awaiting review right now.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Claimant</th>
                  <th>Item Target</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-cell-avatar">
                          {claim.claimantName ? claim.claimantName.charAt(0).toUpperCase() : <User size={14} />}
                        </div>
                        <div>
                          <div className="user-cell-name">{claim.claimantName || "Student"}</div>
                          <div className="user-cell-sub">{claim.claimantEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="table-item-title">
                        {claim.foundItemTitle || claim.foundItem?.title || "Found Item"}
                      </span>
                    </td>
                    <td>
                      <span className="table-date">
                        {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : "Recent"}
                      </span>
                    </td>
                    <td>
                      <span className="staff-status-badge pending">Pending</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Button
                        variant="gradient"
                        size="sm"
                        onClick={() => navigate(`/claims/${claim.id}`)}
                      >
                        <Eye size={14} />
                        <span>Review</span>
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

export default PendingClaimsSection;
