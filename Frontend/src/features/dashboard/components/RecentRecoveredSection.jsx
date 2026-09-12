import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Eye, User, Calendar } from "lucide-react";
import Button from "../../../components/ui/button";

export const RecentRecoveredSection = ({ recoveries = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-section-card">
      <div className="section-card-header">
        <div className="section-header-title">
          <div className="section-icon-wrap purple">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <h3 className="section-title">Recently Recovered Items</h3>
            <p className="section-subtitle">Successfully verified handovers completed at security desk</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/recoveries/staff")}
        >
          <span>View All Log</span>
          <ArrowRight size={14} />
        </Button>
      </div>

      <div className="section-card-body">
        {recoveries.length === 0 ? (
          <div className="section-empty-state">
            <CheckCircle2 size={32} className="empty-icon text-muted" />
            <p className="empty-text">No item recovery handovers logged yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Recovered Item</th>
                  <th>Claimant / Owner</th>
                  <th>Handover Date</th>
                  <th>Handover Notes</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recoveries.map((rec) => (
                  <tr key={rec.id}>
                    <td>
                      <div className="item-title-cell">
                        <div className="table-thumb-fallback purple">
                          <CheckCircle2 size={14} />
                        </div>
                        <span className="table-item-title">
                          {rec.itemTitle || rec.foundItemTitle || "Recovered Belonging"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="user-cell">
                        <div className="user-cell-avatar purple">
                          {rec.claimantName ? rec.claimantName.charAt(0).toUpperCase() : <User size={14} />}
                        </div>
                        <div>
                          <div className="user-cell-name">{rec.claimantName || "Owner"}</div>
                          <div className="user-cell-sub">{rec.claimantEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="table-date">
                        <Calendar size={12} />
                        {rec.recoveredAt ? new Date(rec.recoveredAt).toLocaleDateString() : (rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "Recent")}
                      </span>
                    </td>
                    <td>
                      <span className="table-notes-text">
                        {rec.notes || "Handover completed & verified by staff."}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/recoveries/${rec.id}`)}
                      >
                        <Eye size={14} />
                        <span>Receipt</span>
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

export default RecentRecoveredSection;
