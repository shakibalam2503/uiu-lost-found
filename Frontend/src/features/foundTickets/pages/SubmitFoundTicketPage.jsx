import React from "react";
import { ArrowLeft, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FoundTicketForm } from "../components/FoundTicketForm";

export function SubmitFoundTicketPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="page-title-block">
          <h1 className="page-title">
            <Ticket size={22} className="page-title-icon" style={{ color: "#3b82f6" }} />
            Submit Found Item Ticket
          </h1>
          <p className="page-subtitle">
            Found something after hours? Submit a ticket here, and Lost & Found staff will review it.
          </p>
        </div>
      </div>

      <div className="page-content-card">
        <FoundTicketForm />
      </div>
    </div>
  );
}

export default SubmitFoundTicketPage;
