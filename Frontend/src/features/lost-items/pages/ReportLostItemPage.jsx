import React from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LostItemForm } from "../components/LostItemForm";

/**
 * ReportLostItemPage — page for reporting a new lost item
 */
export function ReportLostItemPage() {
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
            <AlertTriangle size={22} className="page-title-icon lost" />
            Report a Lost Item
          </h1>
          <p className="page-subtitle">
            Fill in the details below. The more information you provide, the easier it is to find your item.
          </p>
        </div>
      </div>

      <div className="page-content-card">
        <LostItemForm />
      </div>
    </div>
  );
}

export default ReportLostItemPage;
