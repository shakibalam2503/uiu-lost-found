import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Ticket, Calendar, Tag, MapPin, CheckCircle, XCircle, Clock, User, AlertCircle } from "lucide-react";
import { getFoundTicketById } from "../services/foundTicket.service";
import { useUpdateFoundTicketStatus } from "../hooks/useUpdateFoundTicketStatus";
import useAuth from "../../auth/hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";

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
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Unknown Date";
  }
}

export function FoundTicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateStatus, loading: updateLoading, error: updateError } = useUpdateFoundTicketStatus();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [staffNote, setStaffNote] = useState("");

  const isStaff = user?.role === "staff" || user?.role === "admin";

  const fetchTicket = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFoundTicketById(id);
      setTicket(data);
    } catch (err) {
      setError(err.message || "Failed to load ticket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusUpdate = async (status) => {
    if (status === "rejected" && !staffNote.trim()) {
      alert("Please provide a reason in the staff note before rejecting.");
      return;
    }
    
    if (window.confirm(`Are you sure you want to ${status} this ticket?`)) {
      try {
        await updateStatus(id, status, staffNote);
        fetchTicket(); // refresh after update
      } catch (e) {
        // handled in hook, but we could alert
        alert("Failed to update status");
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <LoadingSpinner size="large" text="Loading ticket details..." />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="page-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back
          </button>
        </div>
        <div className="page-error-banner">
          <span>⚠️ {error || "Ticket not found."}</span>
        </div>
      </div>
    );
  }

  const renderStatusBox = () => {
    if (ticket.status === "accepted") {
      return (
        <div style={{ backgroundColor: "#ecfdf5", color: "#065f46", padding: "16px", borderRadius: "8px", border: "1px solid #a7f3d0", display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <CheckCircle size={24} color="#10b981" />
          <div>
            <strong>Accepted</strong>
            <p style={{ margin: 0, fontSize: "14px", marginTop: "4px" }}>The item has been registered with Lost & Found.</p>
          </div>
        </div>
      );
    }
    if (ticket.status === "rejected") {
      return (
        <div style={{ backgroundColor: "#fef2f2", color: "#991b1b", padding: "16px", borderRadius: "8px", border: "1px solid #fecaca", display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <XCircle size={24} color="#ef4444" />
          <div>
            <strong>Rejected</strong>
            <p style={{ margin: 0, fontSize: "14px", marginTop: "4px" }}>{ticket.staffNote ? `Reason: ${ticket.staffNote}` : "This ticket was rejected."}</p>
          </div>
        </div>
      );
    }
    return (
      <div style={{ backgroundColor: "#fffbeb", color: "#92400e", padding: "16px", borderRadius: "8px", border: "1px solid #fde68a", display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Clock size={24} color="#f59e0b" />
        <div>
          <strong>Pending Review</strong>
          <p style={{ margin: 0, fontSize: "14px", marginTop: "4px" }}>Waiting for Lost & Found review.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="page-title-block">
          <h1 className="page-title">
            <Ticket size={22} className="page-title-icon" style={{ color: "#3b82f6" }} />
            Ticket Details
          </h1>
        </div>
      </div>

      {renderStatusBox()}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
        <div className="item-details-card" style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>{ticket.title}</h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
            <span className="summary-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '16px', color: '#475569' }}>
              <Tag size={14} /> {ticket.category}
            </span>
            {ticket.color && (
              <span className="summary-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '16px', color: '#475569' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: ticket.color.toLowerCase() === 'white' ? '#f8fafc' : ticket.color.toLowerCase(), border: '1px solid #cbd5e1' }} />
                {ticket.color}
              </span>
            )}
            <span className="summary-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '16px', color: '#475569' }}>
              <Calendar size={14} /> Found on: {formatDate(ticket.foundDate)}
            </span>
            <span className="summary-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '16px', color: '#475569' }}>
              <Clock size={14} /> Submitted: {formatDate(ticket.createdAt)}
            </span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#334155', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} /> Location Details
            </h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>
              {ticket.building || "Building not specified"}
              {ticket.floor && ` — ${ticket.floor}`}
              {ticket.locationDescription && <><br />{ticket.locationDescription}</>}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Description</h3>
            <p style={{ color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {ticket.description || "No description provided."}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {ticket.imageUrls && ticket.imageUrls.length > 0 && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>Item Photo</h3>
              <img src={ticket.imageUrls[0]} alt="Found Item" style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }} />
            </div>
          )}

          {isStaff && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#334155', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} /> Submitter Info
              </h3>
              <div style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}>
                <strong>Name:</strong> {ticket.studentName}
              </div>
              <div style={{ fontSize: '14px', color: '#475569' }}>
                <strong>Email:</strong> {ticket.studentEmail}
              </div>
            </div>
          )}

          {isStaff && ticket.status === "pending" && (
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>Staff Review</h3>
              
              {updateError && (
                <div style={{ backgroundColor: "#fef2f2", color: "#991b1b", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px", display: "flex", gap: "8px", alignItems: "center" }}>
                  <AlertCircle size={16} /> {updateError}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Staff Note (Optional)</label>
                <textarea 
                  className="form-textarea" 
                  rows="3" 
                  placeholder="Note for the student..." 
                  value={staffNote} 
                  onChange={(e) => setStaffNote(e.target.value)}
                  disabled={updateLoading}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => handleStatusUpdate("accepted")} 
                  disabled={updateLoading}
                  style={{ flex: 1, backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: '500', cursor: updateLoading ? 'not-allowed' : 'pointer' }}
                >
                  {updateLoading ? 'Processing...' : 'Accept'}
                </button>
                <button 
                  onClick={() => handleStatusUpdate("rejected")} 
                  disabled={updateLoading}
                  style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: '500', cursor: updateLoading ? 'not-allowed' : 'pointer' }}
                >
                  {updateLoading ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoundTicketDetailsPage;
