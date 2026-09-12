import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import ClaimDetails from "../components/ClaimDetails";
import { getClaimById } from "../services/claim.service";
import LoadingSpinner from "../../../components/LoadingSpinner";

/**
 * ClaimDetailsPage — Full page container for viewing an individual claim
 */
export function ClaimDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadClaim() {
      setLoading(true);
      setError(null);
      try {
        const data = await getClaimById(id);
        if (mounted) setClaim(data);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load claim details.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadClaim();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="large" text="Loading ownership claim details..." />
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="page-container">
        <div className="page-error-state">
          <AlertTriangle size={48} />
          <h2>Claim Not Found</h2>
          <p>{error || "The requested ownership claim could not be retrieved."}</p>
          <button className="btn-primary" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <ClaimDetails claim={claim} onClaimUpdate={(updated) => setClaim(updated)} />
    </div>
  );
}

export default ClaimDetailsPage;
