import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Tag, Ticket, Eye, MapPin, User, AlertCircle, RefreshCw } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "Unknown Date";
  try {
    let d = dateStr;
    if (typeof dateStr === "object" && dateStr._seconds) {
      d = new Date(dateStr._seconds * 1000);
    } else {
      d = new Date(dateStr);
    }
    if (isNaN(d.getTime())) return "Unknown Date";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Unknown Date";
  }
}

function getStatusBadge(status) {
  switch (status) {
    case "accepted":
      return <span className="status-badge" style={{ backgroundColor: "#10b981", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "12px" }}>Accepted</span>;
    case "rejected":
      return <span className="status-badge" style={{ backgroundColor: "#ef4444", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "12px" }}>Rejected</span>;
    case "pending":
    default:
      return <span className="status-badge" style={{ backgroundColor: "#f59e0b", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "12px" }}>Pending</span>;
  }
}

export function FoundTicketCard({ ticket, isStaff = false }) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(isStaff ? `/staff/found-tickets/${ticket.id}` : `/found-tickets/${ticket.id}`);
  };

  return (
    <div className="claim-card" onClick={handleView}>
      <div className="claim-card-header">
        <div className="claim-card-title-group">
          <span className="claim-id-tag">Ticket #{ticket.id?.substring(0, 8)}</span>
          {getStatusBadge(ticket.status)}
        </div>
        <span className="claim-date">
          <Clock size={12} /> {formatDate(ticket.createdAt)}
        </span>
      </div>

      <div className="claim-card-body">
        <div className="claim-item-summary found">
          <h4 className="summary-title">{ticket.title}</h4>
          {ticket.category && (
            <span className="summary-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' }}>
              <Tag size={12} /> {ticket.category}
            </span>
          )}
        </div>

        {ticket.building && (
          <div className="claim-item-summary">
            <span className="summary-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginTop: '4px', color: '#64748b' }}>
              <MapPin size={12} /> {ticket.building} {ticket.floor ? `- ${ticket.floor}` : ''}
            </span>
          </div>
        )}

        {isStaff && (ticket.studentName || ticket.studentEmail) && (
          <div className="claim-claimant-info" style={{ marginTop: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
            <User size={13} />
            <span>
              Student: <strong>{ticket.studentName || "Student Member"}</strong> (
              {ticket.studentEmail})
            </span>
          </div>
        )}
      </div>

      <div className="claim-card-footer">
        <button type="button" className="btn-view-claim" onClick={handleView}>
          <Eye size={14} /> View Ticket Details
        </button>
      </div>
    </div>
  );
}

export default FoundTicketCard;
