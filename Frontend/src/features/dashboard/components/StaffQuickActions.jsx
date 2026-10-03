import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, ClipboardCheck, Archive, ArrowRight, Ticket } from "lucide-react";
import Button from "../../../components/ui/button";

export const StaffQuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="staff-quick-actions-card">
      <div className="quick-actions-header">
        <h3 className="quick-actions-title">Staff Quick Operations</h3>
        <span className="quick-actions-badge">Administrative Hub</span>
      </div>
      <div className="quick-actions-grid">
        <button
          type="button"
          className="quick-action-btn primary"
          onClick={() => navigate("/found-items/register")}
        >
          <div className="quick-action-icon">
            <PlusCircle size={22} />
          </div>
          <div className="quick-action-text">
            <span className="action-main">Register Found Item</span>
            <span className="action-sub">Log newly received inventory at desk</span>
          </div>
          <ArrowRight size={16} className="action-arrow" />
        </button>

        <button
          type="button"
          className="quick-action-btn secondary"
          onClick={() => navigate("/claims/manage")}
        >
          <div className="quick-action-icon">
            <ClipboardCheck size={22} />
          </div>
          <div className="quick-action-text">
            <span className="action-main">Review Claims Queue</span>
            <span className="action-sub">Evaluate ownership proof submissions</span>
          </div>
          <ArrowRight size={16} className="action-arrow" />
        </button>

        <button
          type="button"
          className="quick-action-btn accent"
          onClick={() => navigate("/recoveries/staff")}
        >
          <div className="quick-action-icon">
            <Archive size={22} />
          </div>
          <div className="quick-action-text">
            <span className="action-main">View Recoveries Log</span>
            <span className="action-sub">Inspect completed item handovers</span>
          </div>
          <ArrowRight size={16} className="action-arrow" />
        </button>

        <button
          type="button"
          className="quick-action-btn secondary"
          style={{ background: "linear-gradient(to right, #eff6ff, #dbeafe)", borderColor: "#bfdbfe" }}
          onClick={() => navigate("/staff/found-tickets")}
        >
          <div className="quick-action-icon" style={{ backgroundColor: "#3b82f6", color: "#fff" }}>
            <Ticket size={22} />
          </div>
          <div className="quick-action-text">
            <span className="action-main" style={{ color: "#1e3a8a" }}>Review Found Tickets</span>
            <span className="action-sub" style={{ color: "#3b82f6" }}>Process student after-hours items</span>
          </div>
          <ArrowRight size={16} className="action-arrow" style={{ color: "#3b82f6" }} />
        </button>
      </div>
    </div>
  );
};

export default StaffQuickActions;
