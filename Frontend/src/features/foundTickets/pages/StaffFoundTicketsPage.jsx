import React, { useEffect } from "react";
import { Ticket, RefreshCw, Inbox } from "lucide-react";
import { useFoundTickets } from "../hooks/useFoundTickets";
import { FoundTicketCard } from "../components/FoundTicketCard";

export function StaffFoundTicketsPage() {
  const { tickets, loading, error, loadTickets } = useFoundTickets();

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-block">
          <h1 className="page-title">
            <Ticket size={22} className="page-title-icon" style={{ color: "#3b82f6" }} />
            Found Item Tickets
          </h1>
          <p className="page-subtitle">
            Review after-hours found item tickets submitted by students.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            className="btn-icon-outline"
            onClick={loadTickets}
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
          </button>
        </div>
      </div>

      {error && (
        <div className="page-error-banner">
          <span>⚠️ {error}</span>
          <button onClick={loadTickets}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="claims-grid-feed">
          {[1, 2, 3].map((i) => (
            <div key={i} className="lost-item-skeleton" style={{ height: "200px", background: "#f1f5f9", borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="lost-item-empty" style={{ textAlign: "center", padding: "40px", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
          <div className="lost-item-empty-icon" style={{ display: "inline-flex", padding: "16px", background: "#fff", borderRadius: "50%", marginBottom: "16px", color: "#94a3b8" }}>
            <Inbox size={48} />
          </div>
          <h3 style={{ fontSize: "18px", color: "#334155", marginBottom: "8px" }}>No tickets found.</h3>
          <p style={{ color: "#64748b" }}>There are no after-hours found item tickets in the system.</p>
        </div>
      ) : (
        <div className="claims-grid-feed" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginTop: "20px" }}>
          {tickets.map((ticket) => (
            <FoundTicketCard key={ticket.id} ticket={ticket} isStaff={true} />
          ))}
        </div>
      )}
    </div>
  );
}

export default StaffFoundTicketsPage;
